# Symposium Taro Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a new `symposium` Taro multi-end app and a shared `symposium-content` data repository, while keeping `symposium-web` as an independent SvelteKit app that syncs shared content artifacts.

**Architecture:** First create `symposium-content` as the source of truth for portable data and assets. Then add explicit sync scripts to both apps so each repository builds from local synced content. Finally implement the Taro app in feature slices, using H5 plus G6 for the relation graph on web and a Taro canvas renderer for mini-program targets.

**Tech Stack:** Node scripts, JSON content artifacts, SvelteKit, Taro 4.x, React, TypeScript, Sass, G6 on H5, Taro canvas for mini-program relation rendering, Node assert tests, Vitest for pure logic tests.

---

### Task 1: Create `symposium-content` skeleton and failing content tests

**Files:**
- Create: `../symposium-content/package.json`
- Create: `../symposium-content/README.md`
- Create: `../symposium-content/tests/content-schema.test.mjs`
- Create: `../symposium-content/tests/content-build.test.mjs`
- Create: `../symposium-content/src/data/.gitkeep`
- Create: `../symposium-content/src/assets/.gitkeep`
- Create: `../symposium-content/schema/.gitkeep`
- Create: `../symposium-content/scripts/.gitkeep`

**Step 1: Write the failing schema test**

Create `../symposium-content/tests/content-schema.test.mjs` with assertions for:

- `src/data/dialogs.json` exists
- `src/data/characters.json` exists
- `src/data/themes.json` exists
- `src/data/relations.json` exists
- `src/data/annotations.json` exists
- `src/data/places.json` exists
- `src/data/content-i18n.json` exists
- `src/data/reading-i18n.json` exists
- `scripts/validate.mjs` exists

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const requiredFiles = [
  "src/data/dialogs.json",
  "src/data/characters.json",
  "src/data/themes.json",
  "src/data/relations.json",
  "src/data/annotations.json",
  "src/data/places.json",
  "src/data/content-i18n.json",
  "src/data/reading-i18n.json",
  "scripts/validate.mjs"
];

for (const relativePath of requiredFiles) {
  assert.equal(fs.existsSync(path.join(root, relativePath)), true, `${relativePath} should exist`);
}
```

**Step 2: Write the failing build artifact test**

Create `../symposium-content/tests/content-build.test.mjs` with assertions for:

- `dist/data/dialogs.json` exists after build
- `dist/assets/avatars/characters` exists after build
- `dist/manifest.json` exists after build

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
assert.equal(fs.existsSync(path.join(root, "dist/data/dialogs.json")), true);
assert.equal(fs.existsSync(path.join(root, "dist/assets/avatars/characters")), true);
assert.equal(fs.existsSync(path.join(root, "dist/manifest.json")), true);
```

**Step 3: Run the tests and verify they fail**

Run:

```bash
cd ../symposium-content
node tests/content-schema.test.mjs
node tests/content-build.test.mjs
```

Expected: FAIL because the repository files and build output do not exist yet.

**Step 4: Create the minimal repository skeleton**

Add `package.json` scripts:

- `validate`
- `build`
- `test`

Use Node-only tooling first. Do not add unnecessary runtime dependencies yet.

**Step 5: Commit**

```bash
cd ../symposium-content
git add .
git commit -m "chore: bootstrap symposium content repository"
```

### Task 2: Populate content sources and make validation pass

**Files:**
- Create: `../symposium-content/src/data/dialogs.json`
- Create: `../symposium-content/src/data/characters.json`
- Create: `../symposium-content/src/data/themes.json`
- Create: `../symposium-content/src/data/relations.json`
- Create: `../symposium-content/src/data/annotations.json`
- Create: `../symposium-content/src/data/places.json`
- Create: `../symposium-content/src/data/content-i18n.json`
- Create: `../symposium-content/src/data/reading-i18n.json`
- Create: `../symposium-content/src/assets/avatars/characters/*`
- Create: `../symposium-content/src/assets/branding/*`
- Create: `../symposium-content/scripts/validate.mjs`
- Test: `../symposium-content/tests/content-schema.test.mjs`

