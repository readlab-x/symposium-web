# Reading Ritual Motion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a high-presence, reading-centered motion system across the site that feels ceremonial and responsive while staying smooth on desktop and mobile.

**Architecture:** Implement motion in layers. Start with global timing tokens and reduced-motion safeguards, then add shell and route choreography, then build the reading-page motion chain, and only after that propagate the same motion language to the secondary pages. Verification should rely on the repo's existing `check` and `build` commands plus browser smoke testing with `agent-browser` through a locally running Chrome CDP session.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Tailwind CSS 4, Lucide, agent-browser, local Chrome CDP

---

### Task 1: Establish Motion Tokens and Reduced-Motion Rules

**Files:**
- Modify: `src/routes/layout.css`

**Step 1: Add motion tokens**

- Define semantic easing and duration variables for fast feedback, panel reveals, and page choreography.
- Add only the keyframes that will actually be reused, such as fade-rise, settle, and subtle accent sweep.

**Step 2: Add reduced-motion handling**

- Add a dedicated `prefers-reduced-motion` section that disables stagger, large translation distances, and decorative keyframe animation.
- Keep state clarity with minimal opacity transitions rather than removing all feedback.

**Step 3: Keep motion GPU-friendly**

- Ensure the shared motion utilities rely on `transform` and `opacity`.
- Avoid introducing layout-heavy animations at the global layer.

**Step 4: Verify**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

**Step 5: Commit**

```bash
git add src/routes/layout.css
git commit -m "feat: add ritual motion tokens and reduced-motion rules"
```

### Task 2: Add Shell and Route Choreography

**Files:**
- Modify: `src/lib/components/site-shell.svelte`
- Modify: `src/routes/+layout.svelte`

**Step 1: Add route-entry choreography**

- Introduce mount and route-change animation state in the shell.
- Choreograph the shell title, nav, controls, and main content so they enter in layers instead of appearing all at once.

**Step 2: Animate navigation and utility controls**

- Add stronger hover and active transitions to the nav indicator.
- Add more assertive but fast feedback to the language and theme controls.

**Step 3: Keep mobile behavior trimmed**

- Reduce delays, translation distances, and simultaneous animated elements on narrow screens.

**Step 4: Verify**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

Run: `npm run build`
Expected: successful static build

**Step 5: Commit**

```bash
git add src/lib/components/site-shell.svelte src/routes/+layout.svelte
git commit -m "feat: choreograph shell and route entrances"
```

### Task 3: Build Reading Page Entrance and Selection Motion

**Files:**
- Modify: `src/routes/reading/+page.svelte`
- Modify: `src/lib/components/reading/dialogue-list.svelte`
- Modify: `src/lib/components/reading/dialogue-line.svelte`

**Step 1: Add layered reading-page entrance**

- Animate heading first, tools bar second, early visible dialogue lines third, and the annotation panel last.
- Only stagger the first visible items in the dialogue list; do not animate the full list.

**Step 2: Strengthen selected-line focus transfer**

- Give the selected dialogue line a lift-and-settle feel using transform and opacity-safe surface changes.
- Make the transition feel like the passage is being brought to the center of attention.

**Step 3: Add stronger control feedback**

- Animate the tool expand button and reading controls with more assertive motion than the current simple rotate/fade behavior.

**Step 4: Verify**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

Run: `npm run build`
Expected: successful static build

**Step 5: Commit**

```bash
git add src/routes/reading/+page.svelte src/lib/components/reading/dialogue-list.svelte src/lib/components/reading/dialogue-line.svelte
git commit -m "feat: add reading page entrance and focus motion"
```

### Task 4: Animate Translation, Entity Highlights, and Annotation Panel

**Files:**
- Modify: `src/lib/components/reading/dialogue-line.svelte`
- Modify: `src/lib/components/reading/annotated-text.svelte`
- Modify: `src/lib/components/reading/annotation-panel.svelte`
- Modify: `src/lib/components/reading/speaker-filter.svelte`

**Step 1: Enrich translation reveal**

- Keep the current reveal structure but add fade, rise, and accent-edge motion so translations feel like a secondary text layer being drawn out.

**Step 2: Animate entity activation**

- Add richer hover and focus feedback to entity highlights.
- Animate tooltip entrance so entity annotation feels activated instead of merely toggled.

**Step 3: Sequence annotation updates**

- Make the quoted line in the annotation panel update first and the annotation items follow after it.
- Keep the panel feeling like a scholarly margin note rather than a hard-refresh details pane.

**Step 4: Improve speaker-filter feedback**

- Make chips and reset behavior feel quicker and more deliberate without becoming playful.

