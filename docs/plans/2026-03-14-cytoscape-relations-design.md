# Cytoscape Relations Graph Design

**Date:** 2026-03-14

**Goal:** Replace the current static relation SVG scaffold with a real interactive graph powered by Cytoscape.js, while preserving the site's restrained academic-exhibition tone.

## Product Context

- Audience: university classrooms and researchers.
- Primary use: browse and inspect character relationships inside *Symposium* as a supporting research surface.
- Constraint: the graph should feel usable and legible, not like a technical demo or a flashy network-visualization product.
- Constraint: V1 should stay focused on the relations page only.

## Current Problem

The existing `/relations` page already presents nodes and edges, but it is still a hand-positioned SVG scaffold:

- node coordinates are manually authored in JSON
- interaction is limited to static click selection
- graph layout is not truly graph-native
- panning, zooming, dragging, and graph-level interaction do not exist

This means the page suggests a relation graph without yet behaving like one.

## Chosen Direction

Adopt **Cytoscape.js** for the graph layer and use its common, conventional setup for V1:

- Cytoscape-managed graph canvas
- built-in layout algorithm
- panning, zooming, dragging
- click-to-select node behavior
- stylesheet-driven node and edge states

The first version should use Cytoscape in a straightforward way rather than trying to heavily customize it from day one. Theme alignment should come from restrained color, opacity, spacing, and emphasis choices, not from over-designed graph chrome.

## Why Cytoscape.js

Compared with continuing the current SVG scaffold, Cytoscape.js gives the project a real graph engine:

- built-in layout support
- stable selection and neighborhood traversal
- easier future extension for filters, focus modes, and graph interactions
- less custom interaction code than a D3-first approach

Compared with a D3 force graph, Cytoscape.js is the faster path to a usable V1 and reduces implementation risk.

## V1 Scope

### In Scope

- replace the current static SVG relation component
- render graph nodes and edges through Cytoscape.js
- convert existing relation JSON into Cytoscape elements
- support drag, pan, zoom, and node selection
- highlight the selected node, adjacent nodes, and adjacent edges
- update the right-side detail panel from the active node
- clear selection when clicking empty graph space
- keep the current page structure and academic visual tone

### Out of Scope

- cross-page graph entry points from reading or character pages
- advanced graph filters
- grouping, clustering, or collapse/expand behaviors
- custom HTML node renderers
- complex edge-label choreography
- graph editing

## Data Strategy

V1 should continue using `src/lib/data/relations.json` as the source of truth.

The graph component will transform that data into Cytoscape elements:

- each relation node becomes a Cytoscape node with `id`, `label`, `type`, and `summary`
- each edge becomes a Cytoscape edge with `id`, `source`, `target`, and `relation`

The current manually-authored `x` and `y` fields should no longer drive rendering. They may remain temporarily for compatibility, but the Cytoscape layout should become authoritative.

## Layout Strategy

The first implementation should use a standard Cytoscape layout rather than a custom arrangement.

Recommended initial layout: `cose`

Reasoning:

- common, well-supported Cytoscape usage
- suitable for a small relation graph
- gives a clearly graph-like arrangement without requiring manual coordinates

If the result feels too scattered or too technically expressive, the next candidate should be `breadthfirst` or `concentric`, but V1 should start with `cose`.

## Interaction Model

### Default State

- graph is visible inside the existing left-side panel
- all nodes are shown
- edges are visible but low-emphasis
- no node is selected unless an initial default is explicitly retained

### Node Selection

When the user clicks a node:

- that node becomes the active node
- adjacent nodes move into a secondary highlighted state
- connected edges increase in contrast and weight
- the right-side panel shows the active node summary and connected relations

### Background Click

When the user clicks graph background:

- active selection clears
- graph returns to base state
- detail panel falls back to its empty or default prompt

### Direct Manipulation

Users may:

- pan the graph
- zoom the graph
- drag individual nodes

These are acceptable V1 behaviors because they are part of standard Cytoscape usage and help the graph feel genuinely interactive.

## Visual Direction

The graph should stay aligned with the project's existing design context:

- warm paper-like surfaces in light mode
- muted, low-saturation contrast
- no tech-glow, neon, or futuristic graph styling
- emphasis should come from clarity, not spectacle

### Nodes

- person nodes and deity nodes may remain color-distinguished
- default node surfaces should stay calm
- active nodes should use stronger contrast and slightly heavier edge treatment
- adjacent nodes should be noticeable but subordinate to the active node

### Edges

- default edges should be quiet and slightly translucent
- connected edges should become darker or more opaque when selected
- edge labels may remain minimal and should not dominate the graph

### Motion

Use Cytoscape defaults and lightweight transition behavior where available, but do not force elaborate graph animation. The graph should feel responsive and calm.

## Page Composition

The `/relations` page should keep its current overall structure:

- left: graph canvas
- right: detail panel

This preserves continuity with the current information architecture and limits the scope of the upgrade to the graph layer itself.

## Technical Structure

Expected implementation structure:

- replace `src/lib/components/relations/relation-graph.svelte`
- keep `src/routes/relations/+page.svelte` as the page orchestrator
- introduce a small helper module for Cytoscape element mapping and style config so behavior can be tested without relying on DOM-heavy integration tests

## Testing Strategy

V1 should favor testable pure helpers around the Cytoscape integration:

- test relation-data to Cytoscape-element conversion
- test style/state helper output where practical
- verify page and component typing through `npm run check`
- verify production build through `npm run build`

Manual smoke verification should confirm:

- graph renders
- node click updates selection
- background click clears selection
- detail panel syncs correctly
- zoom and drag do not break layout or readability

## Success Criteria

- `/relations` behaves like a real interactive graph rather than a static diagram
- graph interactions feel usable immediately with standard Cytoscape behavior
- the graph remains consistent with the site's restrained academic tone
- the detail panel remains synchronized with node selection
- the implementation leaves room for later filters and cross-page graph entry points
