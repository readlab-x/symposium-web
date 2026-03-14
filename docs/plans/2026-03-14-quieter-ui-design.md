# Huiyin Symposium Quieter UI Design

**Date:** 2026-03-14

**Goal:** Reduce the overall visual intensity of the site while keeping entity highlighting, research workflows, and the cultural context of the text legible and distinctive.

## Product Context

- Audience: university classrooms and researchers.
- Scope: entire site.
- Desired tone: academic exhibition.
- Constraint: the interface must stay useful for sustained reading and research, not drift into marketing-page styling.

## Design Direction

The site should feel like a curated scholarly reading desk: quiet, deliberate, and culturally grounded. The visual language should borrow from exhibition labels, annotated editions, and library reading rooms rather than generic SaaS dashboards.

This is not a move toward flat generic minimalism. It is a move toward restraint. The site should still carry atmosphere, but the atmosphere should sit behind the content instead of competing with it.

## Global Visual Principles

### Surface and Background

- Replace the current stronger page-wide gradient treatment with lighter paper-like surfaces.
- Use warm light neutrals in light mode and charcoal-brown neutrals in dark mode.
- Avoid pure white and pure black.
- Let major sections separate through subtle surface changes rather than heavy shadows.

### Color System

- Shift the global palette toward muted academic tones.
- Keep one restrained accent axis for interactive emphasis.
- Reserve stronger contrast for active states, links, selected content, and graph interaction.
- Reduce the number of simultaneous accent colors visible in any given view.

### Typography and Hierarchy

- Keep headings clear, but reduce visual heaviness.
- Let hierarchy come more from spacing, alignment, and rhythm than from bold weight alone.
- Keep body text optimized for long reading sessions.
- Shorten or tighten supporting descriptions where possible.

### Containers

- Flatten the interface where possible.
- Use lighter borders and lower-contrast separators.
- Remove unnecessary card-within-card feeling.
- Make panels feel like annotations, dossiers, or reading aids rather than dashboard widgets.

## Interaction Principles

### Navigation

- Reduce the button-like weight of the top navigation.
- Treat navigation more like restrained tabs or textual wayfinding.
- Keep the current page clearly active without making every nav item visually loud.

### Buttons and Inputs

- Limit the number of visually primary actions on screen.
- Use secondary, ghost, or text-forward treatments for most controls.
- Make inputs feel calm at rest and precise on focus.
- Keep filter controls fully usable, but visually lighter.

### Tags and Badges

- Reframe badges as lightweight index markers rather than chunky UI chips.
- Prefer subtle outlines or low-contrast fills.
- Use muted type-based color distinctions only where they help orientation.

### Highlighting

- Preserve highlighting for people, places, and other entities.
- Use restrained default highlighting in continuous reading.
- Favor low-saturation background tint, fine underline cues, or both.
- Increase intensity on hover, focus, selected line, and annotation-linked states.
- Allow relation graph and structural browsing views to use slightly stronger color than the main reading text.

### State Contrast

- Keep resting states quiet.
- Make meaningful interaction states explicit.
- Use emphasis when the user has asked for structure: hover, focus, selection, filtering, or graph activation.

## Page-Level Strategy

### Home

- Reduce hero-style emphasis.
- Present the page like an introduction to a reading environment.
- Keep the two main entry points, but lower button dominance.
- Present module information more like a directory or exhibit note than a feature-card wall.

### Reading

- Treat this as the visual anchor of the product.
- Keep the reading tools compact and secondary to the text.
- Make selection, annotation linkage, and entity highlighting the primary visual events.
- Make the annotation panel feel like a margin note or scholarly apparatus.

### Characters

- Move away from a generic card grid feeling.
- Present entries more like an index or catalog page.
- Use spacing and type hierarchy to separate records instead of relying on heavy containers.

### Themes

- Keep thematic grouping, but make each section feel like a research entry.
- Reduce repeated boxed quotation patterns.
- Make quoted lines feel like excerpts within a theme dossier.

### Relations

- Keep this page slightly more assertive than the others because it is a structure-browsing view.
- Keep the base canvas calm and let node selection create the main emphasis.
- Push color and contrast into active nodes, related edges, and the supporting detail panel.

### Search

- Make results feel like research retrieval rather than stacked marketing cards.
- Tighten result density slightly while preserving readability.
- Keep speaker, tags, and jump links obvious but understated.

## Non-Goals

- Do not remove entity highlighting.
- Do not erase the site's cultural personality.
- Do not turn every page into a flat grayscale tool.
- Do not weaken accessibility or interaction clarity in the name of subtlety.

## Success Criteria

- The site feels calmer and more refined at first glance.
- Researchers can still scan, filter, and jump quickly.
- Reading views feel less noisy over extended use.
- Entity highlighting remains useful without dominating the text.
- The full product feels coherent across home, reading, index, graph, and search views.
