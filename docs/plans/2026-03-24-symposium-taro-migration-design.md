# Symposium Taro Migration Design

**Goal:** Create a new `symposium` Taro application beside `symposium-web`, with a shared `symposium-content` data repository, so the project can ship as a real multi-end product across H5 and mini-program platforms.

## Context

The current `symposium-web` project is a static SvelteKit reading site with five core surfaces:

1. `reading`
2. `characters`
3. `themes`
4. `relations`
5. `search`

It already contains well-structured content data for dialogue lines, characters, themes, relations, annotations, places, branding, and bilingual display helpers. That makes the content highly portable, but the presentation layer is tightly coupled to Svelte components and browser-centric interactions.

The target is not a webview shell. The new `symposium` project should be a true Taro application that can build for at least:

- H5
- WeChat Mini Program

It should also preserve room for additional mini-program targets later.

## User Decisions Confirmed

The design reflects these confirmed choices:

- Build a true Taro version rather than a thin H5 wrapper
- Keep the full information architecture, including `relations`
- Support multi-end output, with H5 and WeChat Mini Program first
- Introduce a separate shared content repository
- Keep `symposium-web` and `symposium` as independent app repositories
- Share content and static assets, but not page or UI implementation code

## Recommended Approach

Use three coordinated repositories:

```text
D:\Repository\6iedog\
  symposium-content\
  symposium-web\
  symposium\
```

### Repository Roles

#### `symposium-content`

This repository becomes the single source of truth for portable content:

- dialogue data
- character data
- theme data
- relation graph data
- annotations
- places
- bilingual content maps
- avatars
- branding assets
- schema and validation scripts

It should build a normalized `dist/` output that app repositories can sync locally before development or release.

#### `symposium-web`

This remains the SvelteKit website. It should keep its current deployment and SEO responsibilities, but switch from manually owned content files to synced content artifacts from `symposium-content`.

#### `symposium`

This becomes the new Taro multi-end application. It should consume synced local content artifacts rather than importing cross-repository code at runtime. That keeps mini-program builds stable and avoids coupling app packaging to external repository structure.

## Why This Approach

This is the best fit for the current constraints.

- It preserves a real multi-end app architecture instead of falling back to webview-heavy delivery.
- It avoids duplicating content maintenance across web and Taro codebases.
- It keeps platform-specific UI work isolated inside each app.
- It reduces build and release risk because both apps consume local synced artifacts.
- It creates a clean path for later platform additions without rewriting the content model again.

Alternative approaches were considered but rejected:

1. Taro plus webview for complex pages:
   Fast for a first pass, but creates a split product and weakens the mini-program experience.
2. Package-based shared data dependency:
   Neater versioning in theory, but introduces more friction for assets, path handling, and mini-program packaging.
3. Keep everything separate:
   Simpler short-term, but duplicates content maintenance immediately.

## Scope

### In Scope

- New `symposium-content` repository
- New `symposium` Taro application
- Content sync scripts for `symposium-web` and `symposium`
- Shared content schema and validation flow
- Taro pages for `home`, `reading`, `characters`, `themes`, `relations`, and `search`
- H5 and WeChat Mini Program build targets
- Platform-aware handling for i18n, content navigation, assets, and relation graph rendering

### Out of Scope

- Full visual parity with the current Svelte homepage motion design
- Sharing Svelte and React component code
- Backend search service
- SEO parity inside mini-programs
- Full native external-link behavior across all mini-program platforms
- Direct G6 reuse inside mini-program builds unless official support proves stable enough later

## Architecture

### Content Repository Structure

Recommended structure:

```text
symposium-content/
  package.json
  README.md
  src/
    data/
      dialogs.json
      characters.json
      themes.json
      relations.json
      annotations.json
      places.json
      content-i18n.json
      reading-i18n.json
    assets/
      avatars/characters/*
      branding/*
  schema/
  scripts/
    validate.mjs
    build.mjs
  dist/
    data/*
    assets/*
    manifest.json
```

### Taro Application Structure

Recommended structure:

```text
symposium/
  package.json
  config/
    index.ts
    dev.ts
    prod.ts
  scripts/
    sync-content.mjs
  src/
    app.ts
    app.config.ts
    app.scss
    data/
    assets/
    components/
    features/
      home/
      reading/
      characters/
      themes/
      relations/
      search/
    pages/
      home/
      reading/
      characters/
      themes/
      relations/
      search/
    stores/
    platform/
    utils/
```

### Layering Rules

- `src/data`: synced content and normalized static indexes
- `src/features/*`: business logic, derived selectors, and feature-specific view models
- `src/pages/*`: page composition and Taro interaction logic
- `src/platform/*`: platform-specific differences such as asset paths, mini-program sharing, and relation graph renderer selection
- `src/components/*`: reusable presentation components that remain platform-safe

This keeps platform concerns separate from content and preserves the ability to reuse business logic across H5 and mini-program outputs.

## Page Mapping

### `home`

Keep the existing homepage role as a guided entry point into the work:

- hero section
- main call to action into reading
- four major thematic or speaker entry points
- additional navigation cards into the five core experiences

The Taro version should preserve the hierarchy and language, but simplify decorative motion and heavy visual layering so mini-program first paint remains stable.

### `reading`

This remains the primary reading surface.

Preserve:

- dialogue sequence reading
- speaker filter
- scene or chapter filter
- selected line state
- annotation details
- bilingual display preferences

Platform adaptation:

- H5 can use a two-column layout similar to the current site
- mini-program should use stacked layout with a bottom sheet or drawer detail panel instead of a fixed side panel

