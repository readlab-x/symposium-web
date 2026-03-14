# Cytoscape Relations Graph Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the `/relations` page from a static SVG scaffold to a real interactive Cytoscape.js graph while preserving the site's restrained academic tone.

**Architecture:** Add Cytoscape.js as the graph engine, keep `src/routes/relations/+page.svelte` as the page orchestrator, and move graph-specific data mapping and style configuration into small pure helper modules that can be tested before wiring up the Svelte component. Implement behavior incrementally: dependency, helper tests, component replacement, page sync, then browser verification.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Tailwind CSS 4, Cytoscape.js, Node-based regression tests

---

### Task 1: Add Cytoscape Dependency

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Add the dependency**

Run:

```bash
npm install cytoscape
```

Expected:
- `package.json` includes `cytoscape`
- lockfile updates cleanly

**Step 2: Verify install integrity**

Run:

```bash
npm run check
```

Expected: `svelte-check found 0 errors and 0 warnings`

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add cytoscape for relations graph"
```

### Task 2: Create a Tested Cytoscape Element Mapper

**Files:**
- Create: `src/lib/components/relations/cytoscape-elements.js`
- Create: `tests/cytoscape-elements.test.mjs`

**Step 1: Write the failing test**

Create `tests/cytoscape-elements.test.mjs`:

```javascript
import assert from "node:assert/strict";
import relationsData from "../src/lib/data/relations.json" with { type: "json" };
import { createCytoscapeElements } from "../src/lib/components/relations/cytoscape-elements.js";

const elements = createCytoscapeElements(relationsData);
const nodes = elements.filter((item) => item.group === "nodes");
const edges = elements.filter((item) => item.group === "edges");

assert.equal(nodes.length, relationsData.nodes.length);
assert.equal(edges.length, relationsData.edges.length);
assert.equal(nodes[0].data.id, relationsData.nodes[0].id);
assert.equal(edges[0].data.source, relationsData.edges[0].source);

console.log("cytoscape-elements test passed");
```

**Step 2: Run the test to verify RED**

Run:

```bash
node tests/cytoscape-elements.test.mjs
```

Expected: FAIL because `createCytoscapeElements` does not exist yet

**Step 3: Write the minimal implementation**

Create `src/lib/components/relations/cytoscape-elements.js`:

```javascript
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
```

**Step 4: Run the test to verify GREEN**

Run:

```bash
node tests/cytoscape-elements.test.mjs
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/components/relations/cytoscape-elements.js tests/cytoscape-elements.test.mjs
git commit -m "test: add cytoscape element mapping helper"
```

### Task 3: Create a Tested Cytoscape Style Configuration

**Files:**
- Create: `src/lib/components/relations/cytoscape-styles.js`
- Create: `tests/cytoscape-styles.test.mjs`

**Step 1: Write the failing test**

Create `tests/cytoscape-styles.test.mjs`:

```javascript
import assert from "node:assert/strict";
import { createRelationGraphStyles } from "../src/lib/components/relations/cytoscape-styles.js";

const styles = createRelationGraphStyles();
const selectors = styles.map((rule) => rule.selector);

assert.ok(selectors.includes("node"));
assert.ok(selectors.includes("edge"));
assert.ok(selectors.includes('node[type = "person"]'));
assert.ok(selectors.includes('node[type = "deity"]'));
assert.ok(selectors.includes(".is-active"));
assert.ok(selectors.includes(".is-neighbor"));
assert.ok(selectors.includes(".is-active-edge"));

console.log("cytoscape-styles test passed");
```

**Step 2: Run the test to verify RED**

Run:

```bash
node tests/cytoscape-styles.test.mjs
```

Expected: FAIL because `createRelationGraphStyles` does not exist yet

**Step 3: Write the minimal implementation**

Create `src/lib/components/relations/cytoscape-styles.js` with a returned style array that includes:

```javascript
[
	{ selector: "node", style: { label: "data(label)" } },
	{ selector: "edge", style: { label: "data(relation)" } },
	{ selector: 'node[type = "person"]', style: {} },
	{ selector: 'node[type = "deity"]', style: {} },
	{ selector: ".is-active", style: {} },
	{ selector: ".is-neighbor", style: {} },
	{ selector: ".is-active-edge", style: {} }
]
```

Then fill the actual style objects with restrained colors, opacity, line weight, and typography aligned to the existing theme.

**Step 4: Run the test to verify GREEN**

Run:

```bash
node tests/cytoscape-styles.test.mjs
```

Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/components/relations/cytoscape-styles.js tests/cytoscape-styles.test.mjs
git commit -m "test: add cytoscape relation graph styles"
```

