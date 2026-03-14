# Quieter UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rework the site-wide visual system into a quieter academic-exhibition style without removing entity highlighting, reading tools, or research navigation.

**Architecture:** The implementation should start at the token and shared-component level so the visual shift propagates consistently across the app. After the shared primitives are stable, update the reading flow and then the supporting index, theme, graph, and search pages so each view adopts the same quieter system with page-appropriate emphasis.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Tailwind CSS 4, tailwind-variants, shadcn-svelte style primitives

---

### Task 1: Establish Quieter Global Tokens

**Files:**
- Modify: `src/routes/layout.css`

**Step 1: Update the light and dark semantic color tokens**

- Replace the current stronger neutral ramp with a warmer paper-toned light palette and a charcoal-brown dark palette.
- Keep contrast accessible for text, borders, focus rings, and surfaces.
- Add any missing semantic tokens needed for layered surfaces or restrained entity accents if they can be expressed cleanly in the existing token block.

**Step 2: Reduce default surface intensity**

- Tune `--background`, `--card`, `--popover`, `--secondary`, `--muted`, `--accent`, `--border`, `--input`, and `--ring`.
- Ensure the default contrast no longer depends on page-wide gradients or shadow-heavy separation.

**Step 3: Verify token integrity**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

**Step 4: Commit**

```bash
git add src/routes/layout.css
git commit -m "style: soften global visual tokens"
```

### Task 2: Soften Shared Shell and Primitive Components

**Files:**
- Modify: `src/lib/components/site-shell.svelte`
- Modify: `src/lib/components/ui/button/button.svelte`
- Modify: `src/lib/components/ui/badge/badge.svelte`
- Modify: `src/lib/components/ui/card/card.svelte`
- Modify: `src/lib/components/ui/input/input.svelte`
- Modify: `src/lib/components/i18n/i18n-settings-dialog.svelte`

**Step 1: Rework the site shell**

- Reduce the perceived weight of the sticky header.
- Convert the top navigation from a row of obvious buttons into quieter textual or tab-like navigation.
- Keep the active route clearly visible while demoting inactive routes.
- Keep language and theme controls compact and precise instead of heavy icon buttons.

**Step 2: Rebalance shared primitives**

- Update button variants to reduce shadows, heavy fills, and oversized radii.
- Make `outline`, `secondary`, and `ghost` the calmer default feel for most contexts.
- Make badges read as index markers rather than chunky chips.
- Flatten cards so they rely on subtle surfaces and borders, not boxy UI chrome.
- Soften inputs at rest while keeping focus states explicit.

**Step 3: Bring the settings dialog in line with the quieter system**

- Reduce visual clutter in the language settings dialog so it matches the updated shell and primitives.

**Step 4: Verify the shared layer**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

Run: `npm run build`
Expected: successful static production build with no new warnings

**Step 5: Commit**

```bash
git add src/lib/components/site-shell.svelte src/lib/components/ui/button/button.svelte src/lib/components/ui/badge/badge.svelte src/lib/components/ui/card/card.svelte src/lib/components/ui/input/input.svelte src/lib/components/i18n/i18n-settings-dialog.svelte
git commit -m "style: quiet shared shell and primitives"
```

### Task 3: Refine Reading Flow, Filters, and Entity Highlighting

**Files:**
- Modify: `src/routes/reading/+page.svelte`
- Modify: `src/lib/components/reading/annotated-text.svelte`
- Modify: `src/lib/components/reading/dialogue-line.svelte`
- Modify: `src/lib/components/reading/dialogue-list.svelte`
- Modify: `src/lib/components/reading/annotation-panel.svelte`
- Modify: `src/lib/components/reading/speaker-filter.svelte`

**Step 1: Compact the reading tool chrome**

- Make the reading tools panel feel like a light control strip instead of a boxed utility block.
- Reduce border density, heavy paneling, and redundant emphasis.
- Keep search and speaker filtering obvious enough for research use.

**Step 2: Rework the dialogue item styling**

- Reduce card-like weight for each line.
- Keep the selected line clearly identifiable, but use restrained background and border treatments.
- Make translation reveal states feel secondary to the original text.

