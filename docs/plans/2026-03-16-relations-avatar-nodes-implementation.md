# Relations Avatar Nodes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Render Symposium relation graph nodes as avatar-based G6 nodes while preserving type borders, active/neighbor/dimmed states, and always-visible labels.

**Architecture:** Keep relation topology in `relations.json` and avatar metadata in `characters.json`, then join the two datasets before graph rendering. Replace the current generic circle-node configuration with a custom avatar-capable node pipeline so image avatars, fallback glyphs, borders, and state halos are controlled in one place.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, G6, local SVG avatar assets, static JSON data, verification via `node scripts/verify-character-avatar-data.mjs`, `npm run check`, and `npm run build`.

---

### Task 1: Add relation-graph avatar data mapping

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/routes/relations/+page.svelte`
- Test: `src/routes/relations/+page.svelte`

**Step 1: Write the failing test**

Add a derived mapping in `src/routes/relations/+page.svelte` that expects character avatar fields to be present on graph nodes:

```ts
const graphNodes = $derived.by(() =>
  relations.nodes.map((node) => ({
    ...node,
    avatarImage: charactersById[node.id]?.avatarImage,
    avatarFallback: charactersById[node.id]?.avatar ?? node.label.slice(0, 1)
  }))
);
```

This should fail type-checking until `RelationNode` supports avatar data or a graph-specific node type is introduced.

**Step 2: Run test to verify it fails**

Run: `npm run check`
Expected: FAIL with a TypeScript mismatch involving `avatarImage` or `avatarFallback`

**Step 3: Write minimal implementation**

- Extend `RelationNode` or introduce a graph-local node type in `src/lib/types.ts` with:

```ts
avatarImage?: string;
avatarFallback?: string;
```

- In `src/routes/relations/+page.svelte`, import `characters.json`, build `charactersById`, and create `graphNodes` with joined avatar data.
- Pass `graphNodes` into `RelationGraph` instead of raw `relations.nodes`.

**Step 4: Run test to verify it passes**

Run: `npm run check`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/types.ts src/routes/relations/+page.svelte
git commit -m "feat: map character avatars into relation graph nodes"
```

### Task 2: Create a G6 avatar node element shape

**Files:**
- Modify: `src/lib/components/relations/g6-elements.js`
- Modify: `src/lib/components/relations/g6-graph-config.js`
- Test: `src/lib/components/relations/g6-elements.js`

**Step 1: Write the failing test**

Update `createG6Elements` to emit node style fields needed for avatar rendering:

```js
style: {
  x: node.x,
  y: node.y,
  size: 56,
  labelText: node.label,
  avatarImage: node.avatarImage,
  avatarFallback: node.avatarFallback
}
```

This should fail at runtime or render as no-op until the graph config understands those properties.

**Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: PASS build or partial runtime mismatch, but no visible avatar behavior until Task 3 is implemented

**Step 3: Write minimal implementation**

- Update `createG6Elements` so node data includes avatar fields.
- In `src/lib/components/relations/g6-graph-config.js`, replace the generic `circle` node approach with an avatar-capable node definition.
- The node should support:
  - circular image crop when `avatarImage` exists
  - fallback glyph when no image exists
  - label at bottom
  - border color by node type

If G6 requires a custom node registration helper, add it in the same file or a small dedicated helper file under `src/lib/components/relations/`.

**Step 4: Run test to verify it passes**

Run:
- `npm run check`
- `npm run build`

Expected: both PASS

**Step 5: Commit**

```bash
git add src/lib/components/relations/g6-elements.js src/lib/components/relations/g6-graph-config.js
git commit -m "feat: render relation graph avatar nodes"
```

### Task 3: Rework state styling for avatar nodes

**Files:**
- Modify: `src/lib/components/relations/g6-graph-config.js`
- Modify: `src/lib/components/relations/g6-state.js`
- Test: `src/lib/components/relations/g6-state.js`

**Step 1: Write the failing test**

Preserve the current state map but assert avatar nodes still receive distinct visual states:

- `active` gets stronger outer ring + halo
- `neighbor` gets a lighter outer ring
- `dimmed` lowers node and label opacity

Start by tightening state expectations in the config layer. Without implementation, the avatar nodes will look too similar across states.

**Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: build passes, but the visual spec is not yet met until styles are updated

**Step 3: Write minimal implementation**

In `src/lib/components/relations/g6-graph-config.js`:

- Keep the current semantic states: `active`, `neighbor`, `dimmed`
- Shift emphasis from fill color to:
  - border color
  - outer ring thickness
  - halo visibility
  - overall opacity for dimmed nodes
