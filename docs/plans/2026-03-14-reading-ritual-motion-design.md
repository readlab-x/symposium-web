# Huiyin Symposium Reading Ritual Motion Design

**Date:** 2026-03-14

**Goal:** Add a high-presence motion system that makes the site feel ceremonious and alive, while preserving readability, mobile smoothness, and accessibility.

## Product Context

- Audience: university classrooms and researchers.
- Scope: entire site.
- Desired visual tone: academic exhibition.
- Desired motion tone: not restrained; strong and perceptible.
- Constraint: desktop and mobile must both remain smooth and usable.
- Constraint: motion must still respect `prefers-reduced-motion`.

## Motion Direction

The motion language should feel like a reading desk gradually coming to life. This is not a playful product animation system and not a tech-demo motion package. The energy should come from staged reveal, focus transfer, layered response, and editorial rhythm.

The reading experience remains the center of gravity. Other pages may move, but they should all feel like variations of one ritual: entering a text, bringing a passage into focus, and unfolding interpretation around it.

## Global Motion Principles

### One Main Choreography

There should be one clear signature behavior across the product: layered entrance choreography.

- Titles enter first.
- Controls and scaffolding enter second.
- primary content enters third.
- supporting interpretation enters last.

This keeps the site dramatic without making it noisy.

### Motion Hierarchy

- Reading actions receive the richest motion.
- Navigation and controls receive crisp feedback.
- Secondary pages support the reading journey rather than compete with it.

### Performance Strategy

- Favor `transform` and `opacity`.
- Avoid animating layout properties directly except where a controlled grid-row reveal is already in use.
- Reduce animation distance, delay count, and layering on smaller screens.
- Keep the strongest choreography for first paint, route entry, and deliberate interaction.

### Accessibility

- Respect `prefers-reduced-motion`.
- Reduced mode should keep very short fades and state clarity, but remove stagger, lift, drift, and dramatic transitions.

## Timing and Easing

### Easing

- Primary easing: `ease-out-quart`
- Secondary easing: `ease-out-expo`
- No bounce or elastic curves

### Timing Ranges

- Hover feedback: 120ms to 180ms
- Press/selection feedback: 140ms to 220ms
- Show/hide or reveal: 260ms to 380ms
- Panel or grouped content transitions: 360ms to 520ms
- Page entrance choreography: 550ms to 900ms

### Stagger Rules

- Use 80ms to 140ms stagger intervals for grouped entrances.
- Do not animate long lists in full. Only choreograph the first visible items, then let the rest remain static.

## Reading Page Motion Design

### Page Entrance

The reading page should establish the product's signature motion language.

- Heading appears first with fade and upward drift.
- Tools bar appears next with a slightly shorter delay.
- The first visible dialogue cards enter in a short stagger.
- Annotation panel enters last, as if interpretive apparatus arrives after the text.

### Line Selection

Selecting a line should feel like drawing it to the center of attention.

- The selected line gains a short lift and settle motion.
- Border, surface, and emphasis shift together.
- The change should feel spatial, not just chromatic.
- The annotation panel updates in sync with a slightly delayed response.

### Translation Reveal

Translation should feel like a second layer being drawn out from under the original.

- Keep the current structural reveal pattern.
- Add a slight fade and vertical drift to the revealed translation block.
- Introduce a subtle accent sweep on the leading edge so the reveal feels intentional.

### Entity Highlight Interaction

Entities should feel annotated rather than gamified.

- Rest state remains readable and relatively calm.
- Hover and focus increase tint and underline clarity.
- The tooltip enters with a light rise and fade.
- The motion should suggest research annotation being activated.

### Annotation Panel

The panel should feel like a scholarly margin note, not a hard refresh.

- Quoted source text changes first.
- Annotation items follow in a smaller staged reveal.
- The sequence should reinforce interpretation following text, not competing with it.

## Other Pages

### Home

- Use layered entrance choreography for heading, call-to-action row, and module index.
- Make the opening feel like an editorial frontispiece rather than app chrome loading in.

### Characters

- Use a subtle archive-index rhythm.
- Record rows or cards should lift slightly on hover and settle quickly.
- Entry transitions should feel like flipping into a catalog, not a marketing grid animation.

### Themes

- Theme groups enter first.
- Excerpt items enter second.
- Hover on excerpt lines should reinforce the jump link and connected metadata.

### Search

- Search input should have stronger focus feedback.
- Result appearance should feel fast and confident.
- Use tighter, quicker stagger than the reading page to preserve scanning speed.

### Relations

- This page can carry the strongest structural motion outside the reading page.
- Node hover, selected-node emphasis, and related-edge highlighting should be more visible than on other screens.
- The graph should feel responsive and interpretive, not decorative.

## Non-Goals

- Do not turn the site into a playful or whimsical UI.
- Do not overwhelm the reading flow with constant motion.
- Do not rely on large parallax or heavy full-screen effects.
- Do not add motion that delays interaction.

## Success Criteria

- The site feels significantly more alive on first load.
- Reading interactions feel staged and deliberate rather than abrupt.
- Entity interactions and annotation transitions feel richer and more legible.
- Other pages support the reading system with consistent motion vocabulary.
- Mobile still feels responsive and reduced-motion users still get a usable experience.
