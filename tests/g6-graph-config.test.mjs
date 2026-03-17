import assert from "node:assert/strict";

import {
	createRelationGraphOptions,
	createRelationGraphTheme
} from "../src/lib/components/relations/g6-graph-config.js";

const theme = createRelationGraphTheme();
const options = createRelationGraphOptions({
	container: "graph-container",
	data: { nodes: [], edges: [] }
});
const sampleDatum = {
	data: {
		type: "person",
		avatarImage: "/avatars/characters/socrates.png",
		avatarFallback: "苏"
	},
	style: {
		size: 56,
		avatarImage: "/avatars/characters/socrates.png",
		avatarFallback: "苏",
		labelText: "Socrates"
	}
};
const baseSize = options.node.style.size(sampleDatum);

assert.equal(options.autoFit, "view", "graph should fit the visible viewport on mount");
assert.equal(options.padding, 52, "graph should keep breathing room around the viewport");
assert.equal(options.animation, true, "graph should enable motion for layout and viewport updates");
assert.deepEqual(options.zoomRange, [0.48, 2.1], "graph should keep a usable zoom range");
assert.equal(options.layout.type, "d3-force", "graph should use the force layout that supports drag-force behavior");
assert.equal(options.layout.preventOverlap, true, "force layout should avoid node collisions");
assert.equal(options.layout.animation, true, "force layout should animate into place");
assert.equal(options.layout.linkDistance, 500, "graph should double the distance between linked nodes");
assert.equal(
	options.layout.nodeStrength,
	-180,
	"graph should use repulsive node force so dragging one node does not pull the whole graph around"
);
assert.equal(
	options.layout.edgeStrength,
	0.09,
	"graph should keep edge force gentle to reduce global swings during drag"
);
assert.equal(
	options.layout.velocityDecay,
	0.72,
	"graph should add stronger damping so movement settles quickly during drag"
);
assert.equal(
	options.layout.alphaDecay,
	0.06,
	"graph should cool the simulation faster after drag disturbances"
);
assert.deepEqual(
	options.layout.collide,
	{ strength: 0.48, radius: 144 },
	"graph should keep the larger collision radius but with softer pushback to avoid jitter"
);
assert.ok(
	options.behaviors.some((behavior) => behavior.type === "drag-element-force"),
	"graph should use drag-element-force for live force-based dragging"
);
assert.ok(
	options.behaviors.some((behavior) => behavior.type === "drag-canvas"),
	"graph should allow canvas dragging"
);
assert.ok(
	options.behaviors.some((behavior) => behavior.type === "zoom-canvas"),
	"graph should allow viewport zooming"
);
assert.equal(
	options.behaviors.find((behavior) => behavior.type === "zoom-canvas")?.sensitivity,
	1.3,
	"graph should zoom more responsively than the previous graph"
);
assert.equal(options.node.style.strokeOpacity, 0, "avatar nodes should not render a visible border");
assert.equal(options.node.style.lineWidth, 0, "avatar nodes should not reserve outline width");
assert.equal(options.node.style.iconWidth(sampleDatum), baseSize, "avatar images should fill the node without padding");
assert.equal(options.node.style.iconHeight(sampleDatum), baseSize, "avatar images should fill the node without padding");
assert.equal(
	options.node.style.iconRadius(sampleDatum),
	baseSize / 2,
	"avatar images should stay clipped to the node edge"
);
assert.ok(options.node.state.active, "node styles should define an active state");
assert.ok(options.node.state.neighbor, "node styles should define a neighbor state");
assert.ok(options.node.state.dimmed, "node styles should define a dimmed state");
assert.equal(options.node.state.active.lineWidth, 0, "active avatars should not add a border");
assert.equal(options.node.state.active.halo, false, "active avatars should not add a halo border");
assert.equal(options.node.state.neighbor.lineWidth, 0, "neighbor avatars should not add a border");
assert.equal(options.node.state.neighbor.halo, false, "neighbor avatars should not add a halo border");
assert.ok(options.edge.state.active, "edge styles should define an active state");
assert.ok(options.edge.state.dimmed, "edge styles should define a dimmed state");
assert.equal(theme.node.person.stroke, "#ba9462");
assert.equal(options.edge.style.labelBackground, true);

console.log("g6-graph-config test passed");
