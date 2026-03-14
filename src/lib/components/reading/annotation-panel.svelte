<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Separator from "$lib/components/ui/separator/index.js";
	import { getDisplayText, i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
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

	const displayText = $derived.by(() =>
		line ? getDisplayText(line, $i18nPreferences.primaryLanguage) : ""
	);
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "注解侧栏",
				currentLine: "当前选中",
				unknown: "未知",
				emptyPrompt: "点击左侧任意发言以查看注解",
				noAnnotation: "当前发言暂无注解，可继续补充背景、术语和互文信息。",
				background: "背景",
				translation: "翻译",
				term: "术语",
				intertext: "互文"
			},
			"en-US": {
				title: "Annotation Panel",
				currentLine: "Selected",
				unknown: "Unknown",
				emptyPrompt: "Select any line on the left to view annotations",
				noAnnotation:
					"No annotations for this line yet. You can add background, terms, or intertext notes.",
				background: "Background",
				translation: "Translation",
				term: "Term",
				intertext: "Intertext"
			}
		})
	);

	function labelForAnnotationType(type: Annotation["type"]): string {
		if (type === "background") return copy.background;
		if (type === "translation") return copy.translation;
		if (type === "term") return copy.term;
		return copy.intertext;
	}
</script>

<Card.Root class="flex flex-col border-border/60 bg-card/74 lg:sticky lg:top-24 lg:h-[calc(100dvh-7.25rem)]">
	<Card.Header class="shrink-0">
		<Card.Title class="text-[0.82rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
			{copy.title}
		</Card.Title>
		<Card.Description>
			{#if line}
				{copy.currentLine}: {speaker?.name ?? copy.unknown} · {line.chapter}
			{:else}
				{copy.emptyPrompt}
			{/if}
		</Card.Description>
	</Card.Header>
	<Card.Content class="min-h-0 flex-1 space-y-4 overflow-y-auto">
		{#if line}
			<blockquote class="rounded-[1.15rem] border-l-2 border-primary/40 bg-secondary/38 px-4 py-3 text-sm leading-6">
				{displayText}
			</blockquote>
			<Separator.Root />
		{/if}

		{#if annotations.length === 0}
			<p class="text-sm text-muted-foreground">{copy.noAnnotation}</p>
		{:else}
			<ul class="space-y-3">
				{#each annotations as annotation (annotation.id)}
					<li class="space-y-2 rounded-[1.15rem] border border-border/60 bg-secondary/28 p-3.5">
						<div class="flex items-center justify-between gap-3">
							<h3 class="text-sm font-medium">{annotation.title}</h3>
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
