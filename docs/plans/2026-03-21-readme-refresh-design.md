# README Refresh Design

**Goal:** Rewrite the root README so it works as a clear public-facing project entry, while moving deeper technical detail into `docs/`.

## Why this refresh is needed

The existing README is outdated in several ways:

- it still uses the old project naming
- its technical information is mixed with product description
- it reflects earlier asset paths and older implementation assumptions
- it does not point readers into the growing `docs/` directory

## Recommended direction

Use a showcase-style README plus a docs index.

### Root README responsibilities

- explain what the project is
- show the live URL
- summarize core capabilities
- provide quick start commands
- point to technical documentation

### docs responsibilities

- hold maintainable technical explanations
- act as a landing area for deeper documentation
- keep historical design and implementation plans discoverable

## Files

- Rewrite: `README.md`
- Create: `docs/README.md`

## Content structure

### `README.md`

- project title
- one-paragraph description
- live site URL
- feature summary
- technical stack summary
- quick start
- important directories
- document entry links

### `docs/README.md`

- docs overview
- SEO technical guide entry
- plans directory entry
- prompts directory entry
- sources directory entry

## Writing direction

- primary language: Chinese
- concise, product-facing, and readable
- technical details should link outward rather than dominate the homepage README

