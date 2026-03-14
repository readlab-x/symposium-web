import assert from "node:assert/strict";

import relationsData from "../src/lib/data/relations.json" with { type: "json" };
import { createCytoscapeElements } from "../src/lib/components/relations/cytoscape-elements.js";

const elements = createCytoscapeElements(relationsData);
const nodes = elements.filter((item) => item.group === "nodes");
const edges = elements.filter((item) => item.group === "edges");

assert.equal(
	nodes.length,
	relationsData.nodes.length,
	"all relation nodes should map to Cytoscape node elements"
);

assert.equal(
	edges.length,
	relationsData.edges.length,
	"all relation edges should map to Cytoscape edge elements"
);

assert.equal(nodes[0].data.id, relationsData.nodes[0].id);
assert.equal(edges[0].data.source, relationsData.edges[0].source);

console.log("cytoscape-elements test passed");
