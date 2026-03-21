# GitHub Pages Deployment Design

**Goal:** Add a repeatable GitHub Pages deployment flow for the static SvelteKit site, with correct support for hosting under the subpath `https://github.6iedog.com/symposium-web`.

## Context

The site already uses `@sveltejs/adapter-static`, prerendered routes, and a configurable `SITE_URL` for SEO. However, the app still contains many root-absolute links and asset URLs such as `/reading` and `/branding/logo-mark.png`. That is acceptable when the site is deployed at domain root, but it breaks when the app is served from a subpath.

There is currently no `.github/workflows` deployment pipeline in the repository.

## Recommended Approach

Use a complete GitHub Pages deployment setup with three coordinated parts:

1. Add a GitHub Actions workflow that installs dependencies, runs validation, builds the site, uploads the `build/` artifact, and deploys it to Pages.
2. Add `BASE_PATH` support to SvelteKit so the generated site can live under `/symposium-web`.
3. Replace root-absolute internal links and static asset references with base-aware helpers so routes, images, favicon, and character avatars still resolve after deployment.

## Why This Approach

This is the only option that makes the deployment operational rather than nominal.

- Workflow alone only proves the project can build.
- `paths.base` alone is not enough if app code still hardcodes `/reading`, `/characters`, `/branding/...`, or `/avatars/...`.
- A base-aware path layer keeps future path changes localized and makes the current `SITE_URL` strategy align with actual deployment behavior.

## Scope

### In Scope

- GitHub Pages workflow under `.github/workflows/`
- SvelteKit `paths.base` configuration from `BASE_PATH`
- Base-aware helpers for route paths and asset paths
- Updating page/components that currently use root-absolute internal links or static asset URLs
- Minor SEO-path integration so route metadata still resolves correctly when requests arrive with the base path
- Tests covering path helper behavior and workflow presence/configuration

### Out of Scope

- Rewriting all content URLs in data JSON
- Changing the SEO copy strategy
- Introducing a worktree-based flow
- Changing hosting platform away from GitHub Pages

## Architecture

### Build-Time Configuration

- `SITE_URL` remains the canonical origin plus subpath, e.g. `https://github.6iedog.com/symposium-web`
- `BASE_PATH` becomes `/symposium-web`
- `svelte.config.js` reads `BASE_PATH` and sets `kit.paths.base`

### Runtime Path Layer

Introduce a small path utility layer:

- one pure helper module for path normalization/prefixing/stripping that is testable in Node
- one runtime wrapper that reads SvelteKit’s `$app/paths.base`

This keeps the deployment logic centralized instead of scattering string concatenation across components.

### SEO Integration

Because requests under a base path will reach the root server load as `/symposium-web/...`, the SEO metadata resolver must strip the configured base path before mapping to route metadata. Canonical URLs should still be generated from `SITE_URL`.

## GitHub Pages Workflow

The workflow should:

- trigger on pushes to `master`
- allow manual dispatch
- grant Pages/OIDC permissions
- run `npm ci`
- run `npm run check`
- run `npm run build` with `SITE_URL` and `BASE_PATH`
- upload `build/`
- deploy with official Pages actions

## Validation

Before calling this complete, verify:

- base-path helper tests pass
- workflow/config tests pass
- existing test suite still passes
- `pnpm build` still succeeds with `BASE_PATH=/symposium-web`
- generated output still contains `robots.txt` and `sitemap.xml`

## Notes

The user has previously asked not to use git worktrees. This design intentionally stays in the current workspace and keeps deployment support self-contained.
