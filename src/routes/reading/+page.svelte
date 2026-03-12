<script lang="ts">
	import AnnotationPanel from "$lib/components/reading/annotation-panel.svelte";
	import DialogueList from "$lib/components/reading/dialogue-list.svelte";
	import SpeakerFilter from "$lib/components/reading/speaker-filter.svelte";
	import { Input } from "$lib/components/ui/input/index.js";
	import annotationData from "$lib/data/annotations.json";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import placeData from "$lib/data/places.json";
	import { getDisplayText, i18nPreferences } from "$lib/stores/i18n";
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
	const speakersById = Object.fromEntries(characters.map((character) => [character.id, character])) as Record<
		string,
		Character
	>;

	const entityReferences: EntityReference[] = [
		...characters.map((character) => ({
			id: character.id,
			name: character.name,
			type: character.type,
			summary: character.summary,
			relatedChapter: character.firstLineId
		})),
		...places.map((place) => ({
			id: place.id,
			name: place.name,
			type: place.type,
			summary: place.summary,
			relatedChapter: place.relatedLineIds[0]
		}))
	];

	const annotationsByLine = annotations.reduce<Record<string, Annotation[]>>((acc, annotation) => {
		acc[annotation.lineId] ??= [];
		acc[annotation.lineId].push(annotation);
		return acc;
	}, {});

	let query = $state("");
	let activeSpeakerIds = $state<string[]>(defaultSpeakerIds);
	let selectedLineId = $state<string | null>(dialogs[0]?.id ?? null);

	const filteredLines = $derived.by(() =>
		dialogs.filter((line) => {
			const speakerMatched = activeSpeakerIds.includes(line.speakerId);
			const visibleText = getDisplayText(line, $i18nPreferences.primaryLanguage);
			const queryMatched =
				query.trim().length === 0 ||
				visibleText.includes(query.trim()) ||
				line.tags.some((tag) => tag.includes(query.trim()));
			return speakerMatched && queryMatched;
		})
	);

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
	<header class="space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">原文阅读台</h1>
		<p class="text-sm text-muted-foreground">以原文为主线阅读，按需展开翻译与学术注解。</p>
	</header>

	<div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
		<div class="space-y-4">
			<details class="group rounded-xl border border-border/60 bg-background/60 p-3 backdrop-blur-sm">
				<summary class="flex cursor-pointer list-none items-center justify-between gap-3">
					<span class="text-sm font-medium">阅读工具</span>
					<span class="text-xs text-muted-foreground group-open:hidden">展开筛选与搜索</span>
					<span class="hidden text-xs text-muted-foreground group-open:inline">收起</span>
				</summary>
				<div class="mt-3 space-y-3">
					<SpeakerFilter
						{speakers}
						activeSpeakerIds={activeSpeakerIds}
						onToggleSpeaker={toggleSpeaker}
						onSelectAll={resetSpeakers}
					/>
					<Input
						bind:value={query}
						placeholder="搜索当前主语言文本或标签，例如：爱 / 灵魂 / Diotima"
						aria-label="搜索阅读文本"
					/>
				</div>
			</details>

			<DialogueList
				lines={filteredLines}
				{speakersById}
				{selectedLineId}
				entities={entityReferences}
				onSelectLine={(lineId) => (selectedLineId = lineId)}
			/>
		</div>

		<AnnotationPanel line={selectedLine} speaker={selectedSpeaker} annotations={selectedAnnotations} />
	</div>
</section>