**Step 1: Write the failing referential-integrity assertions**

Extend `../symposium-content/tests/content-schema.test.mjs` to verify:

- every `character.firstLineId` exists in `dialogs.json`
- every `theme.lineIds` entry exists in `dialogs.json`
- every `theme.characterIds` entry exists in `characters.json`
- every relation edge source and target exists in relation nodes
- every `avatarImage` path exists under `src/assets`

```js
assert.ok(dialogIds.has(character.firstLineId), `${character.id} firstLineId must exist`);
assert.ok(characterIds.has(themeCharacterId), `theme character ${themeCharacterId} must exist`);
assert.ok(nodeIds.has(edge.source), `${edge.id} source must exist`);
```

**Step 2: Copy the current source data and assets**

Copy from the current repository:

- `src/lib/data/dialogs.json`
- `src/lib/data/characters.json`
- `src/lib/data/themes.json`
- `src/lib/data/relations.json`
- `src/lib/data/annotations.json`
- `src/lib/data/places.json`
- convert `src/lib/data/content-i18n.js` into `src/data/content-i18n.json`
- convert `src/lib/data/reading-i18n.js` into `src/data/reading-i18n.json`
- `static/avatars/characters/*`
- `static/branding/*`

Normalize asset paths so the content repository owns the portable source paths.

**Step 3: Implement the validator**

In `../symposium-content/scripts/validate.mjs`, load all source files and fail with non-zero exit code when any reference is broken.

```js
if (!dialogIds.has(character.firstLineId)) {
  throw new Error(`Missing firstLineId ${character.firstLineId} for ${character.id}`);
}
```

**Step 4: Run validation and verify it passes**

Run:

```bash
cd ../symposium-content
node tests/content-schema.test.mjs
node scripts/validate.mjs
```

Expected: PASS.

**Step 5: Commit**

```bash
cd ../symposium-content
git add src tests scripts package.json README.md
git commit -m "feat: add symposium shared content sources"
```

### Task 3: Add content build output and manifest

**Files:**
- Create: `../symposium-content/scripts/build.mjs`
- Modify: `../symposium-content/package.json`
- Modify: `../symposium-content/tests/content-build.test.mjs`
- Create: `../symposium-content/dist/.gitkeep`

**Step 1: Strengthen the failing build test**

Update `../symposium-content/tests/content-build.test.mjs` to assert:

- `dist/data/*.json` files are copied
- `dist/assets/avatars/characters/*` exists
- `dist/assets/branding/*` exists
- `dist/manifest.json` lists a `builtAt` timestamp and data file names

```js
const manifest = JSON.parse(fs.readFileSync(path.join(root, "dist/manifest.json"), "utf8"));
assert.ok(Array.isArray(manifest.dataFiles));
assert.ok(typeof manifest.builtAt === "string");
```

**Step 2: Run the build test and verify it fails**

Run:

```bash
cd ../symposium-content
node tests/content-build.test.mjs
```

Expected: FAIL because `dist/` has not been produced yet.

**Step 3: Implement the build script**

Create `../symposium-content/scripts/build.mjs` to:

- clear `dist`
- copy `src/data` to `dist/data`
- copy `src/assets` to `dist/assets`
- emit `dist/manifest.json`

```js
const manifest = {
  builtAt: new Date().toISOString(),
  dataFiles: fs.readdirSync(path.join(root, "dist/data"))
};
```

**Step 4: Run build and verify it passes**

Run:

```bash
cd ../symposium-content
node scripts/build.mjs
node tests/content-build.test.mjs
```

Expected: PASS.

**Step 5: Commit**

```bash
cd ../symposium-content
git add scripts tests package.json dist/manifest.json
git commit -m "feat: add build output for symposium content"
```

