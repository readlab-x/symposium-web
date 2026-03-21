# SEO Technical Documentation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a maintainable SEO technical guide under `docs/` that explains the current implementation, deployment behavior, and safe maintenance workflow for this project.

**Architecture:** The work is documentation-only. It will capture the existing centralized SEO pipeline, from route config to layout rendering to prerendered crawl assets and GitHub Pages subpath deployment. The implementation should not change runtime behavior.

**Tech Stack:** Markdown documentation, existing SvelteKit SEO modules, GitHub Pages workflow, Node-based verification commands.

---

### Task 1: Inspect the current SEO implementation

**Files:**
- Review: `src/lib/seo/site-config.js`
- Review: `src/lib/seo/metadata.js`
- Review: `src/routes/+layout.server.ts`
- Review: `src/routes/+layout.svelte`
- Review: `src/routes/robots.txt/+server.ts`
- Review: `src/routes/sitemap.xml/+server.ts`
- Review: `src/app.html`
- Review: `svelte.config.js`
- Review: `.github/workflows/deploy-pages.yml`

**Step 1: Read the configuration source of truth**

Confirm:

- default site URL
- route SEO map
- sitemap inclusion rules
- Open Graph image path

**Step 2: Read the metadata pipeline**

Confirm:

- pathname normalization
- canonical URL generation
- JSON-LD generation
- robots and sitemap helpers

**Step 3: Read the integration points**

Confirm:

- how server load provides `data.seo`
- how root layout renders `<head>`
- how prerendered `robots.txt` and `sitemap.xml` are produced
- how `BASE_PATH` is wired for GitHub Pages

### Task 2: Write the documentation design artifacts

**Files:**
- Create: `docs/plans/2026-03-21-seo-technical-documentation-design.md`
- Create: `docs/plans/2026-03-21-seo-technical-documentation-implementation.md`

**Step 1: Save the design summary**

Write the target document structure, intended audience, and coverage.

**Step 2: Save the implementation plan**

Write the exact documentation tasks, file paths, and verification commands.

### Task 3: Write the SEO technical guide

**Files:**
- Create: `docs/seo-technical-guide.md`

**Step 1: Add project-specific overview**

Explain:

- what SEO currently does in this project
- what this document covers

**Step 2: Add the core architecture section**

Explain:

- `site-config.js` as route-level source of truth
- `metadata.js` as the transformation layer
- `+layout.server.ts` and `+layout.svelte` as integration points

**Step 3: Add crawl asset and deployment sections**

Explain:

- `robots.txt`
- `sitemap.xml`
- `SITE_URL`
- `BASE_PATH`
- GitHub Pages subpath deployment

**Step 4: Add maintenance and verification sections**

Include:

- what to edit for common SEO changes
- exact verification commands
- common pitfalls for this codebase

### Task 4: Verify the documentation against the code

**Files:**
- Review only: `docs/seo-technical-guide.md`

**Step 1: Re-read the generated document**

Check that all referenced files and commands match the repository.

**Step 2: Run relevant verification commands**

Run:

```bash
node tests/seo-metadata.test.mjs
node tests/seo-assets.test.mjs
node tests/github-pages-workflow.test.mjs
pnpm check
```

Expected: PASS.