- Keep labels always visible, but allow label opacity to drop in dimmed state

In `src/lib/components/relations/g6-state.js`:

- Keep the current state assignment logic unless avatar nodes reveal a missing edge case
- Do not add hover-driven selection logic

**Step 4: Run test to verify it passes**

Run:
- `npm run check`
- `npm run build`

Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/components/relations/g6-graph-config.js src/lib/components/relations/g6-state.js
git commit -m "feat: preserve relation graph states on avatar nodes"
```

### Task 4: Add selected-node avatar to the detail panel

**Files:**
- Modify: `src/routes/relations/+page.svelte`
- Test: `src/routes/relations/+page.svelte`

**Step 1: Write the failing test**

Update the selected-node detail header to expect avatar content:

```svelte
{#if activeNode}
  <div class="...">
    <Avatar.Root>
      {#if activeNode.avatarImage}
        <Avatar.Image ... />
      {/if}
      <Avatar.Fallback>{activeNode.avatarFallback}</Avatar.Fallback>
    </Avatar.Root>
    ...
  </div>
{/if}
```

This should initially fail until `activeNode` carries avatar data from Task 1.

**Step 2: Run test to verify it fails**

Run: `npm run check`
Expected: FAIL if `activeNode` is still typed without avatar fields

**Step 3: Write minimal implementation**

- Import the shared avatar component in `src/routes/relations/+page.svelte`
- Render the selected node avatar in the detail card header
- Keep the related connections list text-only for this first pass

**Step 4: Run test to verify it passes**

Run: `npm run check`
Expected: PASS

**Step 5: Commit**

```bash
git add src/routes/relations/+page.svelte
git commit -m "feat: show selected avatar in relation details"
```

### Task 5: Tighten layout density for always-visible labels

**Files:**
- Modify: `src/lib/components/relations/g6-graph-config.js`
- Test: `src/lib/components/relations/relation-graph.svelte`

**Step 1: Write the failing test**

Increase avatar node size and keep labels always visible. This will expose graph density issues if layout values stay unchanged.

**Step 2: Run test to verify it fails**

Run: `npm run build`
Expected: build passes, but manual review shows crowding if link distance and collide radius remain tuned for 42px circle nodes

**Step 3: Write minimal implementation**

Tune layout constants in `src/lib/components/relations/g6-graph-config.js`:

- raise node size to avatar-friendly values
- increase collide radius
- adjust link distance if needed
- slightly weaken default edge labels so avatar nodes remain the primary read target

Do not add zoom-threshold label hiding in this task.

**Step 4: Run test to verify it passes**

Run:
- `npm run check`
- `npm run build`

Manual check:
- open `/relations`
- confirm names remain legible
- confirm avatar circles do not overlap edge labels excessively

**Step 5: Commit**

```bash
git add src/lib/components/relations/g6-graph-config.js
git commit -m "polish: tune relation graph density for avatar nodes"
```

### Task 6: Add a focused verification script for relation avatar readiness

**Files:**
- Create: `scripts/verify-relation-avatar-join.mjs`
- Modify: `README.md`
- Test: `scripts/verify-relation-avatar-join.mjs`

**Step 1: Write the failing test**

Create `scripts/verify-relation-avatar-join.mjs` that asserts every relation node of type `person` or `deity` can resolve a character avatar record by `id`:

```js
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const relations = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/data/relations.json'), 'utf8'));
const characters = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/data/characters.json'), 'utf8'));
const characterIds = new Set(characters.map((item) => item.id));

for (const node of relations.nodes) {
  if ((node.type === 'person' || node.type === 'deity') && !characterIds.has(node.id)) {
    throw new Error(`Missing avatar source character for relation node ${node.id}`);
  }
}

console.log(`Verified ${relations.nodes.length} relation nodes for avatar join readiness.`);
```

**Step 2: Run test to verify it fails only if the dataset is incomplete**

Run: `node scripts/verify-relation-avatar-join.mjs`
Expected: PASS today, unless relation nodes and character data have drifted

**Step 3: Write minimal implementation**

- Add the script file
- Document the relation-avatar join contract in `README.md`

**Step 4: Run test to verify it passes**

Run:
- `node scripts/verify-relation-avatar-join.mjs`
- `node scripts/verify-character-avatar-data.mjs`
- `npm run check`

Expected: PASS

**Step 5: Commit**

```bash
git add scripts/verify-relation-avatar-join.mjs README.md
git commit -m "test: verify relation graph avatar join contract"
```
