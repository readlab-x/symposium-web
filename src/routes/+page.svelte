<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";

	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "《会饮》数字研读原型",
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
				title: "Digital Reading Prototype for Symposium",
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
</script>

<section class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl">{copy.title}</Card.Title>
			<Card.Description>{copy.description}</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-3 text-sm leading-7 text-muted-foreground">
			<p>{copy.intro}</p>
			<div class="flex flex-wrap gap-2">
				<Button href="/reading">{copy.gotoReading}</Button>
				<Button href="/themes" variant="outline">{copy.gotoThemes}</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>{copy.modulesTitle}</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-2 text-sm text-muted-foreground">
			{#each copy.modules as line, index (`module-${index}`)}
				<p>{line}</p>
			{/each}
		</Card.Content>
	</Card.Root>
</section>