### Task 4: Replace the Static SVG with a Cytoscape Component

**Files:**
- Modify: `src/lib/components/relations/relation-graph.svelte`
- Modify: `src/lib/types.ts`

**Step 1: Write the failing testable expectation**

Use the existing type/build pipeline as the RED step by making the component import the new helpers before implementation is complete.

Run:

```bash
npm run check
```

Expected: FAIL until the Cytoscape component wiring is valid

**Step 2: Replace the component implementation**

Rewrite `src/lib/components/relations/relation-graph.svelte` to:

- create a container element for Cytoscape
- instantiate Cytoscape in `onMount`
- pass in `createCytoscapeElements(...)`
- pass in `createRelationGraphStyles()`
- use a standard layout:

```javascript
layout: { name: "cose", animate: false, padding: 24 }
```

- enable:

```javascript
userZoomingEnabled: true
userPanningEnabled: true
boxSelectionEnabled: false
```

- bind node click to `onSelectNode?.(id)`
- bind background click to `onSelectNode?.(null)`
- update Cytoscape classes when `activeNodeId` changes

**Step 3: Adjust types**

Update `src/lib/types.ts` so the callback path can clear selection:

```typescript
onSelectNode?: (id: string | null) => void;
```

Or, if callback types are not centralized, ensure the Svelte props accept `string | null`.

**Step 4: Run the type/build verification**

Run:

```bash
npm run check
npm run build
```

Expected:
- `svelte-check found 0 errors and 0 warnings`
- successful static build

**Step 5: Commit**

```bash
git add src/lib/components/relations/relation-graph.svelte src/lib/types.ts
git commit -m "feat: replace static relation svg with cytoscape graph"
```

### Task 5: Update the Relations Page for Graph-Driven Selection

**Files:**
- Modify: `src/routes/relations/+page.svelte`

**Step 1: Write the failing testable expectation**

Use the existing route behavior as the RED step by asserting the page can handle `null` graph selection without crashing.

Add or extend a small regression script:

```javascript
import assert from "node:assert/strict";
import relationsData from "../src/lib/data/relations.json" with { type: "json" };

const node = relationsData.nodes.find((item) => item.id === "socrates");
assert.ok(node);
```

This is intentionally minimal; the main regression protection here is `npm run check` plus page-level verification.

**Step 2: Update page state**

Ensure `activeNodeId` can be set to `null` from graph background clicks:

```typescript
let activeNodeId = $state<string | null>(relations.nodes[0]?.id ?? null);
```

Keep the derived `activeNode` and `relatedEdges` logic, but make sure the page renders the empty prompt when selection is cleared.

**Step 3: Run verification**

Run:

```bash
npm run check
npm run build
```

Expected:
- `svelte-check found 0 errors and 0 warnings`
- successful static build

**Step 4: Commit**

```bash
git add src/routes/relations/+page.svelte
git commit -m "feat: sync relations panel with cytoscape selection"
```

### Task 6: Final Browser Verification on the Relations Page

**Files:**
- Review only: `src/routes/relations/+page.svelte`
- Review only: `src/lib/components/relations/relation-graph.svelte`
- Review only: `src/lib/components/relations/cytoscape-elements.js`
- Review only: `src/lib/components/relations/cytoscape-styles.js`
- Review only: `src/lib/data/relations.json`

**Step 1: Run the full automated verification**

Run:

```bash
node tests/cytoscape-elements.test.mjs
node tests/cytoscape-styles.test.mjs
node tests/reading-toolbar-layout.test.mjs
node tests/dialogue-line-state.test.mjs
node tests/site-shell-layout.test.mjs
npm run check
npm run build
```

Expected:
- all Node tests pass
- `svelte-check found 0 errors and 0 warnings`
- successful static build

**Step 2: Smoke-test the graph in a browser**

Manual/browser expectations:

- graph renders inside the left panel
- nodes can be clicked
- clicking a node updates the right detail panel
- clicking empty graph space clears the detail panel
- graph can pan and zoom
- the visual style reads as restrained and consistent with the site theme

**Step 3: Commit**

```bash
git add src/lib/components/relations/relation-graph.svelte src/lib/components/relations/cytoscape-elements.js src/lib/components/relations/cytoscape-styles.js src/routes/relations/+page.svelte tests/cytoscape-elements.test.mjs tests/cytoscape-styles.test.mjs
git commit -m "feat: ship cytoscape relations graph v1"
```
