# Character Avatar Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add local illustrated avatars for Symposium characters, with graceful fallback to the existing single-character avatar field across the reading and character index experiences.

**Architecture:** Keep generated source artwork outside bundled app data, store optimized SVG avatars under `static/avatars/characters/`, and extend character records with a stable image-path field while preserving the current `avatar` fallback field. Rendering should use the existing `bits-ui` avatar primitives so missing images degrade cleanly to the existing single-character fallback.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Bits UI Avatar, static asset serving from `static/`, JSON data in `src/lib/data`, verification via `npm run check` and targeted Node validation script.

---

### Task 1: Define the character avatar data contract

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/data/characters.json`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Create `scripts/verify-character-avatar-data.mjs` with assertions that every character record has:

```js
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const charactersPath = path.join(repoRoot, 'src/lib/data/characters.json');
const publicRoot = path.join(repoRoot, 'static');
const characters = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));

for (const character of characters) {
  if (typeof character.avatar !== 'string' || character.avatar.length === 0) {
    throw new Error(`Missing avatar fallback for ${character.id}`);
  }

  if (typeof character.avatarImage !== 'string' || character.avatarImage.length === 0) {
    throw new Error(`Missing avatarImage for ${character.id}`);
  }

  const imagePath = path.join(publicRoot, character.avatarImage.replace(/^\//, ''));
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Missing avatar asset for ${character.id}: ${character.avatarImage}`);
  }
}

console.log(`Verified ${characters.length} character avatar records.`);
```

**Step 2: Run test to verify it fails**

Run: `node scripts/verify-character-avatar-data.mjs`
Expected: FAIL with an error like `Missing avatarImage for socrates`

**Step 3: Write minimal implementation**

- Extend `Character` in `src/lib/types.ts` with:

```ts
avatarImage?: string;
```

- Add `avatarImage` to each record in `src/lib/data/characters.json`, for example:

```json
{
  "id": "socrates",
  "name": "苏格拉底",
  "type": "person",
  "role": "核心论证者",
  "avatar": "苏",
  "avatarImage": "/avatars/characters/socrates.svg",
  "summary": "..."
}
```

**Step 4: Run test to verify it passes once assets exist**

Run: `node scripts/verify-character-avatar-data.mjs`
Expected: PASS with `Verified <n> character avatar records.` after Task 2 completes

**Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/data/characters.json scripts/verify-character-avatar-data.mjs
git commit -m "feat: define character avatar data contract"
```

### Task 2: Add local SVG avatar assets

**Files:**
- Create: `static/avatars/characters/socrates.svg`
- Create: `static/avatars/characters/alcibiades.svg`
- Create: `static/avatars/characters/aristophanes.svg`
- Create: `static/avatars/characters/agathon.svg`
- Create: `static/avatars/characters/phaedrus.svg`
- Create: `static/avatars/characters/pausanias.svg`
- Create: `static/avatars/characters/eryximachus.svg`
- Create: `static/avatars/characters/aristodemus.svg`
- Create: `static/avatars/characters/apollodorus.svg`
- Create: `static/avatars/characters/glaucon.svg`
- Create: `static/avatars/characters/diotima.svg`
- Create: `static/avatars/characters/eros.svg`
- Create: `static/avatars/characters/aphrodite.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Use the same validation script from Task 1 to fail on missing files.

**Step 2: Run test to verify it fails**

Run: `node scripts/verify-character-avatar-data.mjs`
Expected: FAIL with `Missing avatar asset ...`

**Step 3: Write minimal implementation**

Create one SVG per character following the approved visual rules:

- Bust only
- Side or 3/4 profile
- Terracotta / black / bone palette
- Minimal background
- Strong silhouette differences

Each SVG should be optimized, self-contained, and not depend on external fonts or linked assets.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add static/avatars/characters scripts/verify-character-avatar-data.mjs src/lib/data/characters.json
git commit -m "feat: add local symposium character avatars"
```

### Task 3: Render image avatars in the reading experience with fallback

**Files:**
- Modify: `src/lib/components/reading/dialogue-line.svelte`
- Modify: `src/lib/types.ts`
- Test: `src/lib/components/reading/dialogue-line.svelte`

**Step 1: Write the failing test**

Because the project has no test runner today, use an implementation-focused checklist and type verification:

- Add the image node in `dialogue-line.svelte` before fallback:

```svelte
<Avatar.Image src={speaker?.avatarImage} alt={speaker?.name ?? copy.unknownSpeaker} />
<Avatar.Fallback>{speaker?.avatar ?? '?'}</Avatar.Fallback>
```

This should initially fail type-checking if the `Character` type is not yet updated.

**Step 2: Run test to verify it fails**

Run: `npm run check`
Expected: FAIL with a TypeScript or Svelte error if `avatarImage` is not yet defined or is incorrectly typed

**Step 3: Write minimal implementation**

Update the reading avatar block to:

```svelte
<Avatar.Root class="size-8 border border-border/65 bg-secondary/38">
  {#if speaker?.avatarImage}
    <Avatar.Image
      src={speaker.avatarImage}
      alt={speaker.name}
      class="object-cover"
    />
  {/if}
  <Avatar.Fallback>{speaker?.avatar ?? '?'}</Avatar.Fallback>
</Avatar.Root>
```

Keep `Avatar.Fallback` in place so broken or absent images still render the current letter fallback.

**Step 4: Run test to verify it passes**

Run: `npm run check`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/components/reading/dialogue-line.svelte src/lib/types.ts
git commit -m "feat: render speaker avatar images in reading view"
```

### Task 4: Render avatars in the character index page

**Files:**
- Modify: `src/routes/characters/+page.svelte`
- Modify: `src/lib/components/ui/avatar/avatar-image.svelte`
- Test: `src/routes/characters/+page.svelte`

**Step 1: Write the failing test**

Add avatar rendering markup to the character list entry. This should fail visual acceptance because the page currently has no avatar column and spacing will need adjustment.

Proposed markup:

```svelte
<Avatar.Root class="size-12 border border-border/60 bg-secondary/35">
  {#if character.avatarImage}
    <Avatar.Image src={character.avatarImage} alt={character.name} class="object-cover" />
  {/if}
  <Avatar.Fallback>{character.avatar}</Avatar.Fallback>
</Avatar.Root>
```

**Step 2: Run test to verify it fails**

Run: `npm run check`
Expected: PASS or FAIL depending on imports, but manual review should show missing layout integration until the row structure is adjusted

**Step 3: Write minimal implementation**

- Import the shared avatar primitive in `src/routes/characters/+page.svelte`
- Restructure each row so the avatar sits beside the text block without recreating the overly tall bottom action area
- If needed, add `object-cover` support or size tuning in `src/lib/components/ui/avatar/avatar-image.svelte`

**Step 4: Run test to verify it passes**

Run: `npm run check`
Expected: PASS

Manual check: open `/characters` and confirm avatars align, crop correctly, and text rhythm remains compact

**Step 5: Commit**

```bash
git add src/routes/characters/+page.svelte src/lib/components/ui/avatar/avatar-image.svelte
git commit -m "feat: add avatars to character index"
```

### Task 5: Verify degraded and missing-image behavior

**Files:**
- Modify: `scripts/verify-character-avatar-data.mjs`
- Test: `src/lib/components/reading/dialogue-line.svelte`
- Test: `src/routes/characters/+page.svelte`

**Step 1: Write the failing test**

Expand the validation script to assert the fallback character still exists even when `avatarImage` exists:

```js
if (character.avatar.trim().length !== 1) {
  throw new Error(`Fallback avatar should remain a single visible character for ${character.id}`);
}
```

**Step 2: Run test to verify it fails**

Run: `node scripts/verify-character-avatar-data.mjs`
Expected: FAIL if any fallback character was removed or malformed

**Step 3: Write minimal implementation**

- Normalize any malformed fallback characters in `src/lib/data/characters.json`
- Keep the UI rendering order as image first, fallback second, so runtime image failures degrade safely

**Step 4: Run test to verify it passes**

Run:
- `node scripts/verify-character-avatar-data.mjs`
- `npm run check`

Expected:
- PASS for the data verification script
- PASS for `npm run check`

**Step 5: Commit**

```bash
git add scripts/verify-character-avatar-data.mjs src/lib/data/characters.json src/lib/components/reading/dialogue-line.svelte src/routes/characters/+page.svelte
git commit -m "test: verify avatar fallback behavior"
```

### Task 6: Final smoke check and documentation touch-up

**Files:**
- Modify: `README.md`
- Test: `src/routes/reading/+page.svelte`
- Test: `src/routes/characters/+page.svelte`

**Step 1: Write the failing test**

Document the avatar asset contract in `README.md` only after confirming the UI behavior, including:

- asset directory
- JSON field meaning
- fallback behavior

Until this is written, the feature remains under-documented.

**Step 2: Run test to verify it fails**

Run manual smoke review:
- `npm run dev`
- Open `/reading`
- Open `/characters`

Expected: identify any clipping, blur mismatch, or overly aggressive cropping before documentation is finalized

**Step 3: Write minimal implementation**

Add a short section to `README.md` such as:

```md
## Character avatars

Character records may define `avatarImage` pointing to `/avatars/characters/<id>.svg`.
The existing `avatar` field remains the text fallback used when an image is absent or fails to load.
```

**Step 4: Run test to verify it passes**

Run:
- `node scripts/verify-character-avatar-data.mjs`
- `npm run check`

Expected: both PASS

**Step 5: Commit**

```bash
git add README.md
git commit -m "docs: document character avatar assets"
```
