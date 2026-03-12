<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import characterData from "$lib/data/characters.json";
	import dialogData from "$lib/data/dialogs.json";
	import type { Character, DialogLine } from "$lib/types";

	const dialogs = dialogData as DialogLine[];
	const characters = characterData as Character[];
	const speakerById = Object.fromEntries(characters.map((character) => [character.id, character])) as Record<
		string,
		Character
	>;

	let query = $state("");

	const results = $derived.by(() => {
		const trimmed = query.trim();
		if (!trimmed) return [];

		return dialogs.filter((line) => {
			const speaker = speakerById[line.speakerId];
			return (
				line.text.includes(trimmed) ||
				line.tags.some((tag) => tag.includes(trimmed)) ||
				(speaker?.name ?? "").includes(trimmed)
			);
		});
	});
</script>

<section class="space-y-4">
	<header class="space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">全文搜索</h1>
		<p class="text-sm text-muted-foreground">按关键词、人名、标签快速定位到对应发言。</p>
	</header>

	<div class="max-w-xl">
		<Input bind:value={query} placeholder="输入关键词，例如：爱神 / 灵魂 / 狄奥提玛" />
	</div>

	{#if query.trim().length === 0}
		<p class="text-sm text-muted-foreground">输入关键词后显示结果。</p>
	{:else if results.length === 0}
		<p class="text-sm text-muted-foreground">没有匹配结果，换个关键词试试。</p>
	{:else}
		<ul class="space-y-3">
			{#each results as line (line.id)}
				<li>
					<Card.Root>
						<Card.Header>
							<Card.Title class="text-sm">
								{speakerById[line.speakerId]?.name ?? "未知"} · {line.chapter}
							</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-2">
							<p class="text-sm leading-7">{line.text}</p>
							<div class="flex flex-wrap gap-1">
								{#each line.tags as tag (tag)}
									<Badge variant="secondary">{tag}</Badge>
								{/each}
							</div>
							<a href={`/reading#${line.id}`} class="inline-block text-xs underline">
								跳转到阅读页
							</a>
						</Card.Content>
					</Card.Root>
				</li>
			{/each}
		</ul>
	{/if}
</section>
