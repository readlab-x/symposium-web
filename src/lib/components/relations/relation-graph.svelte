<script lang="ts">
	import type { RelationEdge, RelationNode } from "$lib/types";

	let {
		nodes,
		edges,
		activeNodeId,
		onSelectNode
	}: {
		nodes: RelationNode[];
		edges: RelationEdge[];
		activeNodeId: string | null;
		onSelectNode?: (id: string) => void;
	} = $props();

	const width = 430;
	const height = 240;

	function strokeForType(type: RelationNode["type"]): string {
		if (type === "person") return "#0f766e";
		if (type === "place") return "#047857";
		return "#be123c";
	}

	function findNode(id: string): RelationNode | undefined {
		return nodes.find((node) => node.id === id);
	}
</script>

<svg viewBox={`0 0 ${width} ${height}`} class="w-full rounded-xl border bg-card">
	{#each edges as edge (edge.id)}
		{@const source = findNode(edge.source)}
		{@const target = findNode(edge.target)}
		{#if source && target}
			<line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#94a3b8" stroke-width="1.6" />
			<text
				x={(source.x + target.x) / 2}
				y={(source.y + target.y) / 2 - 5}
				class="fill-muted-foreground text-[8px]"
				text-anchor="middle"
			>
				{edge.relation}
			</text>
		{/if}
	{/each}

	{#each nodes as node (node.id)}
		<g
			role="button"
			tabindex="0"
			aria-label={`查看 ${node.label} 的关系`}
			onclick={() => onSelectNode?.(node.id)}
			onkeydown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onSelectNode?.(node.id);
				}
			}}
		>
			<circle
				cx={node.x}
				cy={node.y}
				r={activeNodeId === node.id ? 16 : 13}
				fill={activeNodeId === node.id ? "#e2e8f0" : "#ffffff"}
				stroke={strokeForType(node.type)}
				stroke-width={activeNodeId === node.id ? 3 : 2}
			/>
			<text
				x={node.x}
				y={node.y + 2}
				text-anchor="middle"
				class="pointer-events-none fill-foreground text-[9px]"
			>
				{node.label}
			</text>
		</g>
	{/each}
</svg>
