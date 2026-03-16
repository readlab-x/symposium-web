/**
 * @param {{
 *   nodes: Array<{
 *     id: string,
 *     label: string,
 *     type: string,
 *     summary: string,
 *     x: number,
 *     y: number,
 *     avatarImage?: string,
 *     avatarFallback?: string
 *   }>;
 *   edges: Array<{ id: string, source: string, target: string, relation: string }>;
 * }} graph
 */
export function createG6Elements(graph) {
	return {
		nodes: graph.nodes.map((node) => ({
			id: node.id,
			data: {
				label: node.label,
				type: node.type,
				summary: node.summary,
				avatarImage: node.avatarImage,
				avatarFallback: node.avatarFallback
			},
			style: {
				x: node.x,
				y: node.y,
				size: 56,
				labelText: node.label,
				avatarImage: node.avatarImage,
				avatarFallback: node.avatarFallback
			}
		})),
		edges: graph.edges.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			data: {
				relation: edge.relation
			},
			style: {
				labelText: edge.relation,
				labelBackground: true,
				labelWordWrap: true
			}
		}))
	};
}
