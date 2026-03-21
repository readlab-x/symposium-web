# Header GitHub Link Design

**Goal:** Add a GitHub entry to the site header so users can jump from the application UI directly to the repository.

## Decision

Use an icon-only button in the header action group.

## Placement

- Put the GitHub entry in the right-side header controls.
- Keep it to the right of the theme toggle, matching the user's request.
- Preserve the existing order of language and theme controls.

## Interaction

- Render as an anchor, not a button, because it navigates to an external site.
- Open the repository in a new tab.
- Add `rel="noreferrer"` for the external link.
- Provide `title` and `aria-label` text for accessibility.

## Visual direction

- Reuse the existing circular control styling from the language and theme buttons.
- Use the Lucide GitHub icon so the control reads immediately without text.
- Keep the button compact so it does not crowd the header on smaller screens.

## URL

- `https://github.com/6iedog/symposium-web`

