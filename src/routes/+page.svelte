<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<section class="grid gap-4 lg:grid-cols-2">
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-2xl">《会饮》数字研读原型</Card.Title>
			<Card.Description>
				SvelteKit + Tailwind + shadcn-svelte 骨架，已包含阅读视图、主题卡、人物索引与关系图页面。
			</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-3 text-sm leading-7 text-muted-foreground">
			<p>你可以先在阅读页继续补全文本与注解数据，再逐步接入搜索索引、用户笔记和登录功能。</p>
			<div class="flex flex-wrap gap-2">
				<Button href="/reading">进入阅读视图</Button>
				<Button href="/themes" variant="outline">查看主题地图</Button>
			</div>
		</Card.Content>
	</Card.Root>

	<Card.Root>
		<Card.Header>
			<Card.Title>当前已搭建模块</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-2 text-sm text-muted-foreground">
			<p>1. 对话阅读：人物筛选、关键字搜索、实体高亮、注解侧栏。</p>
			<p>2. 人物页：角色简介、发言统计、首次出场跳转。</p>
			<p>3. 主题页：按主题聚合代表段落与发言人。</p>
			<p>4. 关系图：静态 SVG 节点/边 + 右侧说明。</p>
			<p>5. 搜索页：全文命中句子并跳转回阅读页。</p>
		</Card.Content>
	</Card.Root>
</section>
