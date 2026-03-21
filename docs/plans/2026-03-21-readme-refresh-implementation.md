# README Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refresh the repository README into a clearer public entry point and add a `docs/` index page that links readers toward the project’s technical documentation.

**Architecture:** This is a documentation-only change. The root README will become a concise product-and-development overview, while `docs/README.md` will serve as a documentation hub pointing to the SEO guide and the existing plan/history directories.

**Tech Stack:** Markdown documentation, existing project routes/assets/docs structure.

---

### Task 1: Inspect the current README and existing docs

**Files:**
- Review: `README.md`
- Review: `docs/`
- Review: `docs/seo-technical-guide.md`

**Step 1: Identify outdated README content**

Check for:

- old project naming
- outdated avatar resource notes
- missing docs links
- weak project description

**Step 2: Identify docs destinations**

Confirm which pages the new README should link to, especially:

- `docs/README.md`
- `docs/seo-technical-guide.md`
- selected `docs/plans/*`

### Task 2: Rewrite the root README

**Files:**
- Modify: `README.md`

**Step 1: Replace the old skeleton-style content**

Add:

- project positioning
- live URL
- main features
- quick start commands
- technical stack summary
- important directories

**Step 2: Add documentation entry points**

Link to:

- `docs/README.md`
- `docs/seo-technical-guide.md`

### Task 3: Create the docs index page

**Files:**
- Create: `docs/README.md`

**Step 1: Add docs overview**

Explain the purpose of `docs/`.

**Step 2: Add documentation navigation**

Link to:

- SEO technical guide
- plans
- prompts
- sources

### Task 4: Verify the documentation

**Files:**
- Review only: `README.md`
- Review only: `docs/README.md`

**Step 1: Check that links point to existing files**

Confirm all referenced paths exist.

**Step 2: Check working tree**

Ensure only expected documentation files changed.

