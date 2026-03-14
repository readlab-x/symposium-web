<script lang="ts">
	import { ChevronDown } from "@lucide/svelte";
	import AnnotationPanel from "$lib/components/reading/annotation-panel.svelte";
	import DialogueList from "$lib/components/reading/dialogue-list.svelte";
	import SpeakerFilter from "$lib/components/reading/speaker-filter.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import annotationData from "$lib/data/annotations.json";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import placeData from "$lib/data/places.json";
	import { getDisplayText, i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
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
	let toolsExpanded = $state(false);
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "原文阅读台",
				description: "以原文为主线阅读，按需展开翻译与学术注解。",
				toolsTitle: "阅读工具",
				toolsDefaultSummary: "人物筛选与搜索",
				filterSummaryPrefix: "人物",
				keywordPrefix: "关键词",
				collapse: "收起",
				expand: "展开",
				searchPlaceholder: "搜索当前主语言文本或标签，例如：爱 / 灵魂 / Diotima",
				searchAria: "搜索阅读文本"
			},
			"en-US": {
				title: "Original Text Reading",
				description: "Read with the original text first, then expand translations and annotations as needed.",
				toolsTitle: "Reading Tools",
				toolsDefaultSummary: "Speaker filters and search",
				filterSummaryPrefix: "Speakers",
				keywordPrefix: "Keyword",
				collapse: "Collapse",
				expand: "Expand",
				searchPlaceholder:
					"Search text in primary language or tags, e.g. eros / soul / Diotima",
				searchAria: "Search reading text"
			}
		})
	);
	const toolSummary = $derived.by(() => {
		const parts: string[] = [];
		if (activeSpeakerIds.length !== defaultSpeakerIds.length) {
			parts.push(`${copy.filterSummaryPrefix} ${activeSpeakerIds.length}/${defaultSpeakerIds.length}`);
		}
		const trimmedQuery = query.trim();
		if (trimmedQuery.length > 0) {
			parts.push(`${copy.keywordPrefix}: ${trimmedQuery}`);
		}
		return parts.length > 0 ? parts.join(" · ") : copy.toolsDefaultSummary;
	});

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
	<header class="max-w-3xl space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">{copy.title}</h1>
		<p class="text-sm text-muted-foreground">{copy.description}</p>
	</header>

	<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
		<div class="space-y-4">
			<Card.Root class="gap-0 border-border/55 bg-card/66 py-0">
				<Card.Header class="py-3">
					<div class="flex items-center justify-between gap-3">
						<div class="space-y-1">
							<Card.Title class="text-[0.8rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
								{copy.toolsTitle}
							</Card.Title>
							<Card.Description class="text-xs">{toolSummary}</Card.Description>
						</div>
						<Button
							variant="ghost"
							size="sm"
							class="text-muted-foreground hover:text-foreground"
							onclick={() => (toolsExpanded = !toolsExpanded)}
							aria-expanded={toolsExpanded}
							aria-controls="reading-tools"
						>
							{toolsExpanded ? copy.collapse : copy.expand}
							<ChevronDown class={`size-4 transition-transform ${toolsExpanded ? "rotate-180" : ""}`} />
						</Button>
					</div>
				</Card.Header>
				{#if toolsExpanded}
					<Card.Content id="reading-tools" class="space-y-3 border-t border-border/55 pt-3 pb-3">
						<SpeakerFilter
							{speakers}
							activeSpeakerIds={activeSpeakerIds}
							onToggleSpeaker={toggleSpeaker}
							onSelectAll={resetSpeakers}
						/>
						<Input
							bind:value={query}
							placeholder={copy.searchPlaceholder}
							aria-label={copy.searchAria}
						/>
					</Card.Content>
				{/if}
			</Card.Root>

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