### Task 4: Make `symposium-web` consume synced content artifacts

**Files:**
- Create: `scripts/sync-content.mjs`
- Create: `tests/content-sync-script.test.mjs`
- Modify: `package.json`
- Modify: `README.md`

**Step 1: Write the failing sync-script test**

Create `tests/content-sync-script.test.mjs` with assertions for:

- `scripts/sync-content.mjs` exists
- it references `../symposium-content/dist/data`
- it references `../symposium-content/dist/assets`
- it targets `src/lib/data`
- it targets `static/avatars`
- it targets `static/branding`

```js
import assert from "node:assert/strict";
import fs from "node:fs";

const script = fs.readFileSync(new URL("../scripts/sync-content.mjs", import.meta.url), "utf8");
assert.match(script, /\.\.\/symposium-content\/dist\/data/);
assert.match(script, /src\/lib\/data/);
assert.match(script, /static\/avatars/);
```

**Step 2: Run the test and verify it fails**

Run:

```bash
node tests/content-sync-script.test.mjs
```

Expected: FAIL because the script does not exist yet.

**Step 3: Implement the sync script**

Create `scripts/sync-content.mjs` to copy:

- `../symposium-content/dist/data/*` -> `src/lib/data/*`
- `../symposium-content/dist/assets/avatars/characters/*` -> `static/avatars/characters/*`
- `../symposium-content/dist/assets/branding/*` -> `static/branding/*`

Keep the file layout stable so existing imports can remain unchanged.

**Step 4: Add npm scripts and docs**

Add to `package.json`:

- `sync:content`
- `build:content` if useful as a local chained convenience command

Document the new content flow in `README.md`.

**Step 5: Run the test and verify it passes**

Run:

```bash
node tests/content-sync-script.test.mjs
node scripts/sync-content.mjs
```

Expected: PASS.

**Step 6: Commit**

```bash
git add scripts/sync-content.mjs tests/content-sync-script.test.mjs package.json README.md
git commit -m "feat: sync symposium-web from shared content"
```

### Task 5: Scaffold the `symposium` Taro application and normalize its structure

**Files:**
- Create: `../symposium/package.json`
- Create: `../symposium/config/index.ts`
- Create: `../symposium/config/dev.ts`
- Create: `../symposium/config/prod.ts`
- Create: `../symposium/src/app.ts`
- Create: `../symposium/src/app.config.ts`
- Create: `../symposium/src/app.scss`
- Create: `../symposium/src/pages/home/index.tsx`
- Create: `../symposium/src/pages/home/index.config.ts`
- Create: `../symposium/tests/app-shell.test.ts`

**Step 1: Initialize the official Taro app**

Run:

```bash
cd ..
npx @tarojs/cli init symposium
```

Choose:

- framework: React
- language: TypeScript
- style: Sass
- package manager: npm

**Step 2: Write the failing shell test**

Create `../symposium/tests/app-shell.test.ts` asserting:

- app config includes `pages/home/index`
- the app title includes `Symposium`
- H5 and WeChat builds have npm scripts

```ts
import { describe, expect, it } from "vitest";
import appConfig from "../src/app.config";

describe("app shell", () => {
  it("registers the home page", () => {
    expect(appConfig.pages).toContain("pages/home/index");
  });
});
```

