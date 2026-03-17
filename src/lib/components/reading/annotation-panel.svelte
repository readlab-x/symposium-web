<script lang="ts">
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
	import type { Annotation, Character, DialogLine } from "$lib/types";

	let {
		line,
		speaker,
		annotations,
		compact = false
	}: {
		line: DialogLine | null;
		speaker?: Character;
		annotations: Annotation[];
		compact?: boolean;
	} = $props();

	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: compact ? "注解" : "注解侧栏",
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
				title: compact ? "Annotations" : "Annotation Panel",
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

<Card.Root
	class={`motion-stage-soft ${
		compact
			? "gap-4 border-border/55 bg-secondary/20 py-4"
			: "motion-delay-3 flex flex-col border-border/60 bg-card/74 lg:sticky lg:top-24 lg:h-[calc(100dvh-7.25rem)]"
	}`}
>
	<Card.Header class={compact ? "space-y-1 pb-0" : "shrink-0"}>
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
	<Card.Content class={compact ? "space-y-4 pt-0" : "min-h-0 flex-1 space-y-4 overflow-y-auto"}>
		{#if annotations.length === 0}
			<p class="motion-stage-soft text-sm text-muted-foreground">{copy.noAnnotation}</p>
		{:else}
			{#key `${line?.id ?? "none"}:${annotations.length}:${compact ? "compact" : "sidebar"}`}
				<ul class="space-y-3">
					{#each annotations as annotation, index (annotation.id)}
						<li
							class={`space-y-2 rounded-[1.15rem] border border-border/60 bg-secondary/28 p-3.5 motion-stage-soft ${
								index === 0
									? "motion-delay-1"
									: index === 1
										? "motion-delay-2"
										: index === 2
											? "motion-delay-3"
											: index === 3
												? "motion-delay-4"
												: ""
							}`}
						>
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
			{/key}
		{/if}
	</Card.Content>
</Card.Root>
