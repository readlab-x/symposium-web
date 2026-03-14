<script lang="ts">
	import { onMount } from "svelte";
	import cytoscape from "cytoscape";
	import type { Core } from "cytoscape";
	import { createActiveRelationState } from "$lib/components/relations/cytoscape-active-state.js";
	import { createCytoscapeElements } from "$lib/components/relations/cytoscape-elements.js";
	import { createRelationGraphStyles } from "$lib/components/relations/cytoscape-styles.js";
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
		onSelectNode?: (id: string | null) => void;
	} = $props();

	let container = $state<HTMLDivElement | null>(null);
	let graph = $state<Core | null>(null);
	let darkMode = $state(false);

	const graphData = $derived.by(() => ({ nodes, edges }));
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				canvasLabel: "人物关系图，可拖拽、缩放并点击节点查看关系"
			},
			"en-US": {
				canvasLabel: "Interactive relations graph. Drag, zoom, and select nodes to inspect links."
			}
		})
	);

	function syncThemeState() {
		darkMode = document.documentElement.classList.contains("dark");
		if (!graph) return;

		graph.style(createRelationGraphStyles({ darkMode }));
		applyActiveClasses(graph, activeNodeId);
	}

	function applyActiveClasses(instance: Core, selectedNodeId: string | null) {
		const state = createActiveRelationState(graphData, selectedNodeId);
		const highlightedNodeIds = new Set([...state.activeNodeIds, ...state.neighborNodeIds]);
		const highlightedEdgeIds = new Set(state.activeEdgeIds);

		instance.batch(() => {
			const allNodes = instance.nodes();
			const allEdges = instance.edges();

			allNodes.removeClass("is-active is-neighbor is-dimmed");
			allEdges.removeClass("is-active-edge is-dimmed");

			if (!selectedNodeId) return;

			allNodes.forEach((node) => {
				if (state.activeNodeIds.includes(node.id())) {
					node.addClass("is-active");
					return;
				}

				if (highlightedNodeIds.has(node.id())) {
					node.addClass("is-neighbor");
					return;
				}

				node.addClass("is-dimmed");
			});

			allEdges.forEach((edge) => {
				if (highlightedEdgeIds.has(edge.id())) {
					edge.addClass("is-active-edge");
					return;
				}

				edge.addClass("is-dimmed");
			});
		});
	}

	onMount(() => {
		if (!container) return;

		darkMode = document.documentElement.classList.contains("dark");

		const instance = cytoscape({
			container,
			elements: createCytoscapeElements(graphData),
			style: createRelationGraphStyles({ darkMode }),
			layout: {
				name: "cose",
				animate: false,
				padding: 24
			},
			minZoom: 0.6,
			maxZoom: 1.8,
			wheelSensitivity: 0.16,
			boxSelectionEnabled: false,
			userPanningEnabled: true,
			userZoomingEnabled: true
		});

		instance.on("tap", "node", (event) => {
			onSelectNode?.(event.target.id());
		});

		instance.on("tap", (event) => {
			if (event.target === instance) {
				onSelectNode?.(null);
			}
		});

		graph = instance;
		applyActiveClasses(instance, activeNodeId);

		const themeObserver = new MutationObserver(() => {
			syncThemeState();
		});
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"]
		});

		const resizeObserver = new ResizeObserver(() => {
			instance.resize();
			instance.fit(undefined, 24);
		});
		resizeObserver.observe(container);

		return () => {
			themeObserver.disconnect();
			resizeObserver.disconnect();
			instance.destroy();
			graph = null;
		};
	});

	$effect(() => {
		if (!graph) return;
		applyActiveClasses(graph, activeNodeId);
	});
</script>

<div class="space-y-2">
	<div
		bind:this={container}
		class="h-[min(72dvh,40rem)] min-h-[28rem] w-full rounded-[1.2rem] border border-border/60 bg-card/70"
		aria-label={copy.canvasLabel}
		role="img"
	></div>
	<p class="px-1 text-xs text-muted-foreground">
		{copy.canvasLabel}
	</p>
</div>
