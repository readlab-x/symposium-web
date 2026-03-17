# Homepage Thesis Card Speaker Filter Design

**Date:** 2026-03-17  
**Status:** Approved

## Goal

When a user clicks one of the four thesis cards in the homepage section `四种推进`, the app should open the reading view with the speaker filter preselected to that corresponding speaker only.

## Approved Approach

Use URL-based filter presets.

Each thesis card links to the reading route with a `speakers` query parameter:

- `斐德罗` -> `/reading?speakers=phaedrus`
- `阿里斯托芬` -> `/reading?speakers=aristophanes`
- `狄奥提玛` -> `/reading?speakers=diotima`
- `苏格拉底` -> `/reading?speakers=socrates`

The reading page reads this query parameter during initialization and uses it to set `activeSpeakerIds`.

## Why URL-Based Presets

This was chosen over temporary navigation state because it preserves behavior across:

- page refresh
- opening in a new tab
- copying and sharing the link
- browser back/forward navigation

It also keeps the feature small and easy to reason about.

## Behavior

### Homepage

- Only the four thesis cards in the homepage use the preset speaker filter URLs.
- Other homepage entry links keep their current behavior and do not force filters.

### Reading Page

- If `speakers` is absent, the page keeps the current default behavior: all speakers selected.
- If `speakers` contains one or more valid speaker IDs, only those speakers are selected initially.
- If `speakers` contains invalid IDs only, the page falls back to the default all-speakers state.
- After page load, the user can still change the speaker filter manually as usual.

## Data Contract

The `speakers` query parameter is a comma-separated list of speaker IDs.

Examples:

- `/reading?speakers=phaedrus`
- `/reading?speakers=socrates,diotima`

For this homepage feature, only single-speaker presets are needed, but the reading-page parser should support multiple IDs so the URL format remains extensible.

## Implementation Shape

Create a small pure helper for reading speaker query presets:

- parse a `speakers` query string
- keep only valid speaker IDs
- preserve the order from the query
- return the default speaker list when no valid preset is present

Then:

- update homepage thesis card URLs to include the corresponding preset
- initialize the reading page filter state from the parsed URL value

## Verification

The change is correct when:

1. Clicking each homepage thesis card opens `/reading` with only the corresponding speaker checked.
2. Opening `/reading` directly still shows all speakers selected.
3. Manually editing the URL to an invalid speaker ID does not break the page and falls back to all speakers.

## Non-Goals

This change does not:

- add deep links to specific dialogue lines
- change the speaker filter UI
- change other homepage entry links
- introduce server-side data loading
