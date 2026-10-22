# @devvy-ui/styles

Ordinary, namespaced CSS with no runtime styling dependency. Import
`@devvy-ui/tokens/theme.css` followed by `@devvy-ui/styles` once in your app.
The old `@devvy-ui/react/styles.css` path remains available.

DEVVY GLASS is optional: import `@devvy-ui/styles/glass.css` after the base styles and
scope it with `<Glass>` or `data-devvy-material="glass"`. It is not included in the default
entry. See docs/glass.md for material tokens and opaque/accessibility fallbacks.

The 0.2.0 Stable release styles all 100 primary components, including overlays, data and media.
Focused JavaScript imports share this stylesheet. Override scoped --dvy- variables and
dvy- classes after the base import; retain visible focus and reduced-effects fallbacks.
