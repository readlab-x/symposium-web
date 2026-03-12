<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import themeData from "$lib/data/themes.json";
	import type { Character, DialogLine, Theme } from "$lib/types";

	const themes = themeData as Theme[];
	const dialogs = dialogData as DialogLine[];
	const characters = characterData as Character[];
	const characterById = Object.fromEntries(characters.map((character) => [character.id, character])) as Record<
		string,
		Character
	>;
	const lineById = Object.fromEntries(dialogs.map((line) => [line.id, line])) as Record<string, DialogLine>;
</script>

<section class="space-y-4">
	<header class="space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">观点主题地图</h1>
		<p class="text-sm text-muted-foreground">
			按主题整合不同人物发言。后续可加时间线和多标签交叉过滤。
		</p>
	</header>

	<div class="grid gap-4 lg:grid-cols-2">
		{#each themes as theme (theme.id)}
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-base">{theme.name}</Card.Title>
					<Card.Description>{theme.summary}</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-3">
					<div class="flex flex-wrap gap-1">
						{#each theme.characterIds as characterId (characterId)}
							<Badge variant="secondary">{characterById[characterId]?.name ?? characterId}</Badge>
						{/each}
					</div>
					<ul class="space-y-2">
						{#each theme.lineIds as lineId (lineId)}
							{@const line = lineById[lineId]}
							{#if line}
								<li class="rounded-md border p-3">
									<p class="text-xs text-muted-foreground">
										{characterById[line.speakerId]?.name} · {line.chapter}
									</p>
									<p class="mt-1 text-sm leading-6">{line.text}</p>
									<a href={`/reading#${line.id}`} class="mt-2 inline-block text-xs underline">
										跳转到原文段落
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
