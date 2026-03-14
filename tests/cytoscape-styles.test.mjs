import assert from "node:assert/strict";

import { createRelationGraphStyles } from "../src/lib/components/relations/cytoscape-styles.js";

const styles = createRelationGraphStyles();
const selectors = styles.map((rule) => rule.selector);

assert.ok(selectors.includes("node"), "base node selector should exist");
assert.ok(selectors.includes("edge"), "base edge selector should exist");
assert.ok(selectors.includes('node[type = "person"]'), "person selector should exist");
assert.ok(selectors.includes('node[type = "deity"]'), "deity selector should exist");
assert.ok(selectors.includes(".is-active"), "active-node selector should exist");
assert.ok(selectors.includes(".is-neighbor"), "neighbor selector should exist");
assert.ok(selectors.includes(".is-active-edge"), "active-edge selector should exist");

console.log("cytoscape-styles test passed");
