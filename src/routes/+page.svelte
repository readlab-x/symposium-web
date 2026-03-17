<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";

	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "会饮研读台",
				description:
					"SvelteKit + Tailwind + shadcn-svelte 骨架，已包含阅读视图、主题卡、人物索引与关系图页面。",
				intro:
					"你可以先在阅读页继续补全文本与注解数据，再逐步接入搜索索引、用户笔记和登录功能。",
				gotoReading: "进入阅读视图",
				gotoThemes: "查看主题地图",
				modulesTitle: "当前已搭建模块",
				modules: [
					"1. 对话阅读：人物筛选、关键字搜索、实体高亮、注解侧栏。",
					"2. 人物页：角色简介、发言统计、首次出场跳转。",
					"3. 主题页：按主题聚合代表段落与发言人。",
					"4. 关系图：静态 SVG 节点/边 + 右侧说明。",
					"5. 搜索页：全文命中句子并跳转回阅读页。"
				]
			},
			"en-US": {
				title: "Symposium Reading Desk",
				description:
					"SvelteKit + Tailwind + shadcn-svelte scaffold, including reading view, themes, character index, and relation graph.",
				intro:
					"You can continue enriching text and annotations in the reading page, then gradually connect search indexing, user notes, and login.",
				gotoReading: "Open Reading View",
				gotoThemes: "Open Theme Map",
				modulesTitle: "Implemented Modules",
				modules: [
					"1. Reading: speaker filters, keyword search, entity highlights, annotation panel.",
					"2. Characters: profile summary, speech count, first appearance jump.",
					"3. Themes: theme-based line aggregation and speakers.",
					"4. Relations: static SVG nodes/edges with right-side details.",
					"5. Search: full-text hits with jumps back to reading."
				]
			}
		})
	);

	function moduleDelayClass(index: number): string {
		if (index === 0) return "motion-delay-1";
		if (index === 1) return "motion-delay-2";
		if (index === 2) return "motion-delay-3";
		return "motion-delay-4";
	}
</script>

<section class="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
	<Card.Root class="motion-stage-hero border-border/60 bg-card/62">
		<Card.Header class="space-y-2">
			<p class="text-[0.72rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
				Symposium
			</p>
			<Card.Title class="max-w-2xl text-3xl leading-tight sm:text-[2.1rem]">{copy.title}</Card.Title>
			<Card.Description class="max-w-xl leading-6">{copy.description}</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-5 text-sm leading-7 text-muted-foreground">
			<p class="max-w-2xl">{copy.intro}</p>
			<div class="flex flex-wrap gap-2.5">
				<Button
					href="/reading"
					class="motion-sheen transition-[transform,box-shadow,background-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-expo)] hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-24px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
				>
					{copy.gotoReading}
				</Button>
				<Button
					href="/themes"
					variant="outline"
					class="motion-sheen transition-[transform,box-shadow,background-color,border-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-expo)] hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-24px_color-mix(in_oklab,var(--color-primary)_38%,transparent)]"
				>
					{copy.gotoThemes}
				</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<section class="space-y-4">
		<header class="motion-stage-soft motion-delay-2 space-y-2">
			<p class="text-[0.72rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
				Index
			</p>
			<h2 class="text-xl font-semibold tracking-tight">{copy.modulesTitle}</h2>
		</header>
		<div class="overflow-hidden rounded-[1.4rem] border border-border/60 bg-card/54">
			{#each copy.modules as line, index (`module-${index}`)}
				<p
					class={`motion-stage-soft ${moduleDelayClass(index)} px-5 py-4 text-sm leading-7 text-muted-foreground transition-[transform,background-color,color] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] hover:translate-x-1 hover:bg-secondary/40 hover:text-foreground ${index > 0 ? "border-t border-border/55" : ""}`}
				>
					{line}
				</p>
			{/each}
		</div>
	</section>
</section>
