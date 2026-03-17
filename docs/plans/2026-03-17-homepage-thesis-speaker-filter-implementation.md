# Homepage Thesis Card Speaker Filter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the four homepage thesis cards open the reading page with only the corresponding speaker selected.

**Architecture:** Add a tiny query parsing helper to keep URL preset handling testable, then use it in the reading route to derive the initial `activeSpeakerIds` from `?speakers=`. Update the homepage thesis card URLs to emit those query presets while leaving all other homepage links unchanged.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript route components, small JavaScript helper module, Node assert tests, verification via targeted node tests and `pnpm check`.

---

### Task 1: Add a failing test for speaker preset parsing

**Files:**
- Create: `tests/reading-speaker-query.test.mjs`
- Create: `src/lib/reading/speaker-query.js`

**Step 1: Write the failing test**

Add a test file that asserts:

- a single valid ID returns only that speaker
- multiple valid IDs are preserved
- invalid IDs are discarded
- all-invalid input falls back to the provided defaults
- empty input falls back to the provided defaults

Suggested command:

```bash
node tests/reading-speaker-query.test.mjs
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `src/lib/reading/speaker-query.js` does not exist yet.

**Step 3: Write minimal implementation**

Create `src/lib/reading/speaker-query.js` with a pure function that accepts:

- raw query value
- valid speaker IDs
- default speaker IDs

and returns the correct selected speaker list.

**Step 4: Run test to verify it passes**

Run:

```bash
node tests/reading-speaker-query.test.mjs
```

Expected: PASS.

### Task 2: Use the helper in the reading route

**Files:**
- Modify: `src/routes/reading/+page.svelte`

**Step 1: Read the query parameter**

Use the current page URL to read `speakers`.

**Step 2: Initialize the filter state from the helper**

Replace the hard-coded `defaultSpeakerIds` initialization path with:

- `defaultSpeakerIds` still representing the full reading speaker list
- `activeSpeakerIds` initialized from the helper using the query value

**Step 3: Keep existing behavior intact**

Ensure:

- direct visits to `/reading` still select all speakers
- invalid preset values do not break the page
- downstream filtering and selected line behavior keep working

**Step 4: Run verification**

Run:

```bash
node tests/reading-speaker-query.test.mjs
pnpm check
```

Expected: both commands PASS.

### Task 3: Update homepage thesis card links

**Files:**
- Modify: `src/routes/+page.svelte`

**Step 1: Add speaker preset URLs**

Update the four thesis card `href` values to:

- `/reading?speakers=phaedrus`
- `/reading?speakers=aristophanes`
- `/reading?speakers=diotima`
- `/reading?speakers=socrates`

**Step 2: Keep the rest of the homepage unchanged**

Do not alter the other homepage entry cards or CTA buttons.

**Step 3: Run verification**

Run:

```bash
node tests/reading-speaker-query.test.mjs
pnpm check
```

Expected: both commands PASS.

### Task 4: Final regression pass

**Files:**
- Modify: `src/routes/+page.svelte`
- Modify: `src/routes/reading/+page.svelte`
- Create: `src/lib/reading/speaker-query.js`
- Create: `tests/reading-speaker-query.test.mjs`

**Step 1: Manual behavior review**

Check:

1. each homepage thesis card selects only its corresponding speaker
2. `/reading` without query params still selects all speakers
3. `/reading?speakers=invalid` falls back to all speakers

**Step 2: Run full verification**

Run:

```bash
node tests/reading-speaker-query.test.mjs
pnpm check
```

Expected: both commands PASS.

**Step 3: Commit**

```bash
git add src/routes/+page.svelte src/routes/reading/+page.svelte src/lib/reading/speaker-query.js tests/reading-speaker-query.test.mjs
git commit -m "feat: preset reading speaker filters from homepage"
```
