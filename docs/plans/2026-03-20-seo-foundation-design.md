# SEO Foundation Design

**Goal:** Add a production-grade SEO layer for the static site so search engines and social crawlers receive stable page metadata, canonical URLs, structured data, and crawl assets without requiring a redesign of the current bilingual UI.

## Current Problems

- The site currently only outputs a document title.
- There is no route-level `description`, `canonical`, Open Graph, Twitter card, or structured data output.
- `robots.txt` is static and does not point at a sitemap.
- There is no sitemap.
- The `<html lang>` value is fixed to `en` even though the default rendered content is Chinese.
- Current metadata is coupled to client-side language preferences, which is not a stable SEO strategy for a prerendered static site.

## Constraints

- Keep the current in-app bilingual toggle as-is.
- Do not introduce `/en` route duplication or `hreflang` in this pass.
- Use a configurable `SITE_URL` with a default fallback of `https://github.6iedog.com/huiyin-symposium`.
- Use mixed bilingual SEO copy instead of runtime language-dependent metadata.
- Preserve static prerendering with `@sveltejs/adapter-static`.

## Recommended Approach

Build a centralized SEO layer that computes route metadata on the server during prerender, then render all SEO tags from the root layout. This keeps SEO deterministic, avoids route-by-route duplication, and gives one place to adjust titles, descriptions, canonical URLs, share images, and indexing rules.

This approach is better than page-local hand-authored tags because the site already has a small, finite route set and a consistent information architecture. It is also much lower risk than introducing separate language routes purely for SEO.

## Metadata Strategy

### 1. Site URL and canonical strategy

- Read `SITE_URL` from the environment at build time.
- Fall back to `https://github.6iedog.com/huiyin-symposium` if the variable is missing.
- Normalize the base URL and join it with route pathnames.
- Strip query parameters and fragments from canonical URLs.

### 2. Language strategy

- Set static `<html lang="zh-CN">` in `src/app.html`.
- Generate SEO titles and descriptions as bilingual mixed strings.
- Keep the current user-facing document language switching untouched for content rendering.

### 3. Indexing strategy

- `index,follow`: `/`, `/reading`, `/characters`, `/themes`, `/relations`
- `noindex,follow`: `/search`

This keeps utility search UI available to users without encouraging search engines to index thin result pages.

### 4. Structured data

- Global `WebSite` schema for the site as a whole.
- Route-level `WebPage` schema for all pages.
- `CollectionPage` subtype for `/characters`, `/themes`, and `/relations`.
- Homepage `about` field should explicitly point to Plato's *Symposium* as the central subject.
- Do not add `SearchAction` yet because the current search experience is not URL-addressable.

### 5. Social metadata

- Output `og:title`, `og:description`, `og:url`, `og:type`, `og:site_name`, and `og:image`.
- Output `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image`.
- Reuse an existing brand asset for now rather than building a separate OG image pipeline.

## Route Copy Direction

Keep titles compact and descriptive. Use Chinese first, then English:

- `/`: `会饮研读台 | Symposium Reading Desk`
- `/reading`: `原文阅读台 | Original Text Reading`
- `/characters`: `人物索引 | Character Index`
- `/themes`: `观点主题地图 | Theme Map`
- `/relations`: `人物关系图 | Relation Graph`
- `/search`: `全文搜索 | Full-text Search`

Descriptions should be one sentence, mixed bilingual, and under control in length. They should describe the scholarly purpose of the page rather than generic product marketing.

## Files to Introduce or Modify

- Modify: `src/app.html`
- Modify: `src/routes/+layout.svelte`
- Modify: `src/routes/+layout.ts`
- Create: `src/routes/+layout.server.ts`
- Create: `src/lib/seo/site-config.ts` or `.js`
- Create: `src/lib/seo/metadata.ts` or `.js`
- Create: `src/routes/robots.txt/+server.ts`
- Create: `src/routes/sitemap.xml/+server.ts`
- Modify or deprecate: `src/lib/seo/page-title.js`
- Delete: `static/robots.txt`
- Create tests for metadata helpers and generated crawl assets

## Verification

- Unit tests for SEO metadata generation
- Unit tests for sitemap and robots output helpers
- Existing `page-title` test updated or replaced depending on whether title logic moves
- `pnpm check`

## Out of Scope

- `/en` route tree
- `hreflang`
- dynamic Open Graph image rendering
- URL-based search state