**Step 5: Verify**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

Run: `npm run build`
Expected: successful static build

**Step 6: Commit**

```bash
git add src/lib/components/reading/dialogue-line.svelte src/lib/components/reading/annotated-text.svelte src/lib/components/reading/annotation-panel.svelte src/lib/components/reading/speaker-filter.svelte
git commit -m "feat: animate reading details and annotation feedback"
```

### Task 5: Apply the Motion Language to Secondary Pages

**Files:**
- Modify: `src/routes/+page.svelte`
- Modify: `src/routes/characters/+page.svelte`
- Modify: `src/routes/themes/+page.svelte`
- Modify: `src/routes/search/+page.svelte`
- Modify: `src/routes/relations/+page.svelte`
- Modify: `src/lib/components/relations/relation-graph.svelte`

**Step 1: Animate home-page opening**

- Give the home page layered entrance choreography for heading, actions, and module index.

**Step 2: Add archive-like motion to index pages**

- Make character and theme records enter and hover with measured editorial rhythm.

**Step 3: Speed up search feedback**

- Strengthen search input focus and result-entry rhythm while keeping scanning fast.

**Step 4: Intensify relation-graph interaction**

- Add stronger node-hover, selected-node, and related-edge motion than on the text-heavy pages.
- Keep the graph responsive and structurally expressive rather than decorative.

**Step 5: Verify**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

Run: `npm run build`
Expected: successful static build

**Step 6: Commit**

```bash
git add src/routes/+page.svelte src/routes/characters/+page.svelte src/routes/themes/+page.svelte src/routes/search/+page.svelte src/routes/relations/+page.svelte src/lib/components/relations/relation-graph.svelte
git commit -m "feat: extend reading ritual motion across pages"
```

### Task 6: Final Browser Verification with Chrome CDP and agent-browser

**Files:**
- Review only: `src/routes/layout.css`
- Review only: `src/lib/components/site-shell.svelte`
- Review only: `src/routes/reading/+page.svelte`
- Review only: `src/lib/components/reading/dialogue-line.svelte`
- Review only: `src/lib/components/reading/annotated-text.svelte`
- Review only: `src/lib/components/reading/annotation-panel.svelte`
- Review only: `src/routes/+page.svelte`
- Review only: `src/routes/relations/+page.svelte`
- Review only: `src/lib/components/relations/relation-graph.svelte`

**Step 1: Run final automated verification**

Run: `npm run check`
Expected: `svelte-check found 0 errors and 0 warnings`

Run: `npm run build`
Expected: successful static build

**Step 2: Start local static preview**

Run:

```powershell
python -m http.server 4175 --directory build
```

Expected: local static server listens on `http://127.0.0.1:4175`

**Step 3: Start Chrome with remote debugging**

Run:

```powershell
$chrome='C:\Program Files\Google\Chrome\Application\chrome.exe'
$profile="$env:TEMP\huiyin-agent-browser-profile"
New-Item -ItemType Directory -Force -Path $profile | Out-Null
Start-Process -FilePath $chrome -ArgumentList @('--remote-debugging-port=9222',"--user-data-dir=$profile",'about:blank')
```

Expected: Chrome starts and listens on `127.0.0.1:9222`

**Step 4: Smoke-test key pages with agent-browser**

Run:

```bash
agent-browser --cdp 9222 open http://127.0.0.1:4175/index.html
agent-browser --cdp 9222 snapshot -i
agent-browser --cdp 9222 open http://127.0.0.1:4175/reading.html
agent-browser --cdp 9222 snapshot -i
agent-browser --cdp 9222 open http://127.0.0.1:4175/relations.html
agent-browser --cdp 9222 snapshot -i
```

Expected:
- Home page shows interactive entry links.
- Reading page exposes tool toggle, line buttons, and entity buttons.
- Relations page exposes node buttons.

**Step 5: Manual QA checklist**

- Confirm route entrance choreography feels intentional on desktop.
- Confirm mobile view still feels responsive after motion is added.
- Confirm selected line, translation reveal, and entity hover states all remain legible.
- Confirm reduced-motion mode removes the dramatic choreography.

**Step 6: Commit**

```bash
git add src/routes/layout.css src/lib/components/site-shell.svelte src/routes/reading/+page.svelte src/lib/components/reading/dialogue-line.svelte src/lib/components/reading/annotated-text.svelte src/lib/components/reading/annotation-panel.svelte src/routes/+page.svelte src/routes/relations/+page.svelte src/lib/components/relations/relation-graph.svelte
git commit -m "feat: finalize reading ritual motion system"
```