**Step 3: Run the test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run tests/app-shell.test.ts
```

Expected: FAIL until the scaffold is normalized.

**Step 4: Normalize the generated structure**

Adjust the scaffold so it uses:

- `pages/home/index`
- `pages/reading/index`
- `pages/characters/index`
- `pages/themes/index`
- `pages/relations/index`
- `pages/search/index`

Keep the initial app shell minimal and platform-safe.

**Step 5: Run the test and verify it passes**

Run:

```bash
cd ../symposium
npx vitest run tests/app-shell.test.ts
npm run build:h5
npm run build:weapp
```

Expected: PASS.

**Step 6: Commit**

```bash
cd ../symposium
git add .
git commit -m "chore: scaffold symposium taro app"
```

### Task 6: Add content sync and normalized data access to `symposium`

**Files:**
- Create: `../symposium/scripts/sync-content.mjs`
- Create: `../symposium/src/data/index.ts`
- Create: `../symposium/src/types/content.ts`
- Create: `../symposium/src/utils/assets.ts`
- Create: `../symposium/tests/content-sync.test.ts`
- Modify: `../symposium/package.json`

**Step 1: Write the failing content-sync test**

Create `../symposium/tests/content-sync.test.ts` asserting:

- `src/data/dialogs.json` is loadable
- `src/data/characters.json` is loadable
- avatar path helpers return app-local asset paths

```ts
import { expect, it } from "vitest";
import dialogs from "../src/data/dialogs.json";

it("loads synced dialogs", () => {
  expect(Array.isArray(dialogs)).toBe(true);
});
```

**Step 2: Run the test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run tests/content-sync.test.ts
```

Expected: FAIL because the sync pipeline and local files do not exist yet.

**Step 3: Implement the sync script**

Copy from:

- `../symposium-content/dist/data/*` -> `src/data/*`
- `../symposium-content/dist/assets/*` -> `src/assets/*`

Keep all app imports local after sync.

**Step 4: Add the normalized content barrel and types**

Create `src/data/index.ts` and `src/types/content.ts` so all features import content through a single stable module.

**Step 5: Run the test and verify it passes**

Run:

```bash
cd ../symposium
node scripts/sync-content.mjs
npx vitest run tests/content-sync.test.ts
```

Expected: PASS.

**Step 6: Commit**

```bash
cd ../symposium
git add scripts src tests package.json
git commit -m "feat: sync symposium app from shared content"
```

### Task 7: Port i18n preferences and shared content selectors

**Files:**
- Create: `../symposium/src/stores/i18n.ts`
- Create: `../symposium/src/features/shared/i18n.ts`
- Create: `../symposium/src/features/shared/selectors.ts`
- Create: `../symposium/src/features/shared/i18n.test.ts`
- Create: `../symposium/src/features/shared/selectors.test.ts`

**Step 1: Write the failing i18n test**

Cover:

- default language is `zh-CN`
- translation toggle persists
- target language persists
- Chinese falls back when translation is missing

```ts
import { describe, expect, it } from "vitest";
import { getDisplayText } from "./i18n";

describe("i18n selectors", () => {
  it("falls back to source text when translation is missing", () => {
    expect(getDisplayText({ text: "原文" }, "en-US")).toBe("原文");
  });
});
```

**Step 2: Run the test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run src/features/shared/i18n.test.ts src/features/shared/selectors.test.ts
```

Expected: FAIL because the selector and store modules do not exist yet.

**Step 3: Port the minimal implementation**

Move the current logic from:

- `src/lib/stores/i18n.ts`
- `src/lib/data/content-i18n.js`
- `src/lib/data/reading-i18n.js`

into framework-safe helpers plus a Taro storage-backed preference store.

**Step 4: Run the tests and verify they pass**

Run:

```bash
cd ../symposium
npx vitest run src/features/shared/i18n.test.ts src/features/shared/selectors.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
cd ../symposium
git add src
git commit -m "feat: add shared i18n and selector layer"
```

### Task 8: Implement the home page and shared app shell

**Files:**
- Create: `../symposium/src/components/app-shell.tsx`
- Create: `../symposium/src/components/nav-bar.tsx`
- Create: `../symposium/src/features/home/home-page.tsx`
- Create: `../symposium/src/features/home/home-page.test.tsx`
- Modify: `../symposium/src/pages/home/index.tsx`
- Modify: `../symposium/src/app.config.ts`
- Modify: `../symposium/src/app.scss`

**Step 1: Write the failing home-page test**

Cover:

- hero title renders
- reading CTA renders
- all five major navigation entries render

```tsx
import { render } from "@testing-library/react";
import { HomePage } from "./home-page";

