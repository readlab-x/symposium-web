import assert from "node:assert/strict";

import relationsData from "../src/lib/data/relations.json" with { type: "json" };
import { createG6Elements } from "../src/lib/components/relations/g6-elements.js";

const elements = createG6Elements(relationsData);

assert.equal(
	elements.nodes.length,
	relationsData.nodes.length,
	"all relation nodes should map to G6 nodes"
);
assert.equal(
	elements.edges.length,
	relationsData.edges.length,
	"all relation edges should map to G6 edges"
);

assert.equal(elements.nodes[0].id, relationsData.nodes[0].id);
assert.equal(elements.nodes[0].data.label, relationsData.nodes[0].label);
assert.equal(elements.nodes[0].data.summary, relationsData.nodes[0].summary);
assert.equal(elements.nodes[0].style.x, relationsData.nodes[0].x);
assert.equal(elements.nodes[0].style.y, relationsData.nodes[0].y);
assert.equal(elements.nodes[0].style.labelText, relationsData.nodes[0].label);

assert.equal(elements.edges[0].id, relationsData.edges[0].id);
assert.equal(elements.edges[0].source, relationsData.edges[0].source);
assert.equal(elements.edges[0].target, relationsData.edges[0].target);
assert.equal(elements.edges[0].data.relation, relationsData.edges[0].relation);
assert.equal(elements.edges[0].style.labelText, relationsData.edges[0].relation);
assert.equal(elements.edges[0].style.labelBackground, true);
assert.equal(elements.edges[0].style.labelWordWrap, true);

console.log("g6-elements test passed");
