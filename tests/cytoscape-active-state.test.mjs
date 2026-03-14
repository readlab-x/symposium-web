import assert from "node:assert/strict";

import relationsData from "../src/lib/data/relations.json" with { type: "json" };
import { createActiveRelationState } from "../src/lib/components/relations/cytoscape-active-state.js";

const state = createActiveRelationState(relationsData, "socrates");

assert.deepEqual(state.activeNodeIds, ["socrates"]);
assert.deepEqual(
	[...state.neighborNodeIds].sort(),
	["agathon", "alcibiades", "apollodorus", "diotima", "eros"].sort(),
	"active state should return all nodes directly connected to Socrates"
);
assert.deepEqual(
	[...state.activeEdgeIds].sort(),
	["edge-1", "edge-4", "edge-5", "edge-7", "edge-8"].sort(),
	"active state should return all edges directly connected to Socrates"
);

const emptyState = createActiveRelationState(relationsData, null);

assert.equal(emptyState.activeNodeIds.length, 0);
assert.equal(emptyState.neighborNodeIds.length, 0);
assert.equal(emptyState.activeEdgeIds.length, 0);

console.log("cytoscape-active-state test passed");