it("renders the reading entry CTA", () => {
  const { getByText } = render(<HomePage />);
  expect(getByText("Start Reading")).toBeTruthy();
});
```

**Step 2: Run the test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run src/features/home/home-page.test.tsx
```

Expected: FAIL because the page component is not implemented yet.

**Step 3: Implement the shell and page**

Keep the Taro shell intentionally simple:

- top nav
- content container
- platform-safe spacing
- bilingual home copy

Do not port the full Svelte motion system.

**Step 4: Run the test and verify it passes**

Run:

```bash
cd ../symposium
npx vitest run src/features/home/home-page.test.tsx
npm run build:h5
```

Expected: PASS.

**Step 5: Commit**

```bash
cd ../symposium
git add src
git commit -m "feat: add symposium taro home page"
```

### Task 9: Implement the reading experience

**Files:**
- Create: `../symposium/src/features/reading/model.ts`
- Create: `../symposium/src/features/reading/model.test.ts`
- Create: `../symposium/src/features/reading/reading-page.tsx`
- Create: `../symposium/src/features/reading/dialogue-list.tsx`
- Create: `../symposium/src/features/reading/annotation-panel.tsx`
- Create: `../symposium/src/features/reading/filter-bar.tsx`
- Modify: `../symposium/src/pages/reading/index.tsx`
- Create: `../symposium/src/pages/reading/index.config.ts`

**Step 1: Write the failing reading model test**

Cover:

- speaker filtering
- chapter filtering
- selected-line fallback when current selection disappears
- annotation lookup by line ID

```ts
import { expect, it } from "vitest";
import { filterLines } from "./model";

it("filters by active speaker ids", () => {
  expect(filterLines(lines, { speakerIds: ["socrates"], chapterIds: [] })).toHaveLength(1);
});
```

**Step 2: Run the test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run src/features/reading/model.test.ts
```

Expected: FAIL because the model functions do not exist yet.

**Step 3: Implement the minimal reading model**

Build pure functions first:

- `filterLines`
- `getDefaultSpeakerIds`
- `getDefaultChapterIds`
- `resolveSelectedLineId`
- `getAnnotationsByLine`

**Step 4: Run the test and verify it passes**

Run:

```bash
cd ../symposium
npx vitest run src/features/reading/model.test.ts
```

Expected: PASS.

**Step 5: Write the failing reading page test**

Cover:

- renders list items
- opens annotation detail when a line is selected
- uses stacked layout on narrow screens without assuming hover

**Step 6: Run the page test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run src/features/reading/reading-page.test.tsx
```

Expected: FAIL because the page is not implemented yet.

**Step 7: Implement the reading page**

Use:

- top filter controls
- central dialogue list
- bottom sheet or panel detail for mini-program-safe annotation access

**Step 8: Run the tests and build verification**

Run:

```bash
cd ../symposium
npx vitest run src/features/reading/model.test.ts src/features/reading/reading-page.test.tsx
npm run build:h5
npm run build:weapp
```

Expected: PASS.

**Step 9: Commit**

```bash
cd ../symposium
git add src
git commit -m "feat: add taro reading experience"
```

### Task 10: Implement characters, themes, and search

**Files:**
- Create: `../symposium/src/features/characters/characters-page.tsx`
- Create: `../symposium/src/features/characters/characters-page.test.tsx`
- Create: `../symposium/src/features/themes/themes-page.tsx`
- Create: `../symposium/src/features/themes/themes-page.test.tsx`
- Create: `../symposium/src/features/search/search-model.ts`
- Create: `../symposium/src/features/search/search-model.test.ts`
- Create: `../symposium/src/features/search/search-page.tsx`
- Create: `../symposium/src/features/search/search-page.test.tsx`
- Modify: `../symposium/src/pages/characters/index.tsx`
- Modify: `../symposium/src/pages/themes/index.tsx`
- Modify: `../symposium/src/pages/search/index.tsx`

