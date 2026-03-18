# Reading Scene Filter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a chapter-based scene filter to the reading toolbar, positioned to the left of the speaker filter, and combine it with the existing speaker filter when narrowing visible dialogue lines.

**Architecture:** Derive a stable ordered scene list from the existing `chapter` values in `dialogs.json`, keep scene selection as local reading-page state, and render a new dropdown filter component that mirrors the current speaker filter pattern. Update the reading-page filter pipeline so visible lines must satisfy both the active scene selection and the active speaker selection.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript route components, shared reading toolbar layout helpers, lightweight Node assert tests, verification via targeted node tests and `pnpm check`.

---

### Task 1: Add failing tests for scene summary and layout

**Files:**
- Modify: `tests/reading-toolbar-layout.test.mjs`
- Create: `tests/scene-filter-layout.test.mjs`

**Step 1: Write the failing tests**

Add assertions for:

- a new scene summary label function returning `场景 · 全部` and `Scenes · 2/12`
- the desktop reading header layout allowing the scene filter to sit left of the speaker filter
- the new scene filter component existing and exposing the expected copy labels

Run:

```bash
node tests/reading-toolbar-layout.test.mjs
node tests/scene-filter-layout.test.mjs
```

**Step 2: Run tests to verify they fail**

Expected: FAIL because the scene summary helper and scene filter component do not exist yet.

**Step 3: Write minimal implementation to satisfy the tests**

Add the missing helper function and the new component scaffold.

**Step 4: Re-run the tests**

Run:

```bash
node tests/reading-toolbar-layout.test.mjs
node tests/scene-filter-layout.test.mjs
```

Expected: PASS.

### Task 2: Build the scene filter component

**Files:**
- Create: `src/lib/components/reading/scene-filter.svelte`
- Modify: `src/lib/components/reading/reading-toolbar-layout.js`

**Step 1: Mirror the speaker filter interaction pattern**

Create `scene-filter.svelte` using the same `details/summary` dropdown approach as `speaker-filter.svelte`, but without avatars.

**Step 2: Add summary helper support**

Extend `reading-toolbar-layout.js` with a helper for scene summary labels while preserving the current speaker summary behavior.

**Step 3: Keep copy bilingual**

Support:

- `按场景筛选 / Filter by Scene`
- `全选 / Select All`
- `筛选场景 / Filter Scenes`

**Step 4: Re-run targeted tests**

Run:

```bash
node tests/reading-toolbar-layout.test.mjs
node tests/scene-filter-layout.test.mjs
```

Expected: PASS.

### Task 3: Wire scene state into the reading route

**Files:**
- Modify: `src/routes/reading/+page.svelte`

**Step 1: Derive ordered scene options**

Build `defaultSceneIds` from the dialogue list by preserving the first-seen order of `line.chapter`.

**Step 2: Add local scene selection state**

Initialize `activeSceneIds` to all scene IDs.

**Step 3: Add scene filter handlers**

Add:

- `toggleScene(sceneId)`
- `resetScenes()`

**Step 4: Combine filtering rules**

Update `filteredLines` so lines remain visible only when both:

- `activeSceneIds.includes(line.chapter)`
- `activeSpeakerIds.includes(line.speakerId)`

**Step 5: Keep selected-line behavior stable**

Retain the existing effect that moves selection to the first visible line or clears it when no lines remain.

**Step 6: Re-run verification**

Run:

```bash
pnpm check
```

Expected: PASS.

### Task 4: Insert the scene filter to the left of the speaker filter

**Files:**
- Modify: `src/routes/reading/+page.svelte`
- Modify: `src/lib/components/reading/reading-toolbar-layout.js`

**Step 1: Expand toolbar layout**

Adjust the reading header layout helper so the header can accommodate two filter controls on desktop without collapsing the title area awkwardly.

**Step 2: Render both filters in order**

Render:

1. `SceneFilter`
2. `SpeakerFilter`

inside the reading header controls area, keeping the scene filter visually to the left.

**Step 3: Preserve responsive behavior**

Allow wrapping on narrower widths while keeping the scene filter before the speaker filter in DOM and visual order.

**Step 4: Re-run verification**

Run:

```bash
pnpm check
node tests/reading-toolbar-layout.test.mjs
node tests/scene-filter-layout.test.mjs
```

Expected: PASS.

### Task 5: Final regression pass

**Files:**
- Modify: `src/routes/reading/+page.svelte`
- Create: `src/lib/components/reading/scene-filter.svelte`
- Modify: `src/lib/components/reading/reading-toolbar-layout.js`
- Modify: `tests/reading-toolbar-layout.test.mjs`
- Create: `tests/scene-filter-layout.test.mjs`

**Step 1: Verify manual behavior**

Check:

1. scene filter appears left of speaker filter
2. scene filter defaults to all selected
3. toggling scenes narrows the visible lines
4. scene and speaker filters combine with `AND`
5. selected line moves to the first remaining visible line when needed

**Step 2: Run full verification**

Run:

```bash
node tests/reading-toolbar-layout.test.mjs
node tests/scene-filter-layout.test.mjs
pnpm check
```

Expected: all commands PASS.

**Step 3: Commit**

```bash
git add src/routes/reading/+page.svelte src/lib/components/reading/scene-filter.svelte src/lib/components/reading/reading-toolbar-layout.js tests/reading-toolbar-layout.test.mjs tests/scene-filter-layout.test.mjs docs/plans/2026-03-18-reading-scene-filter-design.md docs/plans/2026-03-18-reading-scene-filter-implementation.md
git commit -m "feat: add reading scene filter"
```
