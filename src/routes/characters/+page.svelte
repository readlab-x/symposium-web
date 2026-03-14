<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
	import type { Character, DialogLine } from "$lib/types";

	const characters = characterData as Character[];
	const dialogs = dialogData as DialogLine[];
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "人物索引",
				description: "人物、神祇统一管理。后续可在这里扩展生平、出处、关键词和跨篇章索引。",
				speechCount: "发言数",
				firstAppearance: "首次出场",
				person: "人物",
				place: "地点",
				deity: "神祇"
			},
			"en-US": {
				title: "Character Index",
				description:
					"Unified management for people and deities. You can extend this with biography, sources, keywords, and cross-chapter references.",
				speechCount: "Lines",
				firstAppearance: "First Appearance",
				person: "Person",
				place: "Place",
				deity: "Deity"
			}
		})
	);

	function speechCount(speakerId: string): number {
		return dialogs.filter((line) => line.speakerId === speakerId).length;
	}

	function entityTypeLabel(type: Character["type"]): string {
		if (type === "person") return copy.person;
		if (type === "place") return copy.place;
		return copy.deity;
	}
</script>

<section class="space-y-5">
	<header class="max-w-3xl space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">{copy.title}</h1>
		<p class="text-sm text-muted-foreground">{copy.description}</p>
	</header>

	<div class="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/58">
		{#each characters as character, index (character.id)}
			<article class={`grid gap-4 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start ${index > 0 ? "border-t border-border/55" : ""}`}>
				<div class="space-y-2">
					<div class="flex flex-wrap items-center gap-2">
						<h2 class="text-base font-semibold">{character.name}</h2>
						<Badge variant="outline">{entityTypeLabel(character.type)}</Badge>
					</div>
					<p class="text-sm text-muted-foreground">{character.role}</p>
					<p class="max-w-3xl text-sm leading-7 text-muted-foreground">{character.summary}</p>
				</div>
				<div class="flex min-w-[10rem] flex-col items-start gap-2 text-xs text-muted-foreground md:items-end">
					<span>{copy.speechCount}: {speechCount(character.id)}</span>
					{#if character.firstLineId}
						<a class="underline underline-offset-4" href={`/reading#${character.firstLineId}`}>
							{copy.firstAppearance}
						</a>
					{/if}
				</div>
			</article>
		{/each}
	</div>
</section>