**Step 1: Write the failing pure search test**

Cover:

- text match
- speaker match
- tag match
- empty query returns no results

```ts
import { expect, it } from "vitest";
import { searchDialogs } from "./search-model";

it("matches speaker names and tags", () => {
  expect(searchDialogs(dialogs, "Diotima", speakers)).not.toHaveLength(0);
});
```

**Step 2: Run the pure search test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run src/features/search/search-model.test.ts
```

Expected: FAIL because the model does not exist yet.

**Step 3: Implement the minimal search model**

Keep it local, synchronous, and dependency-free.

**Step 4: Run the search model test and verify it passes**

Run:

```bash
cd ../symposium
npx vitest run src/features/search/search-model.test.ts
```

Expected: PASS.

**Step 5: Write the failing page tests**

Cover:

- character cards render
- theme cards render
- search prompt and result list render

**Step 6: Run the page tests and verify they fail**

Run:

```bash
cd ../symposium
npx vitest run src/features/characters/characters-page.test.tsx src/features/themes/themes-page.test.tsx src/features/search/search-page.test.tsx
```

Expected: FAIL because the pages are not implemented yet.

**Step 7: Implement the pages**

Important constraints:

- use tap-safe interactions only
- gate or soften external-link behavior on mini-program targets
- cap rendered search results if performance becomes unstable

**Step 8: Run the tests and build verification**

Run:

```bash
cd ../symposium
npx vitest run src/features/characters/characters-page.test.tsx src/features/themes/themes-page.test.tsx src/features/search/search-model.test.ts src/features/search/search-page.test.tsx
npm run build:h5
npm run build:weapp
```

Expected: PASS.

**Step 9: Commit**

```bash
cd ../symposium
git add src
git commit -m "feat: add taro characters themes and search pages"
```

### Task 11: Implement the H5 relation graph with G6

**Files:**
- Create: `../symposium/src/features/relations/model.ts`
- Create: `../symposium/src/features/relations/model.test.ts`
- Create: `../symposium/src/features/relations/h5-graph.tsx`
- Create: `../symposium/src/features/relations/h5-graph.test.tsx`
- Create: `../symposium/src/features/relations/relation-details.tsx`
- Modify: `../symposium/src/pages/relations/index.tsx`

**Step 1: Write the failing relation model test**

Cover:

- active node lookup
- related edge lookup
- related connection mapping
- graceful empty-state handling

```ts
import { expect, it } from "vitest";
import { getRelatedConnections } from "./model";

it("returns all connections for an active node", () => {
  expect(getRelatedConnections(graph, "socrates")).not.toHaveLength(0);
});
```

**Step 2: Run the test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run src/features/relations/model.test.ts
```

Expected: FAIL because the model functions do not exist yet.

**Step 3: Implement the minimal model**

Build:

- `getActiveNode`
- `getRelatedEdges`
- `getRelatedConnections`
- `getEntityTypeLabel`

**Step 4: Run the model test and verify it passes**

Run:

```bash
cd ../symposium
npx vitest run src/features/relations/model.test.ts
```

Expected: PASS.

**Step 5: Write the failing H5 graph page test**

Cover:

- graph shell renders on H5
- selecting a node updates the detail card

