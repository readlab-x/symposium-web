<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import type { Character, DialogLine } from "$lib/types";

	const characters = characterData as Character[];
	const dialogs = dialogData as DialogLine[];

	function speechCount(speakerId: string): number {
		return dialogs.filter((line) => line.speakerId === speakerId).length;
	}

	function entityTypeLabel(type: Character["type"]): string {
		if (type === "person") return "人物";
		if (type === "place") return "地点";
		return "神祇";
	}
</script>

<section class="space-y-4">
	<header class="space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">人物索引</h1>
		<p class="text-sm text-muted-foreground">
			人物、神祇统一管理。后续可在这里扩展生平、出处、关键词和跨篇章索引。
		</p>
	</header>

	<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each characters as character (character.id)}
			<Card.Root>
				<Card.Header>
					<div class="flex items-center justify-between gap-2">
						<Card.Title class="text-base">{character.name}</Card.Title>
						<Badge variant="outline">{entityTypeLabel(character.type)}</Badge>
					</div>
					<Card.Description>{character.role}</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-3">
					<p class="text-sm leading-6 text-muted-foreground">{character.summary}</p>
					<div class="flex items-center justify-between text-xs text-muted-foreground">
						<span>发言数：{speechCount(character.id)}</span>
						{#if character.firstLineId}
							<a class="underline" href={`/reading#${character.firstLineId}`}>首次出场</a>
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>
