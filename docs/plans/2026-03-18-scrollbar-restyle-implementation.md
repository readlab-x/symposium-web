# Scrollbar Restyle Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a global low-profile scrollbar style that matches the site's warm reading theme across both page-level and nested scroll containers.

**Architecture:** Keep the change entirely in the global stylesheet so the browser's native scrollbar UI is restyled consistently wherever scrolling appears. Add one lightweight regression test that reads `src/routes/layout.css` and verifies the presence of the new global scrollbar selectors and theme-aware color tokens.

**Tech Stack:** Tailwind v4 global CSS in `src/routes/layout.css`, CSS custom properties, native browser scrollbar selectors, lightweight Node assert test, verification via targeted node test and `pnpm check`.

---

### Task 1: Add a failing regression test

**Files:**
- Create: `tests/scrollbar-styles.test.mjs`

**Step 1: Write the failing test**

Add a source-level regression test that checks `src/routes/layout.css` for:

- a global `scrollbar-width` rule
- a global `scrollbar-color` rule
- `::-webkit-scrollbar`
- `::-webkit-scrollbar-thumb`
- `::-webkit-scrollbar-track`

Run:

```bash
node tests/scrollbar-styles.test.mjs
```

**Step 2: Run test to verify it fails**

Expected: FAIL because the stylesheet does not contain any scrollbar styling yet.

**Step 3: Write the minimal implementation**

Add the global scrollbar rules to `src/routes/layout.css`.

**Step 4: Run test to verify it passes**

Run:

```bash
node tests/scrollbar-styles.test.mjs
```

Expected: PASS.

### Task 2: Implement the global scrollbar style

**Files:**
- Modify: `src/routes/layout.css`

**Step 1: Add theme tokens for the scrollbar**

Define a small set of CSS variables for:

- thumb color
- thumb hover color
- track color

Support both light and dark themes.

**Step 2: Add global scrollbar rules**

Implement:

- `html`
- `body`
- universal fallback via `*`

with Firefox and WebKit-compatible scrollbar styling.

**Step 3: Keep the design restrained**

Use:

- narrow width
- rounded thumb
- light track
- subtle hover emphasis

Avoid large shadows, gradients, or high-contrast ornamentation.

**Step 4: Re-run the targeted test**

Run:

```bash
node tests/scrollbar-styles.test.mjs
```

Expected: PASS.

### Task 3: Final verification

**Files:**
- Modify: `src/routes/layout.css`
- Create: `tests/scrollbar-styles.test.mjs`
- Create: `docs/plans/2026-03-18-scrollbar-restyle-design.md`
- Create: `docs/plans/2026-03-18-scrollbar-restyle-implementation.md`

**Step 1: Run full verification**

Run:

```bash
node tests/scrollbar-styles.test.mjs
pnpm check
```

Expected: both commands PASS.

**Step 2: Manual review**

Check in the browser that:

1. the page scrollbar matches the site theme
2. nested scroll areas share the same look
3. thumb hover is visible but not loud
4. dark mode remains warm and readable

**Step 3: Commit**

```bash
git add src/routes/layout.css tests/scrollbar-styles.test.mjs docs/plans/2026-03-18-scrollbar-restyle-design.md docs/plans/2026-03-18-scrollbar-restyle-implementation.md
git commit -m "style: restyle global scrollbars"
```
