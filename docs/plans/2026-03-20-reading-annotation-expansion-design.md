# Reading Annotation Expansion Design

**Date:** 2026-03-20  
**Status:** Approved

## Goal

Substantially expand the reading desk annotations so the text supports richer study from multiple angles instead of only highlighting a few famous moments.

## Current Problem

The current annotation set is too sparse:

- only `12` annotations exist for `73` dialogue lines
- many major conceptual transitions have no note at all
- the annotation panel feels thin outside a few already-famous passages
- the site does not yet support the kind of sustained reading the project now invites

## Approved Direction

Use a `heavy annotation` pass.

This means:

- increase annotation density to roughly `35-45` total notes
- cover the full arc of the dialogue instead of only isolated highlights
- keep the existing annotation schema and UI
- expand breadth, not just quantity

## Content Axes

The expanded annotations should cover five complementary dimensions:

1. **Historical background**
   - symposium customs
   - banquet rules
   - flute-girl, wreaths, drinking order, male social setting

2. **Philosophical concepts**
   - eros
   - lack and desire
   - heavenly/common love
   - harmony
   - daimon
   - immortality
   - Beauty itself

3. **Rhetoric and dramatic structure**
   - framed narration
   - speech order
   - encomium vs dialectic
   - Alcibiades' entrance as a structural turn

4. **Translation and terminology**
   - words or ideas that are easy to flatten in translation
   - terms such as `eros`, `daimon`, `metaxu`, `kalon`, and related philosophical distinctions

5. **Intertext and reception**
   - links to Platonic themes elsewhere
   - later reception of "Platonic love"
   - interpretive framing for Socrates and Diotima

## Data Model

Keep the current annotation model unchanged:

- `background`
- `term`
- `translation`
- `cross-reference`

This change is content-heavy, not schema-heavy. The "many-sided" quality comes from better note selection and tagging, not from introducing new annotation types.

## Coverage Strategy

The new annotations should be distributed across the whole dialogue, with heavier emphasis on these sections:

### Opening frame and banquet setup

- `line-001` to `line-022`
- narration chain
- memory and retelling
- symposium rules and social context

### Early speeches

- `line-023` to `line-041`
- Phaedrus on honor and sacrifice
- Pausanias on the two loves
- Eryximachus on medicine, harmony, and order
- Aristophanes on divided humans

### Agathon and Socratic reversal

- `line-042` to `line-050`
- praise as rhetoric
- Socratic questioning
- shift from ornament to definition

### Diotima's teaching

- `line-051` to `line-060`
- daimon
- lack and desire
- immortality through generation
- the ladder of love
- Beauty itself

### Alcibiades and the ending

- `line-061` to `line-073`
- drunken entrance
- Silenus and Marsyas
- Socrates as lived testimony
- comedy and tragedy at dawn

## Source Strategy

The notes should be synthesized from reputable secondary and reference sources rather than copied from commentaries verbatim.

Preferred source classes:

- Stanford Encyclopedia of Philosophy
- Internet Encyclopedia of Philosophy
- major museum / educational essays on the Greek symposium
- strong scholarly reviews or reference essays

The notes should remain brief, reading-friendly, and integrated into the existing interface.

## Writing Style

Each annotation should:

- stay concise enough for sidebar reading
- explain why the line matters
- avoid over-quoting source language
- privilege interpretive usefulness over display of scholarship
- remain readable for both general readers and philosophy students

## i18n Requirement

Every new annotation must ship with:

- Chinese source content in `annotations.json`
- English title and content in `annotationEnglishById`
- English translations for any new tags used by the annotation

The expansion is incomplete unless both languages remain fully covered.

## Non-Goals

This pass does not:

- redesign the annotation panel UI
- add scholarly citations directly into the visible annotation cards
- add footnote numbering in the reading text
- introduce new annotation types
- turn the sidebar into a full academic commentary

## Approved Outcome

The reading desk becomes substantially more useful as a study surface: annotations become denser, broader, and more varied, while staying within the current UI and data model.