**Step 6: Run the page test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run src/features/relations/h5-graph.test.tsx
```

Expected: FAIL because the H5 graph component does not exist yet.

**Step 7: Implement the H5 renderer**

Use G6 only inside the H5-specific component. Keep all graph data preparation outside the renderer so the mini-program path can reuse the same model.

**Step 8: Run the tests and H5 build verification**

Run:

```bash
cd ../symposium
npx vitest run src/features/relations/model.test.ts src/features/relations/h5-graph.test.tsx
npm run build:h5
```

Expected: PASS.

**Step 9: Commit**

```bash
cd ../symposium
git add src package.json
git commit -m "feat: add h5 relation graph with g6"
```

### Task 12: Implement the mini-program relation canvas renderer

**Files:**
- Create: `../symposium/src/features/relations/mp-canvas-graph.tsx`
- Create: `../symposium/src/features/relations/mp-canvas-renderer.ts`
- Create: `../symposium/src/features/relations/mp-canvas-renderer.test.ts`
- Modify: `../symposium/src/pages/relations/index.tsx`
- Modify: `../symposium/src/platform/index.ts`

**Step 1: Write the failing canvas renderer test**

Cover:

- maps node coordinates to draw instructions
- highlights connected edges for selected node
- returns safe empty instructions when no graph is available

```ts
import { expect, it } from "vitest";
import { buildCanvasInstructions } from "./mp-canvas-renderer";

it("highlights connected edges for the selected node", () => {
  const result = buildCanvasInstructions(graph, "socrates");
  expect(result.highlightedEdgeIds.length).toBeGreaterThan(0);
});
```

**Step 2: Run the test and verify it fails**

Run:

```bash
cd ../symposium
npx vitest run src/features/relations/mp-canvas-renderer.test.ts
```

Expected: FAIL because the renderer does not exist yet.

**Step 3: Implement the minimal renderer**

Use fixed coordinates from `relations.json`. Do not add runtime auto-layout in the first release.

Include only:

- node draw instructions
- edge draw instructions
- active-node highlighting
- pan and zoom state support

**Step 4: Run the renderer test and verify it passes**

Run:

```bash
cd ../symposium
npx vitest run src/features/relations/mp-canvas-renderer.test.ts
```

Expected: PASS.

**Step 5: Implement the mini-program page path**

At `src/pages/relations/index.tsx`, branch by platform:

- H5 -> `h5-graph.tsx`
- mini-program -> `mp-canvas-graph.tsx`

**Step 6: Run build verification**

Run:

```bash
cd ../symposium
npm run build:h5
npm run build:weapp
```

Expected: PASS.

**Step 7: Commit**

```bash
cd ../symposium
git add src
git commit -m "feat: add mini program relation graph renderer"
```

### Task 13: Final integration verification

**Files:**
- Review only: `../symposium-content/*`
- Review only: `scripts/sync-content.mjs`
- Review only: `../symposium/scripts/sync-content.mjs`
- Review only: `../symposium/src/**/*`
- Review only: `docs/plans/2026-03-24-symposium-taro-migration-design.md`
- Review only: `docs/plans/2026-03-24-symposium-taro-migration-implementation.md`

**Step 1: Rebuild shared content**

Run:

```bash
cd ../symposium-content
node scripts/validate.mjs
node scripts/build.mjs
node tests/content-schema.test.mjs
node tests/content-build.test.mjs
```

Expected: PASS.

**Step 2: Sync content into both apps**

Run:

```bash
cd ../symposium-web
node scripts/sync-content.mjs
node tests/content-sync-script.test.mjs

cd ../symposium
node scripts/sync-content.mjs
npx vitest run
```

Expected: PASS.

**Step 3: Run app build verification**

Run:

```bash
cd ../symposium-web
npm run check
npm run build

cd ../symposium
npm run build:h5
npm run build:weapp
```

Expected: PASS.

**Step 4: Manual platform verification**

Confirm in browser and WeChat developer tools:

- home page renders
- reading filters work
- selected line opens details
- character page avatars load
- theme page links into reading
- search returns results
- relations page selects nodes and updates details
- Chinese and English toggles work

**Step 5: Commit the final integration changes**

```bash
cd ../symposium-content
git add .
git commit -m "chore: finalize shared symposium content"

cd ../symposium-web
git add scripts package.json README.md docs/plans/2026-03-24-symposium-taro-migration-design.md docs/plans/2026-03-24-symposium-taro-migration-implementation.md
git commit -m "docs: add symposium taro migration plan"

cd ../symposium
git add .
git commit -m "feat: ship initial symposium taro app"
```
