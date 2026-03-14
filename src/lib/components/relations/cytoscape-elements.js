/**
 * @param {{ nodes: Array<{ id: string, label: string, type: string, summary: string }>, edges: Array<{ id: string, source: string, target: string, relation: string }> }} graph
 */
export function createCytoscapeElements(graph) {
	return [
		...graph.nodes.map((node) => ({
			group: "nodes",
			data: {
				id: node.id,
				label: node.label,
				type: node.type,
				summary: node.summary
			}
		})),
		...graph.edges.map((edge) => ({
			group: "edges",
			data: {
				id: edge.id,
				source: edge.source,
				target: edge.target,
				relation: edge.relation
			}
		}))
	];
}
