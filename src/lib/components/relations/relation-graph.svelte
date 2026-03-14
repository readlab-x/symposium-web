<script lang="ts">
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
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
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": { viewRelations: "查看" },
			"en-US": { viewRelations: "View relations of" }
		})
	);

	function strokeForType(type: RelationNode["type"]): string {
		if (type === "person") return "stroke-amber-700/75 dark:stroke-amber-300/75";
		if (type === "place") return "stroke-emerald-700/75 dark:stroke-emerald-300/75";
		return "stroke-rose-700/70 dark:stroke-rose-300/70";
	}

	function fillForType(type: RelationNode["type"], isActive: boolean): string {
		if (type === "person") {
			return isActive
				? "fill-amber-100 dark:fill-amber-950/45"
				: "fill-background dark:fill-card";
		}
		if (type === "place") {
			return isActive
				? "fill-emerald-100 dark:fill-emerald-950/45"
				: "fill-background dark:fill-card";
		}
		return isActive ? "fill-rose-100 dark:fill-rose-950/40" : "fill-background dark:fill-card";
	}

	function isRelatedToActive(edge: RelationEdge): boolean {
		if (!activeNodeId) return false;
		return edge.source === activeNodeId || edge.target === activeNodeId;
	}

	function findNode(id: string): RelationNode | undefined {
		return nodes.find((node) => node.id === id);
	}
</script>

<svg viewBox={`0 0 ${width} ${height}`} class="w-full rounded-[1.2rem] border border-border/65 bg-card/70">
	{#each edges as edge (edge.id)}
		{@const source = findNode(edge.source)}
		{@const target = findNode(edge.target)}
		{#if source && target}
			<line
				x1={source.x}
				y1={source.y}
				x2={target.x}
				y2={target.y}
				class={isRelatedToActive(edge) ? "stroke-primary/42" : "stroke-border/85"}
				stroke-width={isRelatedToActive(edge) ? "2" : "1.35"}
			/>
			<text
				x={(source.x + target.x) / 2}
				y={(source.y + target.y) / 2 - 5}
				class={`text-[8px] ${isRelatedToActive(edge) ? "fill-foreground/70" : "fill-muted-foreground/60"}`}
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
			aria-label={`${copy.viewRelations} ${node.label}`}
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
				r={activeNodeId === node.id ? 15.5 : 12.5}
				class={`${fillForType(node.type, activeNodeId === node.id)} ${strokeForType(node.type)}`}
				stroke-width={activeNodeId === node.id ? 2.6 : 1.8}
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
