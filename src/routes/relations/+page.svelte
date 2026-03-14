<script lang="ts">
	import RelationGraph from "$lib/components/relations/relation-graph.svelte";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import relationsData from "$lib/data/relations.json";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
	import type { RelationsGraph } from "$lib/types";

	const relations = relationsData as RelationsGraph;

	let activeNodeId = $state<string | null>(relations.nodes[0]?.id ?? null);
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "人物关系图",
				description: "当前是静态 SVG 骨架，可平滑升级为 D3 / Cytoscape 的拖拽图与分层筛选图。",
				selectNode: "选择一个节点",
				emptyDetail: "点击左侧节点后显示关系详情。",
				deity: "神祇",
				person: "人物"
			},
			"en-US": {
				title: "Relation Graph",
				description:
					"Currently a static SVG scaffold. It can be smoothly upgraded to a draggable and layered graph with D3/Cytoscape.",
				selectNode: "Select a node",
				emptyDetail: "Select a node on the left to view relation details.",
				deity: "Deity",
				person: "Person"
			}
		})
	);

	const activeNode = $derived.by(() =>
		activeNodeId ? relations.nodes.find((node) => node.id === activeNodeId) ?? null : null
	);
	const relatedEdges = $derived.by(() =>
		activeNodeId
			? relations.edges.filter(
					(edge) => edge.source === activeNodeId || edge.target === activeNodeId
				)
			: []
	);
</script>

<section class="space-y-5">
	<header class="max-w-3xl space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">{copy.title}</h1>
		<p class="text-sm text-muted-foreground">{copy.description}</p>
	</header>

	<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
		<div class="rounded-[1.5rem] border border-border/60 bg-card/62 p-4">
			<RelationGraph
				nodes={relations.nodes}
				edges={relations.edges}
				{activeNodeId}
				onSelectNode={(id) => (activeNodeId = id)}
			/>
		</div>
		<Card.Root class="border-border/60 bg-card/72">
			<Card.Header>
				<Card.Title class="text-base">
					{activeNode ? activeNode.label : copy.selectNode}
				</Card.Title>
				{#if activeNode}
					<Card.Description>{activeNode.summary}</Card.Description>
				{/if}
			</Card.Header>
			<Card.Content class="space-y-3">
				{#if !activeNode}
					<p class="text-sm text-muted-foreground">{copy.emptyDetail}</p>
				{:else}
					<Badge variant="outline">{activeNode.type === "deity" ? copy.deity : copy.person}</Badge>
					<ul class="space-y-2">
						{#each relatedEdges as edge (edge.id)}
							<li class="rounded-[1.1rem] border border-border/60 bg-secondary/24 p-3 text-sm">
								{edge.relation}
							</li>
						{/each}
					</ul>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</section>
