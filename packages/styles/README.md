# @devvy-ui/styles

Ordinary, namespaced CSS with no runtime styling dependency. Import
`@devvy-ui/tokens/theme.css` followed by `@devvy-ui/styles` once in your app.
The old `@devvy-ui/react/styles.css` path remains available.

DEVVY GLASS is optional: import `@devvy-ui/styles/glass.css` after the base styles and
scope it with `<Glass>` or `data-devvy-material="glass"`. It is not included in the default
entry. See docs/glass.md for material tokens and opaque/accessibility fallbacks.

The 0.3.0 source release styles all 100 primary components, including overlays, data and media.
Focused JavaScript imports share this stylesheet. Override scoped --dvy- variables and
dvy- classes after the base import; retain visible focus and reduced-effects fallbacks.

## Optional fonts (0.3.0 source; not published on npm yet)

Import `@devvy-ui/styles/fonts/geist.css`, `fonts/manrope.css` or `fonts/geist-mono.css`
after the tokens and add the matching `data-devvy-font` to your theme container.
The optional `@devvy-ui/styles/fonts.css` entry declares all three. Base styles never load
font files. These self-hosted variable Latin WOFF2 assets retain SIL OFL 1.1 notices under
`fonts/`; they are not covered by the code's MIT license. See `fonts/README.md` for sources,
coverage and sizes. The published 0.2.0 package does not contain these new entries yet.
