<script lang="ts">
	import RelationGraph from "$lib/components/relations/relation-graph.svelte";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import relationsData from "$lib/data/relations.json";
	import type { RelationsGraph } from "$lib/types";

	const relations = relationsData as RelationsGraph;

	let activeNodeId = $state<string | null>(relations.nodes[0]?.id ?? null);

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

<section class="space-y-4">
	<header class="space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">人物关系图</h1>
		<p class="text-sm text-muted-foreground">
			当前是静态 SVG 骨架，可平滑升级为 D3 / Cytoscape 的拖拽图与分层筛选图。
		</p>
	</header>

	<div class="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
		<div class="rounded-lg border bg-card p-3">
			<RelationGraph
				nodes={relations.nodes}
				edges={relations.edges}
				{activeNodeId}
				onSelectNode={(id) => (activeNodeId = id)}
			/>
		</div>
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-base">
					{activeNode ? activeNode.label : "选择一个节点"}
				</Card.Title>
				{#if activeNode}
					<Card.Description>{activeNode.summary}</Card.Description>
				{/if}
			</Card.Header>
			<Card.Content class="space-y-3">
				{#if !activeNode}
					<p class="text-sm text-muted-foreground">点击左侧节点后显示关系详情。</p>
				{:else}
					<Badge variant="outline">{activeNode.type === "deity" ? "神祇" : "人物"}</Badge>
					<ul class="space-y-2">
						{#each relatedEdges as edge (edge.id)}
							<li class="rounded-md border p-3 text-sm">
								{edge.relation}
							</li>
						{/each}
					</ul>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
</section>
