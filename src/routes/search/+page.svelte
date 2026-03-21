<script lang="ts">
	import { toBasePath } from "$lib/paths/runtime-paths.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import {
		getDisplayChapter,
		getDisplayCharacterName,
		getDisplayTag,
		getDisplayText,
		i18nPreferences,
		pickByLanguage
	} from "$lib/stores/i18n";
	import type { Character, DialogLine } from "$lib/types";

	const dialogs = dialogData as DialogLine[];
	const characters = characterData as Character[];
	const speakerById = Object.fromEntries(characters.map((character) => [character.id, character])) as Record<
		string,
		Character
	>;

	let query = $state("");
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "全文搜索",
				description: "按关键词、人名、标签快速定位到对应发言。",
				placeholder: "输入关键词，例如：爱神 / 灵魂 / 狄奥提玛",
				emptyPrompt: "输入关键词后显示结果。",
				noResult: "没有匹配结果，换个关键词试试。",
				unknownSpeaker: "未知",
				jumpToReading: "跳转到阅读页"
			},
			"en-US": {
				title: "Full-text Search",
				description: "Find matching lines quickly by keyword, speaker, or tags.",
				placeholder: "Enter keyword, e.g. eros / soul / Diotima",
				emptyPrompt: "Results will appear after you enter keywords.",
				noResult: "No matches found. Try another keyword.",
				unknownSpeaker: "Unknown",
				jumpToReading: "Jump to Reading"
			}
		})
	);

	const results = $derived.by(() => {
		const trimmed = query.trim();
		if (!trimmed) return [];

		return dialogs.filter((line) => {
			const speaker = speakerById[line.speakerId];
			const visibleText = getDisplayText(line, $i18nPreferences.primaryLanguage);
			const visibleSpeakerName = speaker
				? getDisplayCharacterName(speaker, $i18nPreferences.primaryLanguage)
				: "";
			return (
				visibleText.includes(trimmed) ||
				line.tags.some(
					(tag) =>
						tag.includes(trimmed) ||
						getDisplayTag(tag, $i18nPreferences.primaryLanguage).includes(trimmed)
				) ||
				visibleSpeakerName.includes(trimmed)
			);
		});
	});

	function entryDelayClass(index: number): string {
		if (index === 0) return "";
		if (index === 1) return "motion-delay-1";
		if (index === 2) return "motion-delay-2";
		if (index === 3) return "motion-delay-3";
		if (index === 4) return "motion-delay-4";
		return "";
	}
</script>

<section class="space-y-5">
	<header class="motion-stage-hero max-w-3xl space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">{copy.title}</h1>
		<p class="text-sm text-muted-foreground">{copy.description}</p>
	</header>

	<div class="motion-stage-soft motion-delay-1 max-w-2xl rounded-[1.3rem] border border-border/60 bg-card/56 p-3">
		<Input
			bind:value={query}
			placeholder={copy.placeholder}
			class="transition-[color,background-color,border-color,box-shadow,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] focus-visible:-translate-y-px focus-visible:bg-background/86"
		/>
	</div>

	{#if query.trim().length === 0}
		<p class="motion-stage-soft motion-delay-2 text-sm text-muted-foreground">{copy.emptyPrompt}</p>
	{:else if results.length === 0}
		<p class="motion-stage-soft motion-delay-2 text-sm text-muted-foreground">{copy.noResult}</p>
	{:else}
		<div class="overflow-hidden rounded-[1.4rem] border border-border/60 bg-card/58">
			{#each results as line, index (line.id)}
				<article
					class={`${index < 5 ? `motion-stage-soft ${entryDelayClass(index)}` : ""} space-y-2 px-5 py-4 transition-[transform,background-color,border-color] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] hover:translate-x-1 hover:bg-secondary/32 ${index > 0 ? "border-t border-border/55" : ""}`}
				>
					<p class="text-sm font-medium">
						{speakerById[line.speakerId]
							? getDisplayCharacterName(
									speakerById[line.speakerId],
									$i18nPreferences.primaryLanguage
								)
							: copy.unknownSpeaker} · {getDisplayChapter(line, $i18nPreferences.primaryLanguage)}
					</p>
					<p class="text-sm leading-7">
						{getDisplayText(line, $i18nPreferences.primaryLanguage)}
					</p>
					<div class="flex flex-wrap items-center gap-2">
						<div class="flex flex-wrap gap-1">
							{#each line.tags as tag (tag)}
								<Badge variant="secondary">
									{getDisplayTag(tag, $i18nPreferences.primaryLanguage)}
								</Badge>
							{/each}
						</div>
						<a
							href={toBasePath(`/reading#${line.id}`)}
							class="motion-sheen text-xs transition-[color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:text-foreground underline underline-offset-4"
						>
							{copy.jumpToReading}
						</a>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>
