# Character Avatar PNG Regeneration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace all 13 Symposium character avatar assets with a new PNG portrait set while preserving the existing single-character fallback behavior.

**Architecture:** Keep the runtime avatar components unchanged and move the migration into static assets plus the data contract. Regenerate one character at a time, store the production PNG under `static/avatars/characters/`, update only that character's `avatarImage` to `.png`, and verify the completed character with a targeted validation mode before running a final full-set pass.

**Tech Stack:** SvelteKit 2, Svelte 5, TypeScript, Bits UI Avatar, static PNG assets in `static/`, JSON data in `src/lib/data`, Node `fs/path` validation script, verification via `node scripts/verify-character-avatar-data.mjs` and `npm run check`.

---

### Task 1: Add targeted PNG validation and regenerate `socrates`

**Files:**
- Modify: `scripts/verify-character-avatar-data.mjs`
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/socrates.png`
- Delete: `static/avatars/characters/socrates.svg`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id socrates
```

**Step 2: Run test to verify it fails**

Expected: FAIL because the record still points to `.svg` and the script does not yet validate per-character PNG output.

**Step 3: Write minimal implementation**

Update `scripts/verify-character-avatar-data.mjs` so it:

- accepts `--id <characterId>`
- validates only the selected character when `--id` is present
- requires `avatarImage` to end with `/avatars/characters/<id>.png`
- reads the PNG header and asserts `width === 512` and `height === 512`
- keeps the existing single-character fallback validation

Implementation shape:

```js
const args = process.argv.slice(2);
const idIndex = args.indexOf("--id");
const targetId = idIndex >= 0 ? args[idIndex + 1] : null;

const selectedCharacters = targetId
  ? characters.filter((character) => character.id === targetId)
  : characters;

if (targetId && selectedCharacters.length === 0) {
  throw new Error(`Unknown character id: ${targetId}`);
}

for (const character of selectedCharacters) {
  if (!character.avatarImage.endsWith(`/${character.id}.png`)) {
    throw new Error(`avatarImage must point to /avatars/characters/${character.id}.png`);
  }

  const imagePath = path.join(publicRoot, character.avatarImage.replace(/^\//, ""));
  const buffer = fs.readFileSync(imagePath);
  if (buffer.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`Avatar asset is not a PNG for ${character.id}`);
  }

  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  if (width !== 512 || height !== 512) {
    throw new Error(`Avatar PNG must be 512x512 for ${character.id}, got ${width}x${height}`);
  }
}
```

Then:

- create `static/avatars/characters/socrates.png` as a 512x512 production PNG
- update the `socrates` record to `/avatars/characters/socrates.png`
- delete `static/avatars/characters/socrates.svg`

