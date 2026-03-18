# Scrollbar Restyle Design

**Date:** 2026-03-18  
**Status:** Approved

## Goal

Restyle the project's scrollbars so they feel visually consistent with the site's warm, restrained reading aesthetic instead of falling back to mismatched system defaults.

## Problem

The project currently relies on native browser scrollbar styling:

- the main page scrollbar looks detached from the site's palette
- internal scroll areas such as annotation panels and filter dropdowns inherit the same default look
- the current interface uses warm neutrals, muted borders, and restrained motion, while the scrollbar remains visually generic

## Approved Direction

Use a `low-profile unified` scrollbar style.

This means:

- narrow scrollbar width
- rounded thumb
- very light track
- subtle contrast by default
- slightly stronger thumb on hover
- no glow, no heavy gradients, no high-chroma accents

## Visual Language

The scrollbar should feel like part of the reading surface:

- track should sit close to `background / muted`
- thumb should sit close to `border / muted-foreground`
- hover state can lean slightly toward `primary`, but only enough to improve discoverability
- both light and dark themes should stay on the same warm neutral axis already used by the project

## Scope

The styling applies globally so it covers:

- the main document scrollbar
- annotation panel scroll areas
- scene filter and speaker filter dropdown lists
- any future internal `overflow-auto` or `overflow-y-auto` regions

## Browser Strategy

Use a pragmatic cross-browser approach:

- Firefox: `scrollbar-width` and `scrollbar-color`
- Chromium/WebKit: `::-webkit-scrollbar`, `::-webkit-scrollbar-thumb`, `::-webkit-scrollbar-track`

The styling should degrade safely when a browser ignores part of the implementation.

## Motion

Only a minimal color transition is needed on the thumb hover state.

Do not animate scrollbar size or add decorative effects.

## Accessibility

- keep the thumb visible enough to discover
- do not make the scrollbar too thin to grab comfortably
- preserve contrast in dark mode
- keep hover as enhancement, not the only visible state

## Non-Goals

This change does not:

- add custom JavaScript scrollbar behavior
- hide scrollbars by default
- create page-specific scrollbar themes
- replace the native scrollbar with a faux component

## Approved Outcome

The site gets one global scrollbar treatment that is quieter, warmer, and more aligned with the reading theme while remaining native, lightweight, and usable.
