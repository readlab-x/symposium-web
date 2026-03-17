<script lang="ts">
	import { page } from "$app/stores";
	import AnnotationPanel from "$lib/components/reading/annotation-panel.svelte";
	import DialogueList from "$lib/components/reading/dialogue-list.svelte";
	import {
		getReadingAnnotationWrapClass,
		getReadingDialogueColumnClass,
		getReadingHeaderLayoutClass
	} from "$lib/components/reading/reading-toolbar-layout.js";
	import SpeakerFilter from "$lib/components/reading/speaker-filter.svelte";
	import annotationData from "$lib/data/annotations.json";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import placeData from "$lib/data/places.json";
	import { resolveSpeakerIdsFromQuery } from "$lib/reading/speaker-query.js";
	import {
		getDisplayCharacterName,
		getDisplayCharacterSummary,
		getDisplayPlaceName,
		getDisplayPlaceSummary,
		i18nPreferences,
		pickByLanguage
	} from "$lib/stores/i18n";
	import type {
		Annotation,
		Character,
		DialogLine,
		EntityReference,
		Place
	} from "$lib/types";

	const dialogs = dialogData as DialogLine[];
	const characters = characterData as Character[];
	const places = placeData as Place[];
	const annotations = annotationData as Annotation[];

	const defaultSpeakerIds = Array.from(new Set(dialogs.map((line) => line.speakerId)));
	const speakers = characters.filter((character) => defaultSpeakerIds.includes(character.id));
	const speakersById = Object.fromEntries(
		characters.map((character) => [character.id, character])
	) as Record<string, Character>;

	const entityReferences = $derived.by(
		() =>
			[
				...characters.map((character) => ({
					id: character.id,
					name: getDisplayCharacterName(character, $i18nPreferences.primaryLanguage),
					type: character.type,
					summary: getDisplayCharacterSummary(character, $i18nPreferences.primaryLanguage),
					avatarImage: character.avatarImage,
					avatarFallback: character.avatar
				})),
				...places.map((place) => ({
					id: place.id,
					name: getDisplayPlaceName(place, $i18nPreferences.primaryLanguage),
					type: place.type,
					summary: getDisplayPlaceSummary(place, $i18nPreferences.primaryLanguage)
				}))
			] satisfies EntityReference[]
	);

	const annotationsByLine = annotations.reduce<Record<string, Annotation[]>>((acc, annotation) => {
		acc[annotation.lineId] ??= [];
		acc[annotation.lineId].push(annotation);
		return acc;
	}, {});

	let activeSpeakerIds = $state<string[]>(
		resolveSpeakerIdsFromQuery($page.url.searchParams.get("speakers"), defaultSpeakerIds, defaultSpeakerIds)
	);
	let lastAppliedSpeakerQuery = $state($page.url.searchParams.get("speakers") ?? "");
	let selectedLineId = $state<string | null>(dialogs[0]?.id ?? null);

	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "原文阅读台",
				description: "以原文为主线阅读，按需展开翻译与学术注解。"
			},
			"en-US": {
				title: "Original Text Reading",
				description: "Read with the original text first, then expand translations and annotations as needed."
			}
		})
	);

	const filteredLines = $derived.by(() =>
		dialogs.filter((line) => activeSpeakerIds.includes(line.speakerId))
	);

	$effect(() => {
		const speakerQuery = $page.url.searchParams.get("speakers") ?? "";
		if (speakerQuery === lastAppliedSpeakerQuery) return;

		lastAppliedSpeakerQuery = speakerQuery;
		activeSpeakerIds = resolveSpeakerIdsFromQuery(
			speakerQuery,
			defaultSpeakerIds,
			defaultSpeakerIds
		);
	});

	$effect(() => {
		if (filteredLines.length === 0) {
			selectedLineId = null;
			return;
		}

		const stillVisible = selectedLineId && filteredLines.some((line) => line.id === selectedLineId);
		if (!stillVisible) {
			selectedLineId = filteredLines[0].id;
		}
	});

	const selectedLine = $derived.by(() =>
		selectedLineId ? dialogs.find((line) => line.id === selectedLineId) ?? null : null
	);
	const selectedSpeaker = $derived.by(() =>
		selectedLine ? speakersById[selectedLine.speakerId] : undefined
	);
	const selectedAnnotations = $derived.by(() =>
		selectedLine ? (annotationsByLine[selectedLine.id] ?? []) : []
	);

	function toggleSpeaker(speakerId: string) {
		if (activeSpeakerIds.includes(speakerId)) {
			activeSpeakerIds = activeSpeakerIds.filter((id) => id !== speakerId);
			return;
		}

		activeSpeakerIds = [...activeSpeakerIds, speakerId];
	}

	function resetSpeakers() {
		activeSpeakerIds = defaultSpeakerIds;
	}
</script>

<section class="space-y-5">
	<div class={getReadingHeaderLayoutClass()}>
		<header class="motion-stage-hero max-w-3xl space-y-2">
			<h1 class="text-2xl font-semibold tracking-tight">{copy.title}</h1>
			<p class="text-sm text-muted-foreground">{copy.description}</p>
		</header>

		<aside class="motion-stage-soft motion-delay-1 relative z-30 min-w-0 lg:justify-self-end lg:w-[14rem]">
			<SpeakerFilter
				{speakers}
				activeSpeakerIds={activeSpeakerIds}
				onToggleSpeaker={toggleSpeaker}
				onSelectAll={resetSpeakers}
			/>
		</aside>
	</div>

	<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
		<div class={getReadingDialogueColumnClass()}>
			<DialogueList
				lines={filteredLines}
				{speakersById}
				{selectedLineId}
				{annotationsByLine}
				entities={entityReferences}
				onSelectLine={(lineId) => (selectedLineId = lineId)}
			/>
		</div>

		<div class={getReadingAnnotationWrapClass()}>
			<AnnotationPanel line={selectedLine} speaker={selectedSpeaker} annotations={selectedAnnotations} />
		</div>
	</div>
</section>