**Step 3: Redesign entity highlighting**

- Preserve highlighting for people, places, and concepts.
- Replace high-visibility text-color emphasis with quieter academic annotation cues.
- Use low-saturation tint, restrained underline, or a combined treatment in rest state.
- Increase emphasis only on hover, focus, selected context, or linked annotation states.

**Step 4: Lighten the annotation panel and speaker filter**

- Make the annotation column feel like marginal apparatus rather than a second dashboard.
- Make speaker controls feel more like scholarly filters than colorful chips.

**Step 5: Verify the reading flow**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

Run: `npm run build`
Expected: successful static production build with no new warnings

Manual review:
- Reading page works in light and dark themes.
- Entity highlights are visible but not loud.
- Selected lines, translation toggles, and annotations remain easy to use.

**Step 6: Commit**

```bash
git add src/routes/reading/+page.svelte src/lib/components/reading/annotated-text.svelte src/lib/components/reading/dialogue-line.svelte src/lib/components/reading/dialogue-list.svelte src/lib/components/reading/annotation-panel.svelte src/lib/components/reading/speaker-filter.svelte
git commit -m "style: quiet reading interactions and highlights"
```

### Task 4: Harmonize Home, Index, Theme, Search, and Graph Pages

**Files:**
- Modify: `src/routes/+page.svelte`
- Modify: `src/routes/characters/+page.svelte`
- Modify: `src/routes/themes/+page.svelte`
- Modify: `src/routes/search/+page.svelte`
- Modify: `src/routes/relations/+page.svelte`
- Modify: `src/lib/components/relations/relation-graph.svelte`

**Step 1: Flatten the home page**

- Reduce hero-card emphasis.
- Present the entry actions and module summary more like a preface or directory page.

**Step 2: Rework the character and theme views**

- Make character entries feel like index records instead of a generic card wall.
- Make theme groups feel like research dossiers instead of repeated boxed quote stacks.

**Step 3: Tighten the search view**

- Make search results read as retrieval results, not decorative content cards.
- Keep tags, speaker labels, and jump links visible but quieter.

**Step 4: Rebalance the relation graph page**

- Keep the graph view slightly more assertive than text-heavy pages.
- Move most emphasis into active node and edge states instead of heavy surrounding chrome.

**Step 5: Verify page coherence**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

Run: `npm run build`
Expected: successful static production build with no new warnings

Manual review:
- All pages feel like part of one system.
- The reading page still feels like the primary destination.
- The graph page remains the most structurally expressive view without becoming noisy.

**Step 6: Commit**

```bash
git add src/routes/+page.svelte src/routes/characters/+page.svelte src/routes/themes/+page.svelte src/routes/search/+page.svelte src/routes/relations/+page.svelte src/lib/components/relations/relation-graph.svelte
git commit -m "style: harmonize quieter page layouts"
```

### Task 5: Final Cross-Page Verification and Cleanup

**Files:**
- Review only: `src/routes/layout.css`
- Review only: `src/lib/components/site-shell.svelte`
- Review only: `src/routes/+page.svelte`
- Review only: `src/routes/reading/+page.svelte`
- Review only: `src/routes/characters/+page.svelte`
- Review only: `src/routes/themes/+page.svelte`
- Review only: `src/routes/search/+page.svelte`
- Review only: `src/routes/relations/+page.svelte`

**Step 1: Run final automated verification**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

Run: `npm run build`
Expected: successful static production build

**Step 2: Run manual QA**

- Check light theme and dark theme.
- Check desktop and a narrow mobile viewport.
- Check the home page, reading page, characters page, themes page, relations page, and search page.
- Confirm that entity highlighting still reads clearly in dense text.
- Confirm that focus states remain visible for keyboard users.

**Step 3: Commit**

```bash
git add src/routes/layout.css src/lib/components/site-shell.svelte src/routes/+page.svelte src/routes/reading/+page.svelte src/routes/characters/+page.svelte src/routes/themes/+page.svelte src/routes/search/+page.svelte src/routes/relations/+page.svelte src/lib/components/relations/relation-graph.svelte
git commit -m "style: finalize quieter academic exhibition ui"
```
