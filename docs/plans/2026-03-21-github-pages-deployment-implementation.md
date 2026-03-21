# GitHub Pages Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a GitHub Pages deployment workflow and make the static SvelteKit site work correctly when hosted under `/symposium-web`.

**Architecture:** Introduce a small pure base-path helper layer, wire SvelteKit to read `BASE_PATH`, update route and asset references to use base-aware URLs, and add a GitHub Actions workflow that builds and deploys `build/` with both `SITE_URL` and `BASE_PATH` configured.

**Tech Stack:** SvelteKit static adapter, GitHub Actions Pages deployment, Node assert tests, small JS helper modules.

---

### Task 1: Write failing tests for base-path behavior and workflow presence

**Files:**
- Create: `tests/base-paths.test.mjs`
- Create: `tests/github-pages-workflow.test.mjs`

**Step 1: Write the failing base-path helper test**

Add assertions for:

- empty base path stays empty
- `/symposium-web` stays normalized
- joining `/symposium-web` with `/reading` yields `/symposium-web/reading`
- joining with `/branding/logo-mark.png` yields `/symposium-web/branding/logo-mark.png`
- stripping `/symposium-web` from `/symposium-web/reading` yields `/reading`

**Step 2: Write the failing workflow/config test**

Add assertions for:

- `.github/workflows/deploy-pages.yml` exists
- workflow references `SITE_URL`
- workflow references `BASE_PATH`
- workflow uploads the `build` artifact
- `svelte.config.js` reads `BASE_PATH`

**Step 3: Run the tests and verify they fail**

Run:

```bash
node tests/base-paths.test.mjs
node tests/github-pages-workflow.test.mjs
```

Expected: FAIL because the helper module and workflow do not exist yet.

### Task 2: Add base-path helper modules

**Files:**
- Create: `src/lib/paths/base-paths.js`
- Create: `src/lib/paths/runtime-paths.js`

**Step 1: Implement the pure helper**

Add functions to:

- normalize a raw base path
- join a base path to an internal route or asset path
- strip a base path from an incoming pathname

Keep external URLs, hash links, and empty inputs safe.

**Step 2: Implement the runtime wrapper**

Wrap the pure helper using `$app/paths.base` so Svelte components can call a single helper for route and asset URLs.

**Step 3: Run the new helper test**

Run:

```bash
node tests/base-paths.test.mjs
```

Expected: PASS.

### Task 3: Wire SvelteKit and SEO to the base path

**Files:**
- Modify: `svelte.config.js`
- Modify: `src/routes/+layout.server.ts`

**Step 1: Add `BASE_PATH` support to SvelteKit**

Read `process.env.BASE_PATH` and set `kit.paths.base`.

**Step 2: Keep SEO route resolution base-aware**

Strip the configured base path from `url.pathname` before passing it into the SEO metadata resolver.

**Step 3: Run targeted verification**

Run:

```bash
node tests/base-paths.test.mjs
node tests/seo-metadata.test.mjs
```

Expected: PASS.

### Task 4: Convert internal links and assets to base-aware URLs

**Files:**
- Modify: `src/lib/components/site-shell.svelte`
- Modify: `src/routes/+layout.svelte`
- Modify: `src/routes/+page.svelte`
- Modify: `src/routes/characters/+page.svelte`
- Modify: `src/routes/themes/+page.svelte`
- Modify: `src/routes/search/+page.svelte`
- Modify: `src/lib/components/reading/dialogue-line.svelte`
- Modify: `src/lib/components/reading/annotated-text.svelte`
- Modify: `src/lib/components/reading/speaker-filter.svelte`
- Modify: `src/routes/relations/+page.svelte`
- Modify: `src/routes/reading/+page.svelte`
- Modify: `tests/branding-assets.test.mjs`

**Step 1: Replace route hrefs**

Use the runtime base-path helper for:

- top navigation
- homepage CTA and entry cards
- reading deep links from characters/themes/search

**Step 2: Replace static asset references**

Use the runtime helper for:

- favicon
- logo mark
- character avatar image URLs before rendering
- relation graph avatar image URLs before rendering

**Step 3: Update any source-based tests**

Adjust branding/layout tests so they verify helper usage or effective asset path composition instead of hardcoded root-path strings.

**Step 4: Run the affected tests**

Run:

```bash
node tests/base-paths.test.mjs
node tests/branding-assets.test.mjs
node tests/reading-speaker-query.test.mjs
```

Expected: PASS.

### Task 5: Add the GitHub Pages workflow

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

**Step 1: Add the workflow**

Use the GitHub Pages official actions to:

- configure Pages
- build on Ubuntu
- run `npm ci`
- run `npm run check`
- run `npm run build`
- pass `SITE_URL=https://github.6iedog.com/symposium-web`
- pass `BASE_PATH=/symposium-web`
- upload `build/`
- deploy the uploaded artifact

**Step 2: Run the workflow/config test**

Run:

```bash
node tests/github-pages-workflow.test.mjs
```

Expected: PASS.

### Task 6: Final verification

**Files:**
- Review only: all modified files from prior tasks

**Step 1: Run full verification**

Run:

```bash
node tests/page-title.test.mjs
node tests/seo-metadata.test.mjs
node tests/seo-assets.test.mjs
node tests/base-paths.test.mjs
node tests/github-pages-workflow.test.mjs
node tests/branding-assets.test.mjs
pnpm check
BASE_PATH=/symposium-web SITE_URL=https://github.6iedog.com/symposium-web pnpm build
```

Expected: PASS.

**Step 2: Commit**

```bash
git add .github/workflows/deploy-pages.yml svelte.config.js src/lib/paths/base-paths.js src/lib/paths/runtime-paths.js src/routes/+layout.server.ts src/routes/+layout.svelte src/routes/+page.svelte src/routes/characters/+page.svelte src/routes/themes/+page.svelte src/routes/search/+page.svelte src/routes/relations/+page.svelte src/routes/reading/+page.svelte src/lib/components/site-shell.svelte src/lib/components/reading/dialogue-line.svelte src/lib/components/reading/annotated-text.svelte src/lib/components/reading/speaker-filter.svelte tests/base-paths.test.mjs tests/github-pages-workflow.test.mjs tests/branding-assets.test.mjs docs/plans/2026-03-21-github-pages-deployment-design.md docs/plans/2026-03-21-github-pages-deployment-implementation.md
git commit -m "feat: add github pages deployment flow"
```
