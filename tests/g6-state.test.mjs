import assert from "node:assert/strict";

import relationsData from "../src/lib/data/relations.json" with { type: "json" };
import {
	createG6ElementStates,
	createG6RelationStateMap
} from "../src/lib/components/relations/g6-state.js";

const state = createG6RelationStateMap(relationsData, "socrates");

assert.deepEqual(state.activeNodeIds, ["socrates"]);
assert.deepEqual(
	[...state.neighborNodeIds].sort(),
	["agathon", "alcibiades", "apollodorus", "diotima", "eros"].sort(),
	"the selected node should expose all directly connected neighbors"
);
assert.deepEqual(
	[...state.activeEdgeIds].sort(),
	["edge-1", "edge-4", "edge-5", "edge-7", "edge-8"].sort(),
	"the selected node should expose all directly connected edges"
);
assert.ok(
	state.dimmedNodeIds.includes("phaedrus"),
	"unrelated nodes should be marked dimmed when a selection exists"
);
assert.ok(
	state.dimmedEdgeIds.includes("edge-2"),
	"unrelated edges should be marked dimmed when a selection exists"
);

const emptyState = createG6RelationStateMap(relationsData, null);

assert.equal(emptyState.activeNodeIds.length, 0);
assert.equal(emptyState.neighborNodeIds.length, 0);
assert.equal(emptyState.activeEdgeIds.length, 0);
assert.equal(emptyState.dimmedNodeIds.length, 0);
assert.equal(emptyState.dimmedEdgeIds.length, 0);

const elementStates = createG6ElementStates(relationsData, "socrates");

assert.deepEqual(elementStates.socrates, ["active"]);
assert.deepEqual(elementStates.agathon, ["neighbor"]);
assert.deepEqual(elementStates.phaedrus, ["dimmed"]);
assert.deepEqual(elementStates["edge-1"], ["active"]);
assert.deepEqual(elementStates["edge-2"], ["dimmed"]);

const emptyElementStates = createG6ElementStates(relationsData, null);

assert.deepEqual(emptyElementStates.socrates, []);
assert.deepEqual(emptyElementStates["edge-1"], []);

console.log("g6-state test passed");
