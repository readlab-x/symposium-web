<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import themeData from "$lib/data/themes.json";
	import {
		getDisplayChapter,
		getDisplayCharacterName,
		getDisplayText,
		getDisplayThemeName,
		getDisplayThemeSummary,
		i18nPreferences,
		pickByLanguage
	} from "$lib/stores/i18n";
	import type { Character, DialogLine, Theme } from "$lib/types";

	const themes = themeData as Theme[];
	const dialogs = dialogData as DialogLine[];
	const characters = characterData as Character[];
	const characterById = Object.fromEntries(characters.map((character) => [character.id, character])) as Record<
		string,
		Character
	>;
	const lineById = Object.fromEntries(dialogs.map((line) => [line.id, line])) as Record<string, DialogLine>;
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "观点主题地图",
				description: "按主题整合不同人物发言。后续可加时间线和多标签交叉过滤。",
				jumpToReading: "跳转到原文段落"
			},
			"en-US": {
				title: "Theme Map",
				description:
					"Aggregate lines by theme across different speakers. You can later add timelines and multi-tag cross filters.",
				jumpToReading: "Jump to Reading"
			}
		})
	);

	function entryDelayClass(index: number): string {
		if (index === 0) return "";
		if (index === 1) return "motion-delay-1";
		if (index === 2) return "motion-delay-2";
		if (index === 3) return "motion-delay-3";
		return "motion-delay-4";
	}
</script>

<section class="space-y-5">
	<header class="motion-stage-hero max-w-3xl space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">{copy.title}</h1>
		<p class="text-sm text-muted-foreground">{copy.description}</p>
	</header>

	<div class="grid gap-5 lg:grid-cols-2">
		{#each themes as theme, index (theme.id)}
			<Card.Root
				class={`motion-stage-soft ${entryDelayClass(index)} border-border/60 bg-card/60 transition-[transform,background-color,border-color,box-shadow] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] hover:-translate-y-1 hover:bg-card/74 hover:shadow-[0_26px_42px_-34px_color-mix(in_oklab,var(--color-primary)_45%,transparent)]`}
			>
				<Card.Header>
					<Card.Title class="text-base">
						{getDisplayThemeName(theme, $i18nPreferences.primaryLanguage)}
					</Card.Title>
					<Card.Description>
						{getDisplayThemeSummary(theme, $i18nPreferences.primaryLanguage)}
					</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="flex flex-wrap gap-1.5">
						{#each theme.characterIds as characterId (characterId)}
							<Badge variant="secondary">
								{characterById[characterId]
									? getDisplayCharacterName(
											characterById[characterId],
											$i18nPreferences.primaryLanguage
										)
									: characterId}
							</Badge>
						{/each}
					</div>
					<ul class="space-y-3">
						{#each theme.lineIds as lineId (lineId)}
							{@const line = lineById[lineId]}
							{#if line}
								<li class="border-l border-border/65 pl-4 transition-[transform,border-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:translate-x-1 hover:border-primary/38">
									<p class="text-xs text-muted-foreground">
										{characterById[line.speakerId]
											? getDisplayCharacterName(
													characterById[line.speakerId],
													$i18nPreferences.primaryLanguage
												)
											: line.speakerId}
										· {getDisplayChapter(line, $i18nPreferences.primaryLanguage)}
									</p>
									<p class="mt-1 text-sm leading-7">
										{getDisplayText(line, $i18nPreferences.primaryLanguage)}
									</p>
									<a
										href={`/reading#${line.id}`}
										class="motion-sheen mt-2 inline-block text-xs transition-[color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:text-foreground underline underline-offset-4"
									>
										{copy.jumpToReading}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
