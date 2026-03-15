# G6 relations graph migration implementation plan

> **For Claude:** REQUIRED SUB-SKILL: Use
> superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the `/relations` Cytoscape graph with a G6 5.x graph that
preserves selection-driven details while improving force-layout behavior and
edge label readability.

**Architecture:** Keep `src/routes/relations/+page.svelte` as the page-level
state owner. Replace the graph engine inside
`src/lib/components/relations/relation-graph.svelte`, and move G6-specific data
mapping and state mapping into small pure helper modules that can be covered by
Node-based tests before the UI is rewired. Remove Cytoscape-only helpers after
the new component is stable.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Tailwind CSS 4, G6 5.x,
Node-based regression tests

---

### Task 1: Add G6 and keep the install verifiable

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Add the dependency**

Run:

```bash
npm install @antv/g6
```

**Step 2: Verify the toolchain still loads**

Run:

```bash
npm run check
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "build: add g6 for relations graph"
```

### Task 2: Add failing tests for G6 data mapping

**Files:**
- Create: `src/lib/components/relations/g6-elements.js`
- Create: `tests/g6-elements.test.mjs`

**Step 1: Write the failing test**

Cover:
- node count and edge count
- node business fields in `data`
- node visual size in `style`
- edge label copied to `style.labelText`

**Step 2: Run the test to verify RED**

Run:

```bash
node tests/g6-elements.test.mjs
```

**Step 3: Write the minimal implementation**

Map `relations.json` into G6 5.x graph data using:
- `nodes[].data` for label, summary, and type
- `nodes[].style` for size and optional starting coordinates
- `edges[].style` for center label content and label background

**Step 4: Run the test to verify GREEN**

Run:

```bash
node tests/g6-elements.test.mjs
```

**Step 5: Commit**

```bash
git add src/lib/components/relations/g6-elements.js tests/g6-elements.test.mjs
git commit -m "test: add g6 relations data mapper"
```

### Task 3: Add failing tests for active-state mapping

**Files:**
- Create: `src/lib/components/relations/g6-state.js`
- Create: `tests/g6-state.test.mjs`

**Step 1: Write the failing test**

Cover:
- active node id list
- neighbor node id list
- active edge id list
- empty state when nothing is selected

**Step 2: Run the test to verify RED**

Run:

```bash
node tests/g6-state.test.mjs
```

**Step 3: Write the minimal implementation**

Return a pure object that the component can use to call G6 state APIs or direct
style updates.

**Step 4: Run the test to verify GREEN**

Run:

```bash
node tests/g6-state.test.mjs
```

**Step 5: Commit**

```bash
git add src/lib/components/relations/g6-state.js tests/g6-state.test.mjs
git commit -m "test: add g6 relations active state mapper"
```

### Task 4: Replace the relation graph component

**Files:**
- Modify: `src/lib/components/relations/relation-graph.svelte`

**Step 1: Use the type/build pipeline as the RED step**

Run:

```bash
npm run check
```

Expected: fail while the component is mid-migration.

**Step 2: Rebuild the component around G6**

Implement:
- `new Graph({ ... })` in `onMount`
- `autoFit: 'view'`
- `layout: { type: 'force', preventOverlap: true, animation: true }`
- `behaviors` for canvas drag, zoom, and element drag
- node click to call `onSelectNode?.(id)`
- canvas click to clear selection
- dark/light palette parity with the existing page card

**Step 3: Wire highlight state**

Use the pure active-state helper to update node and edge emphasis without
duplicating graph traversal logic inside the component.

**Step 4: Run verification**

Run:

```bash
npm run check
npm run build
```

**Step 5: Commit**

```bash
git add src/lib/components/relations/relation-graph.svelte
git commit -m "feat: replace cytoscape relation graph with g6"
```

### Task 5: Remove Cytoscape-only graph helpers

**Files:**
- Delete or stop importing:
  `src/lib/components/relations/cytoscape-*.js`
- Delete or replace:
  `tests/cytoscape-*.test.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Remove dead Cytoscape graph code**

Delete helpers that are no longer referenced by the page.

**Step 2: Remove the dependency if no other file uses it**

Run:

```bash
npm uninstall cytoscape
```

**Step 3: Run full verification**

Run:

```bash
Get-ChildItem tests/*.mjs | ForEach-Object { node $_.FullName }
npm run check
npm run build
```

**Step 4: Commit**

```bash
git add src/lib/components/relations tests package.json package-lock.json
git commit -m "refactor: remove cytoscape relations graph"
```
