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

	function isNodeRelated(nodeId: string): boolean {
		if (!activeNodeId || activeNodeId === nodeId) return false;
		return edges.some(
			(edge) =>
				(edge.source === activeNodeId && edge.target === nodeId) ||
				(edge.target === activeNodeId && edge.source === nodeId)
		);
	}
</script>

<svg
	viewBox={`0 0 ${width} ${height}`}
	class="relation-graph motion-stage-soft motion-delay-2 w-full rounded-[1.2rem] border border-border/65 bg-card/70"
>
	{#each edges as edge (edge.id)}
		{@const source = findNode(edge.source)}
		{@const target = findNode(edge.target)}
		{#if source && target}
			<line
				x1={source.x}
				y1={source.y}
				x2={target.x}
				y2={target.y}
				class={`transition-[opacity,stroke,stroke-width] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] ${
					isRelatedToActive(edge) ? "stroke-primary/42 opacity-100" : "stroke-border/85 opacity-46"
				}`}
				stroke-width={isRelatedToActive(edge) ? "2" : "1.35"}
			/>
			<text
				x={(source.x + target.x) / 2}
				y={(source.y + target.y) / 2 - 5}
				class={`pointer-events-none transition-[opacity,fill] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] text-[8px] ${
					isRelatedToActive(edge) ? "fill-foreground/70 opacity-100" : "fill-muted-foreground/60 opacity-48"
				}`}
				text-anchor="middle"
			>
				{edge.relation}
			</text>
		{/if}
	{/each}

	{#each nodes as node (node.id)}
		<g
			class="relation-node"
			data-state={activeNodeId === node.id ? "active" : isNodeRelated(node.id) ? "related" : "idle"}
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
			{#if activeNodeId === node.id}
				<circle
					cx={node.x}
					cy={node.y}
					r={20.5}
					class="motion-pulse-ring fill-none stroke-primary/22"
					stroke-width={1.4}
				/>
			{:else if isNodeRelated(node.id)}
				<circle
					cx={node.x}
					cy={node.y}
					r={18}
					class="fill-none stroke-primary/12 transition-opacity [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)]"
					stroke-width={1.1}
				/>
			{/if}
			<circle
				cx={node.x}
				cy={node.y}
				r={activeNodeId === node.id ? 15.5 : 12.5}
				class={`node-shell ${fillForType(node.type, activeNodeId === node.id)} ${strokeForType(node.type)}`}
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

<style>
	.relation-node {
		cursor: pointer;
		outline: none;
		transform-box: fill-box;
		transform-origin: center;
		transition: transform var(--motion-feedback-strong) var(--ease-ritual-expo);
	}

	.relation-node[data-state="idle"]:hover,
	.relation-node[data-state="idle"]:focus-visible {
		transform: translate3d(0, -2px, 0) scale(1.06);
	}

	.relation-node[data-state="related"] {
		transform: scale(1.05);
	}

	.relation-node[data-state="related"]:hover,
	.relation-node[data-state="related"]:focus-visible {
		transform: translate3d(0, -2px, 0) scale(1.08);
	}

	.relation-node[data-state="active"] {
		transform: translate3d(0, -1px, 0) scale(1.14);
	}

	.relation-node[data-state="active"]:hover,
	.relation-node[data-state="active"]:focus-visible {
		transform: translate3d(0, -2px, 0) scale(1.16);
	}

	.node-shell {
		transition:
			fill var(--motion-panel) var(--ease-ritual-out),
			stroke var(--motion-panel) var(--ease-ritual-out),
			stroke-width var(--motion-panel) var(--ease-ritual-out),
			filter var(--motion-panel) var(--ease-ritual-out);
		filter: drop-shadow(0 10px 18px transparent);
	}

	.relation-node[data-state="related"] .node-shell {
		filter: drop-shadow(0 12px 18px color-mix(in oklab, var(--color-primary) 10%, transparent));
	}

	.relation-node[data-state="active"] .node-shell {
		filter: drop-shadow(0 16px 24px color-mix(in oklab, var(--color-primary) 18%, transparent));
	}

	@media (prefers-reduced-motion: reduce) {
		.relation-node,
		.relation-node[data-state="idle"]:hover,
		.relation-node[data-state="idle"]:focus-visible,
		.relation-node[data-state="related"],
		.relation-node[data-state="related"]:hover,
		.relation-node[data-state="related"]:focus-visible,
		.relation-node[data-state="active"],
		.relation-node[data-state="active"]:hover,
		.relation-node[data-state="active"]:focus-visible {
			transform: none;
		}
	}
</style>