### `characters`

This page can be migrated almost directly:

- avatar
- role
- bio
- in-text summary
- speech count
- first appearance jump
- external reference links

External reference behavior should be platform-gated when direct navigation is restricted.

### `themes`

Keep the theme card model:

- theme title
- theme summary
- related characters
- supporting lines
- jump into reading context

Mini-program should prefer expandable cards to avoid excessive first-load rendering.

### `search`

Keep client-side search over synced static content:

- dialogue text
- speaker names
- tags

The first release should avoid a backend dependency. Add debounce and result capping so mini-program rendering stays stable.

### `relations`

This page requires the strongest platform split.

The existing relation data already contains fixed node coordinates. That is valuable and should be preserved because it allows the first Taro release to avoid expensive runtime layout computation.

## Relations Strategy

### H5 Renderer

Use G6 for the H5 build:

- pan and zoom
- node selection
- relation highlighting
- side detail panel

This keeps the H5 experience close to the current web implementation.

### Mini-Program Renderer

Do not assume G6 can be used directly inside Taro mini-program targets.

The recommended first release uses a custom lightweight canvas renderer built on Taro canvas support:

- fixed node positions from content data
- node tap selection
- selected edge highlighting
- panning
- basic zoom or zoom button controls
- detail card under the canvas

This keeps the page genuinely graphical rather than collapsing it into a plain list, while staying within a more controllable implementation boundary.

### Technical Basis

This recommendation is based on the current official documentation boundary:

- Taro officially supports multi-end application output and canvas capability
- G6 officially documents browser-oriented graph configuration and rendering
- no confirmed official route was found for directly running G6 as a stable Taro mini-program graph layer

That means a dual-renderer approach is the safer architectural choice for now.

## Data Flow

The intended flow is:

```text
content source
  -> validate
  -> build dist
  -> app sync
  -> local app data
  -> feature model
  -> page render
```

More concretely:

```text
symposium-content/scripts/build.mjs
  -> symposium-content/dist
  -> symposium/scripts/sync-content.mjs
  -> symposium/src/data + symposium/src/assets
  -> selectors and feature models
  -> Taro pages
```

The same pattern should later be applied to `symposium-web`.

## i18n Strategy

The current project already separates:

- base Chinese content
- English content maps
- language preference state
- display helper functions

That structure should move into `symposium-content` and then be adapted inside `symposium` as framework-agnostic utilities plus a Taro-friendly preference store.

Recommended behavior:

- primary language selection persists locally
- translation visibility persists locally
- H5 may keep richer URL-driven state when useful
- mini-program should rely on page params and local storage instead of browser URL semantics

## Platform-Specific Downgrades

Explicitly accept these differences in the first release:

1. External links:
   H5 opens them normally. Mini-program may show a gated action, copy flow, or H5 prompt instead.
2. Hover UI:
   Replace tooltip and hover interactions with tap and panel patterns.
3. URL semantics:
   Keep query and anchor behavior on H5; map to local page state on mini-program.
4. Heavy motion:
   Reduce visual effects on mini-program in favor of performance and stability.
5. Layout density:
   Use compact card and drawer patterns where the desktop site currently assumes wider persistent space.

## Error Handling

### Content-Level Safety

The content build should fail fast when:

- referenced line IDs do not exist
- relation edges point to missing nodes
- characters reference missing first appearance lines
- theme or annotation references are broken
- required image assets are missing

### App-Level Safety

The Taro app should degrade safely when:

- optional translations are missing
- optional images are missing
- external links are unavailable on a platform
- relation renderer fails to initialize on a device

Fallback expectations:

- use original-language content when translations are unavailable
- use avatar fallback initials when images fail
- render relation details as text list if canvas initialization fails

## Testing Strategy

### `symposium-content`

Add validation tests for:

- schema shape
- referential integrity
- image asset presence
- i18n map consistency

### `symposium`

Prioritize tests for pure logic first:

- display language selection
- reading filters
- search matching
- relation graph derived state
- asset path helpers
- platform branching logic

Then add focused page-level verification for:

- home render
- reading selection and filters
- theme-to-reading navigation
- search result rendering
- relation node selection and details

### Release Verification

Before claiming the first migration slice is complete, verify:

- H5 build succeeds
- WeChat Mini Program build succeeds
- synced content is current
- bilingual switching works
- core assets load
- relation graph selection works on both renderers

## Implementation Sequence

Recommended implementation order:

1. create `symposium-content`
2. move and normalize content assets into it
3. add validation and build scripts
4. add content sync script to `symposium-web`
5. scaffold `symposium` with Taro React TypeScript
6. add content sync script to `symposium`
7. build shared data access and i18n utilities in `symposium`
8. implement `home`, `reading`, `characters`, `themes`, `search`
9. implement H5 `relations` with G6
10. implement mini-program `relations` canvas renderer
11. run H5 and mini-program verification

## Risks

### Highest Risk

- mini-program relation graph performance and interaction quality
- path and asset handling across Taro targets
- maintaining content schema stability while two apps consume it

### Mitigations

- use fixed node coordinates first
- keep content sync file structure explicit and testable
- keep renderer-specific code isolated
- avoid introducing unnecessary runtime dependencies in the first release

## Success Criteria

The migration is successful when:

- `symposium-content` is the shared source of truth for content
- `symposium` builds for H5 and WeChat Mini Program
- the Taro app includes all five major content surfaces
- `relations` remains a graph experience on both H5 and mini-program
- `symposium-web` can later sync content from the shared repository without losing app independence
