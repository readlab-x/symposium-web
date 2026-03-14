/**
 * @param {{ edges: Array<{ id: string, source: string, target: string }> }} graph
 * @param {string | null} activeNodeId
 */
export function createActiveRelationState(graph, activeNodeId) {
	if (!activeNodeId) {
		return {
			activeNodeIds: [],
			neighborNodeIds: [],
			activeEdgeIds: []
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

	return {
		activeNodeIds: [activeNodeId],
		neighborNodeIds: [...neighborNodeIds],
		activeEdgeIds
	};
}
