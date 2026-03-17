# Homepage Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the scaffold homepage with a bilingual narrative landing page that foregrounds the philosophical question, key positions in the dialogue, and reading-first entry paths.

**Architecture:** Keep the redesign local to `src/routes/+page.svelte` and reuse the existing shell, motion language, buttons, and card primitives already present in the app. Store the homepage copy as a bilingual data object selected by `pickByLanguage`, render the page as four narrative sections, and verify the result with type-checking, production build, and manual browser review because the repository does not currently include route-level UI tests.

**Tech Stack:** SvelteKit 2, Svelte 5 runes, TypeScript, Tailwind CSS v4 utilities, existing `Button` and `Card` components, existing i18n helpers in `$lib/stores/i18n`, verification via `pnpm check` and `pnpm build`.

---

### Task 1: Replace the placeholder content model

**Files:**
- Modify: `src/routes/+page.svelte`

**Step 1: Capture the current baseline**

Run:

```bash
pnpm check
```

Expected: PASS. This confirms the current homepage compiles before the redesign begins.

**Step 2: Remove scaffold copy**

Delete the current `description`, `intro`, `modulesTitle`, and `modules` homepage copy plus the helper that only exists to stagger the old module list.

**Step 3: Add the new bilingual content structure**

Create a new `copy` shape in `src/routes/+page.svelte` that includes:

- hero title, subtitle, body, buttons, and short line
- motif words and atmosphere line
- four philosophical cards
- primary reading entry
- secondary entries for characters, themes, relations, and search
- closing line

Keep the content local to the route and continue selecting it with `pickByLanguage($i18nPreferences.primaryLanguage, ...)`.

**Step 4: Verify the route still type-checks**

Run:

```bash
pnpm check
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: replace homepage scaffold copy"
```

### Task 2: Build the new hero section

**Files:**
- Modify: `src/routes/+page.svelte`

**Step 1: Replace the top-level layout**

Swap the current two-column scaffold section for a hero composition with:

- a left narrative block containing the main question, description, CTA buttons, and short line
- a right atmospheric block for motif words and the supporting sentence

**Step 2: Apply the approved visual tone**

Use layered background treatments, stronger typography, and restrained motion so the hero feels dramatic and literary rather than utilitarian. Preserve the site's existing color and motion system instead of introducing a separate style language.

**Step 3: Keep actions reading-first**

Link the primary CTA to `/reading` and the secondary CTA to `/themes`.

**Step 4: Verify the update**

Run:

```bash
pnpm check
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: redesign homepage hero"
```

### Task 3: Add the four-position philosophical grid

**Files:**
- Modify: `src/routes/+page.svelte`

**Step 1: Add the section container**

Insert a new section below the hero for the four approved philosophical positions.

**Step 2: Render the cards from data**

Render the Phaedrus, Aristophanes, Diotima, and Socrates cards from the bilingual `copy` object. Give the cards a slightly uneven rhythm through spacing and height treatment, but keep the structure simple and maintainable.

**Step 3: Make the cards useful without over-scoping**

Link the cards to `/reading`. Do not invent deep-link anchors or query APIs unless an existing stable mechanism is already present.

**Step 4: Verify the route**

Run:

```bash
pnpm check
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: add homepage philosophy cards"
```

### Task 4: Add the entry-path section and closing line

**Files:**
- Modify: `src/routes/+page.svelte`

**Step 1: Build the entry grid**

Create a reading-led entry section with:

- one large primary card linking to `/reading`
- four smaller cards linking to `/characters`, `/themes`, `/relations`, and `/search`

**Step 2: Preserve the narrative tone**

Label this section as ways into the debate rather than implemented modules. Keep the copy concise and literary.

**Step 3: Add the closing line**

Place the approved closing sentence at the bottom of the page so the homepage resolves like a preface.

**Step 4: Verify the route**

Run:

```bash
pnpm check
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: add homepage entry paths"
```

### Task 5: Responsive polish and final verification

**Files:**
- Modify: `src/routes/+page.svelte`

**Step 1: Review responsive layout**

Check that:

- the hero collapses cleanly from split layout to stacked layout
- the philosophy cards become a single-column list on narrow screens
- the primary reading entry remains visually dominant on mobile

**Step 2: Remove any generic or noisy behaviors**

Ensure there is no horizontal hover shift, no leftover scaffold wording, and no motion that conflicts with the site's quieter interaction language.

**Step 3: Run full verification**

Run:

```bash
pnpm check
pnpm build
```

Expected: both commands PASS.

**Step 4: Manual browser QA**

Open the homepage locally and confirm:

- Chinese and English copy both render correctly when language changes
- the new structure reads as a preface, not a dashboard
- CTA links route correctly
- spacing, shadows, and emphasis remain legible on desktop and mobile widths

**Step 5: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: complete homepage redesign"
```