**Step 4: Run test to verify it passes**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id socrates
```

Expected: PASS with `Verified 1 character avatar record.`

**Step 5: Commit**

```bash
git add scripts/verify-character-avatar-data.mjs src/lib/data/characters.json static/avatars/characters/socrates.png static/avatars/characters/socrates.svg
git commit -m "feat: regenerate socrates avatar as png"
```

### Task 2: Regenerate `alcibiades`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/alcibiades.png`
- Delete: `static/avatars/characters/alcibiades.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id alcibiades
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `alcibiades` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/alcibiades.png`, update `src/lib/data/characters.json` to `/avatars/characters/alcibiades.png`, and delete `static/avatars/characters/alcibiades.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id alcibiades`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/alcibiades.png static/avatars/characters/alcibiades.svg
git commit -m "feat: regenerate alcibiades avatar as png"
```

### Task 3: Regenerate `aristophanes`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/aristophanes.png`
- Delete: `static/avatars/characters/aristophanes.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id aristophanes
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `aristophanes` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/aristophanes.png`, update `src/lib/data/characters.json` to `/avatars/characters/aristophanes.png`, and delete `static/avatars/characters/aristophanes.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id aristophanes`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/aristophanes.png static/avatars/characters/aristophanes.svg
git commit -m "feat: regenerate aristophanes avatar as png"
```

### Task 4: Regenerate `agathon`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/agathon.png`
- Delete: `static/avatars/characters/agathon.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id agathon
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `agathon` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/agathon.png`, update `src/lib/data/characters.json` to `/avatars/characters/agathon.png`, and delete `static/avatars/characters/agathon.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id agathon`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/agathon.png static/avatars/characters/agathon.svg
git commit -m "feat: regenerate agathon avatar as png"
```

### Task 5: Regenerate `phaedrus`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/phaedrus.png`
- Delete: `static/avatars/characters/phaedrus.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id phaedrus
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `phaedrus` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/phaedrus.png`, update `src/lib/data/characters.json` to `/avatars/characters/phaedrus.png`, and delete `static/avatars/characters/phaedrus.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id phaedrus`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/phaedrus.png static/avatars/characters/phaedrus.svg
git commit -m "feat: regenerate phaedrus avatar as png"
```

### Task 6: Regenerate `pausanias`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/pausanias.png`
- Delete: `static/avatars/characters/pausanias.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id pausanias
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `pausanias` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/pausanias.png`, update `src/lib/data/characters.json` to `/avatars/characters/pausanias.png`, and delete `static/avatars/characters/pausanias.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id pausanias`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/pausanias.png static/avatars/characters/pausanias.svg
git commit -m "feat: regenerate pausanias avatar as png"
```

### Task 7: Regenerate `eryximachus`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/eryximachus.png`
- Delete: `static/avatars/characters/eryximachus.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id eryximachus
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `eryximachus` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/eryximachus.png`, update `src/lib/data/characters.json` to `/avatars/characters/eryximachus.png`, and delete `static/avatars/characters/eryximachus.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id eryximachus`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/eryximachus.png static/avatars/characters/eryximachus.svg
git commit -m "feat: regenerate eryximachus avatar as png"
```

### Task 8: Regenerate `aristodemus`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/aristodemus.png`
- Delete: `static/avatars/characters/aristodemus.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id aristodemus
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `aristodemus` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/aristodemus.png`, update `src/lib/data/characters.json` to `/avatars/characters/aristodemus.png`, and delete `static/avatars/characters/aristodemus.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id aristodemus`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/aristodemus.png static/avatars/characters/aristodemus.svg
git commit -m "feat: regenerate aristodemus avatar as png"
```

### Task 9: Regenerate `apollodorus`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/apollodorus.png`
- Delete: `static/avatars/characters/apollodorus.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id apollodorus
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `apollodorus` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/apollodorus.png`, update `src/lib/data/characters.json` to `/avatars/characters/apollodorus.png`, and delete `static/avatars/characters/apollodorus.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id apollodorus`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/apollodorus.png static/avatars/characters/apollodorus.svg
git commit -m "feat: regenerate apollodorus avatar as png"
```

### Task 10: Regenerate `glaucon`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/glaucon.png`
- Delete: `static/avatars/characters/glaucon.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id glaucon
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `glaucon` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/glaucon.png`, update `src/lib/data/characters.json` to `/avatars/characters/glaucon.png`, and delete `static/avatars/characters/glaucon.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id glaucon`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/glaucon.png static/avatars/characters/glaucon.svg
git commit -m "feat: regenerate glaucon avatar as png"
```

### Task 11: Regenerate `diotima`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/diotima.png`
- Delete: `static/avatars/characters/diotima.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id diotima
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `diotima` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/diotima.png`, update `src/lib/data/characters.json` to `/avatars/characters/diotima.png`, and delete `static/avatars/characters/diotima.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id diotima`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/diotima.png static/avatars/characters/diotima.svg
git commit -m "feat: regenerate diotima avatar as png"
```

### Task 12: Regenerate `eros`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/eros.png`
- Delete: `static/avatars/characters/eros.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id eros
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `eros` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/eros.png`, update `src/lib/data/characters.json` to `/avatars/characters/eros.png`, and delete `static/avatars/characters/eros.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id eros`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/eros.png static/avatars/characters/eros.svg
git commit -m "feat: regenerate eros avatar as png"
```

### Task 13: Regenerate `aphrodite`

**Files:**
- Modify: `src/lib/data/characters.json`
- Create: `static/avatars/characters/aphrodite.png`
- Delete: `static/avatars/characters/aphrodite.svg`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs --id aphrodite
```

**Step 2: Run test to verify it fails**

Expected: FAIL because `aphrodite` still points to `.svg`.

**Step 3: Write minimal implementation**

Create `static/avatars/characters/aphrodite.png`, update `src/lib/data/characters.json` to `/avatars/characters/aphrodite.png`, and delete `static/avatars/characters/aphrodite.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs --id aphrodite`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/data/characters.json static/avatars/characters/aphrodite.png static/avatars/characters/aphrodite.svg
git commit -m "feat: regenerate aphrodite avatar as png"
```

### Task 14: Complete the full PNG migration verification

**Files:**
- Modify: `src/lib/data/characters.json`
- Test: `scripts/verify-character-avatar-data.mjs`

**Step 1: Write the failing test**

Run:

```bash
node scripts/verify-character-avatar-data.mjs
```

**Step 2: Run test to verify it fails**

Expected: FAIL until every record points to `.png` and every matching PNG exists at `512x512`.

**Step 3: Write minimal implementation**

Make sure all 13 `avatarImage` values point to `/avatars/characters/<id>.png` and no record still references `.svg`.

**Step 4: Run test to verify it passes**

Run: `node scripts/verify-character-avatar-data.mjs`
Expected: PASS with `Verified 13 character avatar records.`

**Step 5: Commit**

```bash
git add src/lib/data/characters.json
git commit -m "refactor: complete avatar png migration"
```

### Task 15: Final smoke check and documentation touch-up

**Files:**
- Modify: `README.md`
- Test: `src/lib/components/reading/dialogue-line.svelte`
- Test: `src/routes/characters/+page.svelte`

**Step 1: Write the failing test**

Document the final PNG asset contract in `README.md` only after confirming both pages still render avatars correctly.

**Step 2: Run test to verify it fails**

Run:

- `npm run check`
- `npm run dev`

Manual smoke review:

- open `/reading`
- open `/characters`

Expected: catch any broken asset path, clipping issue, or fallback regression before documentation is finalized.

**Step 3: Write minimal implementation**

Add a short section to `README.md` such as:

```md
## Character avatars

Character records define `avatarImage` as `/avatars/characters/<id>.png`.
The existing `avatar` field remains the text fallback used when an image is absent or fails to load.
Production assets are 512x512 PNG files stored in `static/avatars/characters/`.
```

**Step 4: Run test to verify it passes**

Run:

- `node scripts/verify-character-avatar-data.mjs`
- `npm run check`

Expected: both PASS, and `/reading` plus `/characters` should show the new PNG portraits.

**Step 5: Commit**

```bash
git add README.md
git commit -m "docs: document character avatar png assets"
```
