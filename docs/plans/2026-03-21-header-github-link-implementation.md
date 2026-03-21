# Header GitHub Link Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an external GitHub icon link to the site header, positioned to the right of the theme toggle.

**Architecture:** This is a small UI change inside the shared site shell. A source-based regression test will first assert that the shared header contains the expected repository URL and external-link behavior, then `site-shell.svelte` will be updated to render a new anchor styled consistently with the existing header controls.

**Tech Stack:** Svelte 5, `@lucide/svelte`, Node assert source-based tests.

---

### Task 1: Add a failing source-based test

**Files:**
- Modify: `tests/branding-assets.test.mjs`

**Step 1: Add assertions for the GitHub header link**

Assert that `src/lib/components/site-shell.svelte` contains:

- the repository URL
- `target="_blank"`
- `rel="noreferrer"`

**Step 2: Run the test to verify it fails**

Run:

```bash
node tests/branding-assets.test.mjs
```

Expected: FAIL because the GitHub header link does not exist yet.

### Task 2: Implement the header link

**Files:**
- Modify: `src/lib/components/site-shell.svelte`

**Step 1: Add the GitHub icon import**

Import the Lucide GitHub icon in the shared site shell.

**Step 2: Add localized accessible copy**

Add a short string for the anchor `title` and `aria-label`.

**Step 3: Render the link**

Add the external anchor to the right of the theme button, keeping the same visual control treatment.

### Task 3: Verify

**Files:**
- Review only: `src/lib/components/site-shell.svelte`
- Review only: `tests/branding-assets.test.mjs`

**Step 1: Re-run the updated test**

Run:

```bash
node tests/branding-assets.test.mjs
```

Expected: PASS.

