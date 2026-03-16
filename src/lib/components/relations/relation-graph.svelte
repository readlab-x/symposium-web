<script lang="ts">
	import { onMount } from "svelte";
	import type { Graph as G6Graph } from "@antv/g6";
	import { createG6Elements } from "$lib/components/relations/g6-elements.js";
	import { createRelationGraphOptions } from "$lib/components/relations/g6-graph-config.js";
	import { createLatestTaskRunner } from "$lib/components/relations/g6-render-queue.js";
	import { createG6ElementStates } from "$lib/components/relations/g6-state.js";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
	import type { RelationEdge, RelationGraphNode } from "$lib/types";

	let {
		nodes,
		edges,
		activeNodeId,
		onSelectNode
	}: {
		nodes: RelationGraphNode[];
		edges: RelationEdge[];
		activeNodeId: string | null;
		onSelectNode?: (id: string | null) => void;
	} = $props();

	let container = $state<HTMLDivElement | null>(null);
	let graph = $state<G6Graph | null>(null);
	let darkMode = $state(false);
	let graphReady = $state(false);
	let mounted = $state(false);

	const graphData = $derived.by(() => ({ nodes, edges }));
	const graphElements = $derived.by(() => createG6Elements(graphData));
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				canvasLabel:
					"\u4eba\u7269\u5173\u7cfb\u56fe\uff0c\u53ef\u62d6\u62fd\u3001\u7f29\u653e\u5e76\u70b9\u51fb\u8282\u70b9\u67e5\u770b\u5173\u7cfb"
			},
			"en-US": {
				canvasLabel: "Interactive relations graph. Drag, zoom, and select nodes to inspect links."
			}
		})
	);

	function syncThemeState() {
		darkMode = document.documentElement.classList.contains("dark");
	}

	function destroyGraph() {
		graphReady = false;

		if (!graph) return;

		const instance = graph;
		graph = null;

		if (!instance.destroyed) {
			instance.destroy();
		}
	}

	async function applyElementStates(
		instance: G6Graph,
		data: typeof graphData,
		selectedNodeId: string | null
	) {
		await instance.setElementState(createG6ElementStates(data, selectedNodeId), false);
	}

	const renderQueue = createLatestTaskRunner(
		async ({
			graphContainer,
			data,
			relationData,
			isDarkMode
		}: {
			graphContainer: HTMLDivElement;
			data: ReturnType<typeof createG6Elements>;
			relationData: typeof graphData;
			isDarkMode: boolean;
		}) => {
			const { Graph } = await import("@antv/g6");

			if (!mounted) return;

			const previousGraph = graph;
			graph = null;
			graphReady = false;

			if (previousGraph && !previousGraph.destroyed) {
				previousGraph.destroy();
			}

			const instance = new Graph(
				createRelationGraphOptions({
					container: graphContainer,
					data,
					darkMode: isDarkMode
				})
			);

			instance.on("node:click", (event) => {
				const nodeTarget = (event as { target?: { id?: unknown } }).target;
				const nodeId = typeof nodeTarget?.id === "string" ? nodeTarget.id : null;
				onSelectNode?.(nodeId);
			});

			instance.on("canvas:click", () => {
				onSelectNode?.(null);
			});

			try {
				await instance.render();
			} catch (error) {
				if (!instance.destroyed) {
					instance.destroy();
				}

				throw error;
			}

			if (!mounted) {
				if (!instance.destroyed) {
					instance.destroy();
				}

				return;
			}

			graph = instance;
			await applyElementStates(instance, relationData, activeNodeId);
			graphReady = true;
		}
	);

	onMount(() => {
		syncThemeState();
		mounted = true;

		const themeObserver = new MutationObserver(() => {
			syncThemeState();
		});
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"]
		});

		const resizeObserver = new ResizeObserver(() => {
			graph?.resize();
		});
		if (container) {
			resizeObserver.observe(container);
		}

		return () => {
			mounted = false;
			themeObserver.disconnect();
			resizeObserver.disconnect();
			destroyGraph();
		};
	});

	$effect(() => {
		const graphContainer = container;
		const data = graphElements;
		const relationData = graphData;
		const isDarkMode = darkMode;

		if (!mounted || !graphContainer) return;

		void renderQueue.run({ graphContainer, data, relationData, isDarkMode }).catch((error: unknown) => {
			if (mounted) {
				console.error(error);
			}
		});
	});

	$effect(() => {
		const instance = graph;
		const data = graphData;
		const selectedNodeId = activeNodeId;

		if (!instance || !graphReady) return;

		void applyElementStates(instance, data, selectedNodeId);
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
