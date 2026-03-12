<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Separator from "$lib/components/ui/separator/index.js";
	import type { Annotation, Character, DialogLine } from "$lib/types";

	let {
		line,
		speaker,
		annotations
	}: {
		line: DialogLine | null;
		speaker?: Character;
		annotations: Annotation[];
	} = $props();

	function labelForAnnotationType(type: Annotation["type"]): string {
		if (type === "background") return "背景";
		if (type === "translation") return "翻译";
		if (type === "term") return "术语";
		return "互文";
	}
</script>

<Card.Root class="sticky top-6">
	<Card.Header>
		<Card.Title class="text-base">注解侧栏</Card.Title>
		<Card.Description>
			{#if line}
				当前选中：{speaker?.name ?? "未知"} · {line.chapter}
			{:else}
				点击左侧任意发言以查看注解
			{/if}
		</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4">
		{#if line}
			<blockquote class="rounded-md border-l-4 border-primary/50 bg-muted p-3 text-sm leading-6">
				{line.text}
			</blockquote>
			<Separator.Root />
		{/if}

		{#if annotations.length === 0}
			<p class="text-sm text-muted-foreground">当前发言暂无注解，可继续补充背景、术语和互文信息。</p>
		{:else}
			<ul class="space-y-3">
				{#each annotations as annotation (annotation.id)}
					<li class="space-y-2 rounded-md border p-3">
						<div class="flex items-center justify-between gap-3">
							<h3 class="text-sm font-semibold">{annotation.title}</h3>
							<Badge variant="outline">{labelForAnnotationType(annotation.type)}</Badge>
						</div>
						<p class="text-sm leading-6 text-muted-foreground">{annotation.content}</p>
						<div class="flex flex-wrap gap-1">
							{#each annotation.tags as tag (tag)}
								<Badge variant="secondary">{tag}</Badge>
							{/each}
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</Card.Content>
</Card.Root>
