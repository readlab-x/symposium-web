# SEO Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add centralized SEO metadata, structured data, canonical handling, and crawl assets for the prerendered site while keeping the existing bilingual UI and static deployment model intact.

**Architecture:** Route-aware SEO data will be computed in a root server load from a shared metadata helper. The root layout will render all `<head>` tags from this server-generated metadata, while `robots.txt` and `sitemap.xml` will be emitted from dedicated prerendered endpoints using the same `SITE_URL` source of truth.

**Tech Stack:** SvelteKit root layout and server load, static prerendering via `@sveltejs/adapter-static`, plain Node assert tests, shared SEO helper modules, route endpoints for crawl assets.

---

### Task 1: Write failing SEO metadata tests

**Files:**
- Create: `tests/seo-metadata.test.mjs`
- Create: `tests/seo-assets.test.mjs`
- Review: `tests/page-title.test.mjs`

**Step 1: Write failing tests for route metadata**

Add tests that assert:

- the homepage title is bilingual and stable
- reading page metadata contains a canonical URL without query params
- search page metadata emits `noindex,follow`
- homepage JSON-LD contains `WebSite`
- characters page JSON-LD uses `CollectionPage`

**Step 2: Write failing tests for crawl assets**

Add tests that assert:

- `robots.txt` includes `User-agent`, `Disallow`, and `Sitemap`
- `sitemap.xml` includes every public route
- `sitemap.xml` uses the configured base site URL

**Step 3: Run the failing tests**

Run:

```bash
node tests/seo-metadata.test.mjs
node tests/seo-assets.test.mjs
```

Expected: FAIL because the helper modules do not yet exist.

### Task 2: Create centralized SEO config and helpers

**Files:**
- Create: `src/lib/seo/site-config.js`
- Create: `src/lib/seo/metadata.js`
- Modify: `src/lib/seo/page-title.js`

**Step 1: Add site configuration**

Create a central config module that defines:

- default site URL fallback
- route list for SEO
- default image path
- mixed bilingual titles and descriptions

**Step 2: Add metadata helper functions**

Create helpers that:

- normalize the base URL
- build canonical URLs
- return per-route SEO metadata
- build JSON-LD payloads
- build robots text
- build sitemap XML

**Step 3: Run the tests**

Run:

```bash
node tests/seo-metadata.test.mjs
node tests/seo-assets.test.mjs
```

Expected: PASS.

### Task 3: Wire SEO into the root layout

**Files:**
- Modify: `src/routes/+layout.svelte`
- Modify: `src/routes/+layout.ts`
- Create: `src/routes/+layout.server.ts`
- Modify: `src/app.html`

**Step 1: Load SEO metadata on the server**

Add a root server load that:

- reads `SITE_URL`
- computes route metadata from the current pathname
- returns the SEO object to the root layout

**Step 2: Render head tags from the root layout**

Render:

- title
- meta description
- robots
- canonical
- Open Graph tags
- Twitter tags
- JSON-LD script

**Step 3: Fix root HTML language**

Change `src/app.html` to use `zh-CN` as the default static `lang`.

**Step 4: Run verification**

Run:

```bash
node tests/seo-metadata.test.mjs
pnpm check
```

Expected: PASS.

### Task 4: Generate sitemap and robots from endpoints

**Files:**
- Create: `src/routes/robots.txt/+server.ts`
- Create: `src/routes/sitemap.xml/+server.ts`
- Delete: `static/robots.txt`

**Step 1: Implement prerendered SEO asset endpoints**

Generate content from the shared helpers so the endpoints use the same metadata source of truth.

**Step 2: Ensure routes are prerendered**

Use route-level prerender exports and any required route entries so both files are emitted in the static output.

**Step 3: Run verification**

Run:

```bash
node tests/seo-assets.test.mjs
pnpm check
```

Expected: PASS.

### Task 5: Final verification and commit

**Files:**
- Modify: `src/app.html`
- Modify: `src/routes/+layout.svelte`
- Modify: `src/routes/+layout.ts`
- Create: `src/routes/+layout.server.ts`
- Create: `src/lib/seo/site-config.js`
- Create: `src/lib/seo/metadata.js`
- Modify: `src/lib/seo/page-title.js`
- Create: `src/routes/robots.txt/+server.ts`
- Create: `src/routes/sitemap.xml/+server.ts`
- Delete: `static/robots.txt`
- Create: `tests/seo-metadata.test.mjs`
- Create: `tests/seo-assets.test.mjs`

**Step 1: Run final verification**

Run:

```bash
node tests/page-title.test.mjs
node tests/seo-metadata.test.mjs
node tests/seo-assets.test.mjs
pnpm check
```

Expected: all commands PASS.

**Step 2: Commit**

```bash
git add src/app.html src/routes/+layout.svelte src/routes/+layout.ts src/routes/+layout.server.ts src/lib/seo/site-config.js src/lib/seo/metadata.js src/lib/seo/page-title.js src/routes/robots.txt/+server.ts src/routes/sitemap.xml/+server.ts tests/page-title.test.mjs tests/seo-metadata.test.mjs tests/seo-assets.test.mjs docs/plans/2026-03-20-seo-foundation-design.md docs/plans/2026-03-20-seo-foundation-implementation.md
git commit -m "feat: add foundational site seo"
```
