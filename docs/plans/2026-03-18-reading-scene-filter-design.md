# Reading Scene Filter Design

**Date:** 2026-03-18  
**Status:** Approved

## Goal

Add a new scene filter to the reading desk so readers can narrow the dialogue by scene/section before applying the existing speaker filter. The new filter should appear to the left of the speaker filter in the reading header.

## Chosen Model

The new "scene" filter is based on the existing `chapter` field in `src/lib/data/dialogs.json`.

This was chosen over a place-based filter because `chapter` already provides a stable reading-oriented segmentation for every dialogue line, while place data is supplementary and does not map cleanly to the full text.

## Scene Options

The filter options are the twelve dialogue sections already present in the data:

- `开场问答`
- `赴宴途中`
- `宴前定题`
- `斐德罗发言`
- `鲍萨尼亚发言`
- `厄律克西马库发言`
- `阿里斯托芬发言`
- `阿伽松发言`
- `苏格拉底追问`
- `狄奥提玛教导`
- `阿尔基比亚德入席`
- `宴终尾声`

The scene filter should preserve this reading order instead of sorting alphabetically.

## Placement

In the reading header toolbar:

- `场景筛选` is placed on the left
- `人物筛选` remains on the right

The two controls should feel like one toolbar row on desktop. On smaller widths they may wrap, but the scene filter should still appear before the speaker filter.

## Interaction Model

The scene filter should reuse the same interaction pattern as the current speaker filter:

- rounded trigger button
- dropdown panel
- multi-select rows
- compact summary label
- `全选 / Select All` action

This keeps the reading toolbar consistent and avoids introducing a second filter style.

## Summary Labels

### Chinese

- all selected: `场景 · 全部`
- partial selection: `场景 · 2/12`

### English

- all selected: `Scenes · All`
- partial selection: `Scenes · 2/12`

## Filtering Behavior

The reading list is filtered by both controls together:

- first by active scenes
- then by active speakers

This is a logical `AND`, not `OR`.

A line is visible only when:

1. its `chapter` is one of the active scenes, and
2. its `speakerId` is one of the active speakers

## Selection Behavior

The current selected line behavior should remain stable:

- if the selected line is still visible after filtering, keep it selected
- if it is filtered out, jump to the first remaining visible line
- if no lines remain, clear the selection

## Initial State

For this first version:

- all scenes are selected by default
- all speakers keep their current initialization behavior
- the scene filter is local page state only
- scene selection is not stored in the URL yet

This keeps the feature small and predictable while matching the current manual filter model.

## Copy

### Chinese

- title: `按场景筛选`
- trigger label: `筛选场景`
- select all: `全选`

### English

- title: `Filter by Scene`
- trigger label: `Filter Scenes`
- select all: `Select All`

## Non-Goals

This change does not:

- add URL persistence for scenes
- change the annotation panel
- change the line data model
- reinterpret scenes as places
- add nested or grouped filter controls

## Approved Outcome

The reading desk gains a scene filter based on dialogue chapters. It sits to the left of the speaker filter, uses the same dropdown interaction style, and narrows the reading list in combination with speaker selection.
