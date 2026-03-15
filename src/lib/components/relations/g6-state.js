/**
 * @param {{ nodes: Array<{ id: string }>, edges: Array<{ id: string, source: string, target: string }> }} graph
 * @param {string | null} activeNodeId
 */
export function createG6RelationStateMap(graph, activeNodeId) {
	if (!activeNodeId) {
		return {
			activeNodeIds: [],
			neighborNodeIds: [],
			activeEdgeIds: [],
			dimmedNodeIds: [],
			dimmedEdgeIds: []
		};
	}

	const neighborNodeIds = new Set();
	const activeEdgeIds = [];

	for (const edge of graph.edges) {
		if (edge.source === activeNodeId) {
			neighborNodeIds.add(edge.target);
			activeEdgeIds.push(edge.id);
			continue;
		}

		if (edge.target === activeNodeId) {
			neighborNodeIds.add(edge.source);
			activeEdgeIds.push(edge.id);
		}
	}

	const highlightedNodeIds = new Set([activeNodeId, ...neighborNodeIds]);
	const activeEdgeIdSet = new Set(activeEdgeIds);

	return {
		activeNodeIds: [activeNodeId],
		neighborNodeIds: [...neighborNodeIds],
		activeEdgeIds,
		dimmedNodeIds: graph.nodes
			.map((node) => node.id)
			.filter((nodeId) => !highlightedNodeIds.has(nodeId)),
		dimmedEdgeIds: graph.edges
		.map((edge) => edge.id)
		.filter((edgeId) => !activeEdgeIdSet.has(edgeId))
	};
}

/**
 * @param {{ nodes: Array<{ id: string }>, edges: Array<{ id: string, source: string, target: string }> }} graph
 * @param {string | null} activeNodeId
 * @returns {Record<string, string[]>}
 */
export function createG6ElementStates(graph, activeNodeId) {
	const state = createG6RelationStateMap(graph, activeNodeId);
	const activeNodeIds = new Set(state.activeNodeIds);
	const neighborNodeIds = new Set(state.neighborNodeIds);
	const activeEdgeIds = new Set(state.activeEdgeIds);
	const dimmedNodeIds = new Set(state.dimmedNodeIds);
	const dimmedEdgeIds = new Set(state.dimmedEdgeIds);
	/** @type {Record<string, string[]>} */
	const elementStates = {};

	for (const node of graph.nodes) {
		if (activeNodeIds.has(node.id)) {
			elementStates[node.id] = ["active"];
			continue;
		}

		if (neighborNodeIds.has(node.id)) {
			elementStates[node.id] = ["neighbor"];
			continue;
		}

		elementStates[node.id] = dimmedNodeIds.has(node.id) ? ["dimmed"] : [];
	}

	for (const edge of graph.edges) {
		if (activeEdgeIds.has(edge.id)) {
			elementStates[edge.id] = ["active"];
			continue;
		}

		elementStates[edge.id] = dimmedEdgeIds.has(edge.id) ? ["dimmed"] : [];
	}

	return elementStates;
}
