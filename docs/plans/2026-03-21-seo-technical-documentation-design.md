# SEO Technical Documentation Design

**Goal:** Create a single SEO technical document under `docs/` that explains how SEO currently works in this project and how to maintain it safely.

## Audience

- The primary reader is the project maintainer.
- The document should assume the reader understands the project at a high level, but not the current SEO implementation details.
- The document should help with both orientation and future edits.

## Recommended Format

Use one complete document instead of splitting SEO into several pages.

Why:

- The SEO system is centralized and small enough to explain in one place.
- The maintainer asked to better understand the current project SEO rather than to build a large documentation tree.
- A single document reduces navigation overhead and is easier to keep in sync with the codebase.

## Proposed File

- Create: `docs/seo-technical-guide.md`

## Document Structure

### 1. Purpose and scope

Explain what the document covers:

- current SEO architecture
- metadata generation
- crawl assets
- GitHub Pages subpath behavior
- maintenance entry points
- verification workflow

### 2. SEO goals in this project

Summarize the current strategic choices:

- static prerendered SEO
- bilingual mixed metadata instead of route-level language duplication
- stable canonical URLs
- explicit indexing policy

### 3. Core file map

List the files that make up the SEO pipeline:

- `src/lib/seo/site-config.js`
- `src/lib/seo/metadata.js`
- `src/routes/+layout.server.ts`
- `src/routes/+layout.svelte`
- `src/routes/robots.txt/+server.ts`
- `src/routes/sitemap.xml/+server.ts`
- `src/app.html`
- `svelte.config.js`
- `.github/workflows/deploy-pages.yml`

### 4. Metadata generation flow

Walk through the runtime sequence:

1. server load reads `SITE_URL` and `BASE_PATH`
2. pathname is normalized and stripped of base path
3. route metadata is selected from `ROUTE_SEO`
4. canonical/Open Graph/Twitter/JSON-LD are generated
5. root layout renders all head tags

### 5. Indexing and sitemap rules

Document:

- which routes are `index,follow`
- why `/search` is `noindex,follow`
- why `/search` is excluded from sitemap

### 6. GitHub Pages deployment behavior

Explain the interaction between:

- `SITE_URL`
- `BASE_PATH`
- `kit.paths.base`
- path stripping for SEO lookup

### 7. How to modify SEO safely

Provide concrete maintenance guidance:

- adding a route to `ROUTE_SEO`
- changing canonical host or subpath
- changing OG image
- changing indexing policy

### 8. Verification checklist

Include exact commands already used in the repo:

- `node tests/seo-metadata.test.mjs`
- `node tests/seo-assets.test.mjs`
- `node tests/github-pages-workflow.test.mjs`
- `pnpm check`
- `BASE_PATH=/symposium-web SITE_URL=https://github.6iedog.com/symposium-web pnpm build`

## Writing Direction

- Write in Chinese because the maintainer communicates in Chinese.
- Keep file paths and environment variable names exact.
- Prefer concrete explanations of this codebase over general SEO theory.
- Keep tone practical and maintenance-oriented.

