<script lang="ts">
	import RelationGraph from "$lib/components/relations/relation-graph.svelte";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import charactersData from "$lib/data/characters.json";
	import relationsData from "$lib/data/relations.json";
	import {
		getDisplayCharacterName,
		getDisplayRelationEdgeRelation,
		getDisplayRelationNodeLabel,
		getDisplayRelationNodeSummary,
		i18nPreferences,
		pickByLanguage
	} from "$lib/stores/i18n";
	import type { Character, RelationGraphNode, RelationsGraph } from "$lib/types";

	const characters = charactersData as Character[];
	const relations = relationsData as RelationsGraph;
	const charactersById = Object.fromEntries(
		characters.map((character) => [character.id, character])
	) as Record<string, Character>;

	let activeNodeId = $state<string | null>(null);
	const graphNodes = $derived.by(
		() =>
			relations.nodes.map((node) => {
				const character = charactersById[node.id];
				const label = character
					? getDisplayCharacterName(character, $i18nPreferences.primaryLanguage)
					: getDisplayRelationNodeLabel(node, $i18nPreferences.primaryLanguage);

				return {
					...node,
					label,
					summary: getDisplayRelationNodeSummary(node, $i18nPreferences.primaryLanguage),
					avatarImage: character?.avatarImage,
					avatarFallback: character?.avatar || label.trim().slice(0, 1) || "?"
				} satisfies RelationGraphNode;
			}) as RelationGraphNode[]
	);
	const graphEdges = $derived.by(() =>
		relations.edges.map((edge) => ({
			...edge,
			relation: getDisplayRelationEdgeRelation(edge, $i18nPreferences.primaryLanguage)
		}))
	);
	const nodesById = $derived.by(
		() => Object.fromEntries(graphNodes.map((node) => [node.id, node])) as Record<string, RelationGraphNode>
	);
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "人物关系图",
				description: "拖拽、缩放并选择人物节点，查看《会饮》中的论辩、师承与叙事关系。",
				selectNode: "选择一个节点",
				emptyDetail: "点击左侧关系图中的节点后显示关系详情。",
				deity: "神祇",
				person: "人物",
				place: "地点",
				relatedTo: "关联对象"
			},
			"en-US": {
				title: "Relation Graph",
				description:
					"Drag, zoom, and select nodes to inspect the argumentative, pedagogical, and narrative relations inside Symposium.",
				selectNode: "Select a node",
				emptyDetail: "Select a node in the graph to inspect its relations.",
				deity: "Deity",
				person: "Person",
				place: "Place",
				relatedTo: "Related To"
			}
		})
	);

	const activeNode = $derived.by(() => (activeNodeId ? nodesById[activeNodeId] ?? null : null));
	const relatedEdges = $derived.by(() =>
		activeNodeId
			? graphEdges.filter(
					(edge) => edge.source === activeNodeId || edge.target === activeNodeId
				)
			: []
	);
	const relatedConnections = $derived.by(() =>
		relatedEdges.map((edge) => {
			const otherNodeId = edge.source === activeNodeId ? edge.target : edge.source;
			return {
				edge,
				otherNode: nodesById[otherNodeId]
			};
		})
	);

	function entryDelayClass(index: number): string {
		if (index === 0) return "motion-delay-1";
		if (index === 1) return "motion-delay-2";
		if (index === 2) return "motion-delay-3";
		return "motion-delay-4";
	}

	function entityTypeLabel(type: RelationGraphNode["type"]): string {
		if (type === "deity") return copy.deity;
		if (type === "place") return copy.place;
		return copy.person;
	}
</script>

<section class="space-y-5">
	<header class="motion-stage-hero max-w-3xl space-y-2">
		<h1 class="text-2xl font-semibold tracking-tight">{copy.title}</h1>
		<p class="text-sm text-muted-foreground">{copy.description}</p>
	</header>

	<div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
		<RelationGraph
			nodes={graphNodes}
			edges={graphEdges}
			{activeNodeId}
			onSelectNode={(id) => (activeNodeId = id)}
		/>
		<Card.Root class="motion-stage-soft motion-delay-2 border-border/60 bg-card/72">
			<Card.Header class="space-y-4">
				{#if activeNode}
					<div class="flex items-start gap-3">
						<Avatar.Root class="size-12 shrink-0 border border-border/60 bg-secondary/35 shadow-sm">
							{#if activeNode.avatarImage}
								<Avatar.Image
									src={activeNode.avatarImage}
									alt={activeNode.label}
									class="object-cover"
								/>
							{/if}
							<Avatar.Fallback class="text-sm font-medium">
								{activeNode.avatarFallback ?? "?"}
							</Avatar.Fallback>
						</Avatar.Root>
						<div class="min-w-0 space-y-2">
							<div class="flex flex-wrap items-center gap-2">
								<Card.Title class="text-base">{activeNode.label}</Card.Title>
								<Badge variant="outline">{entityTypeLabel(activeNode.type)}</Badge>
							</div>
							<Card.Description>{activeNode.summary}</Card.Description>
						</div>
					</div>
				{:else}
					<Card.Title class="text-base">{copy.selectNode}</Card.Title>
				{/if}
			</Card.Header>
			<Card.Content class="space-y-3">
				{#key activeNodeId ?? "none"}
					{#if !activeNode}
						<p class="motion-stage-soft text-sm text-muted-foreground">{copy.emptyDetail}</p>
					{:else}
						<div class="space-y-3">
							<ul class="space-y-2">
								{#each relatedConnections as connection, index (connection.edge.id)}
									<li
										class={`motion-stage-soft ${entryDelayClass(index)} rounded-[1.1rem] border border-border/60 bg-secondary/24 p-3 text-sm transition-[transform,background-color,border-color] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] hover:translate-x-1 hover:bg-secondary/38 hover:border-primary/24`}
									>
										<p class="font-medium">
											{copy.relatedTo}: {connection.otherNode?.label ?? "—"}
										</p>
										<p class="mt-1 text-muted-foreground">{connection.edge.relation}</p>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/key}
			</Card.Content>
		</Card.Root>
	</div>
</section>
