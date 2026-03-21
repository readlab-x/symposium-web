<script lang="ts">
	import { ExternalLink } from "@lucide/svelte";
	import { toAssetPath, toBasePath } from "$lib/paths/runtime-paths.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import {
		getDisplayCharacterBio,
		getDisplayCharacterName,
		getDisplayCharacterRole,
		getDisplayCharacterSummary,
		i18nPreferences,
		pickByLanguage
	} from "$lib/stores/i18n";
	import type { Character, DialogLine } from "$lib/types";

	const characters = characterData as Character[];
	const dialogs = dialogData as DialogLine[];
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "人物索引",
				description: "人物与神祇统一管理，补充人物简介、百科入口和篇内索引，便于在文本与背景之间来回切换。",
				speechCount: "发言数",
				firstAppearance: "首次出场",
				bio: "人物简介",
				inSymposium: "篇内定位",
				wikipedia: "维基百科",
				baiduBaike: "百度百科",
				person: "人物",
				place: "地点",
				deity: "神祇"
			},
			"en-US": {
				title: "Character Index",
				description:
					"Unified profiles for people and deities, with bios, encyclopedia links, and in-text anchors for quick context switching.",
				speechCount: "Lines",
				firstAppearance: "First Appearance",
				bio: "Bio",
				inSymposium: "In Symposium",
				wikipedia: "Wikipedia",
				baiduBaike: "Baidu Baike",
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

	<div class="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card/58">
		{#each characters as character, index (character.id)}
			<article
				class={`${index < 5 ? `motion-stage-soft ${entryDelayClass(index)}` : ""} grid gap-4 px-5 py-4 transition-[transform,background-color,border-color] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] hover:bg-secondary/34 md:grid-cols-[minmax(0,1fr)_auto] md:items-start ${index > 0 ? "border-t border-border/55" : ""}`}
			>
				<div class="flex items-start gap-4">
					<Avatar.Root class="size-14 border border-border/60 bg-secondary/35 shadow-sm">
						{#if character.avatarImage}
							<Avatar.Image
								src={toAssetPath(character.avatarImage)}
								alt={getDisplayCharacterName(character, $i18nPreferences.primaryLanguage)}
								class="object-cover"
							/>
						{/if}
						<Avatar.Fallback class="text-sm font-medium">{character.avatar}</Avatar.Fallback>
					</Avatar.Root>
					<div class="min-w-0 space-y-2">
						<div class="flex flex-wrap items-center gap-2">
							<h2 class="text-base font-semibold">
								{getDisplayCharacterName(character, $i18nPreferences.primaryLanguage)}
							</h2>
							<Badge variant="outline">{entityTypeLabel(character.type)}</Badge>
						</div>
						<p class="text-sm text-muted-foreground">
							{getDisplayCharacterRole(character, $i18nPreferences.primaryLanguage)}
						</p>
						{#if getDisplayCharacterBio(character, $i18nPreferences.primaryLanguage)}
							<div class="space-y-1.5">
								<p class="text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
									{copy.bio}
								</p>
								<p class="max-w-3xl text-sm leading-7 text-foreground/85">
									{getDisplayCharacterBio(character, $i18nPreferences.primaryLanguage)}
								</p>
							</div>
						{/if}
						<div class="space-y-1.5">
							<p class="text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
								{copy.inSymposium}
							</p>
							<p class="max-w-3xl text-sm leading-7 text-muted-foreground">
								{getDisplayCharacterSummary(character, $i18nPreferences.primaryLanguage)}
							</p>
						</div>
					</div>
				</div>
				<div class="flex min-w-[10rem] flex-col items-start gap-2 text-xs text-muted-foreground md:items-end">
					<span>{copy.speechCount}: {speechCount(character.id)}</span>
					{#if character.firstLineId}
						<a
							class="motion-sheen inline-flex items-center transition-[color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:text-foreground underline underline-offset-4"
							href={toBasePath(`/reading#${character.firstLineId}`)}
						>
							{copy.firstAppearance}
						</a>
					{/if}
					<div class="flex flex-wrap gap-2 pt-1 md:justify-end">
						{#if character.wikipediaUrl}
							<Button
								href={character.wikipediaUrl}
								target="_blank"
								rel="noreferrer"
								variant="outline"
								size="sm"
								class="h-8 rounded-full bg-background/70"
							>
								<ExternalLink class="size-3.5" />
								{copy.wikipedia}
							</Button>
						{/if}
						{#if character.baiduBaikeUrl}
							<Button
								href={character.baiduBaikeUrl}
								target="_blank"
								rel="noreferrer"
								variant="outline"
								size="sm"
								class="h-8 rounded-full bg-background/70"
							>
								<ExternalLink class="size-3.5" />
								{copy.baiduBaike}
							</Button>
						{/if}
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>
