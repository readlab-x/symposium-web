# Reading Annotation Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand the reading desk annotation dataset into a heavier, more varied commentary layer while preserving the existing annotation UI and bilingual coverage guarantees.

**Architecture:** Keep the implementation at the data layer by extending `src/lib/data/annotations.json` and the corresponding English mappings in `src/lib/data/content-i18n.js`. Use web research to synthesize concise notes across historical, philosophical, rhetorical, translational, and intertextual dimensions, then verify the dataset with the existing `content-i18n` regression test and full Svelte type-checking.

**Tech Stack:** JSON content data, JavaScript i18n mapping module, Node assert tests, SvelteKit data consumption through existing stores and components, verification via `node tests/content-i18n.test.mjs` and `pnpm check`.

---

### Task 1: Write the failing regression by expanding annotation data first

**Files:**
- Modify: `src/lib/data/annotations.json`
- Test: `tests/content-i18n.test.mjs`

**Step 1: Add a first batch of new annotations without English mappings**

Add a substantial batch of new annotation entries in `src/lib/data/annotations.json` that:

- spread across the dialogue
- use existing annotation types
- introduce new tags only when needed

**Step 2: Run test to verify it fails**

Run:

```bash
node tests/content-i18n.test.mjs
```

Expected: FAIL because the new annotation IDs and tags do not yet have English mappings.

**Step 3: Review the failure output**

Use the missing IDs and tags from the failure output as the checklist for the next task.

### Task 2: Add English mappings for the new annotations and tags

**Files:**
- Modify: `src/lib/data/content-i18n.js`
- Test: `tests/content-i18n.test.mjs`

**Step 1: Add annotation English entries**

Extend `annotationEnglishById` with title and content for every new annotation ID.

**Step 2: Add tag translations**

Extend `tagEnglishBySource` so every new Chinese tag used in the new notes has a non-identical English translation.

**Step 3: Run the regression test**

Run:

```bash
node tests/content-i18n.test.mjs
```

Expected: PASS.

### Task 3: Expand coverage to the full target spread

**Files:**
- Modify: `src/lib/data/annotations.json`
- Modify: `src/lib/data/content-i18n.js`

**Step 1: Fill the major gaps**

Continue adding annotations until coverage is meaningfully broader across:

- opening frame
- banquet rules
- early speeches
- Agathon / Socratic turn
- Diotima
- Alcibiades
- ending

**Step 2: Keep note variety balanced**

Ensure the final set includes a healthy mix of:

- background
- term
- translation
- cross-reference

**Step 3: Keep note size under control**

Prefer compact notes suitable for the sidebar rather than mini-essays.

**Step 4: Re-run the regression**

Run:

```bash
node tests/content-i18n.test.mjs
```

Expected: PASS.

### Task 4: Final verification

**Files:**
- Modify: `src/lib/data/annotations.json`
- Modify: `src/lib/data/content-i18n.js`
- Create: `docs/plans/2026-03-20-reading-annotation-expansion-design.md`
- Create: `docs/plans/2026-03-20-reading-annotation-expansion-implementation.md`

**Step 1: Run final verification**

Run:

```bash
node tests/content-i18n.test.mjs
pnpm check
```

Expected: both commands PASS.

**Step 2: Manual review**

Check that the annotation panel now feels substantially denser across the reading flow and that no new note is disproportionately long or off-tone.

**Step 3: Commit**

```bash
git add src/lib/data/annotations.json src/lib/data/content-i18n.js docs/plans/2026-03-20-reading-annotation-expansion-design.md docs/plans/2026-03-20-reading-annotation-expansion-implementation.md
git commit -m "feat: expand reading annotations"
```
