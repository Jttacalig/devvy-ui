# @devvy-ui/styles

## 0.1.0-beta.2

### Minor Changes

- Add 29 typed components for layout, native forms, disclosure, tables, measurements and feedback, bringing the primary inventory to 50. Include focused exports, theme styles, interactive documentation, SSR/hydration and native interaction coverage. Resolve complete copied-source dependency closures with unknown/cycle checks so composed components install independently. Existing component APIs and optional Glass remain intact; no new runtime dependency is added.
- 525cfe3: Add native Select, Alert, Progress and Skeleton with focused exports, copied-source installation, theme styles and interactive documentation. Preserve native selection/form semantics, normalize progress values and respect reduced-motion preferences. Centralize component inventory and verify every registry helper and stylesheet against canonical sources.

### Patch Changes

- @devvy-ui/tokens@0.1.0-beta.2

## 0.1.0-beta.1

### Minor Changes

- a619ecb: Add optional DEVVY GLASS material CSS, adaptive quality, reusable Dialog and Dock,
  source registry entries, and an interactive /ui/glass material lab. Preserve ordinary
  DEVVY styling when the material is not opted into. Alpha publication remains pending.
- a619ecb: Add original SVG Chart (bar, line, area and donut), responsive Navbar, composable Sidebar
  and Breadcrumbs. All entries support package imports and copied source. Include themed
  styles, documentation, sample-data previews and native chart data disclosures.
- Production-grade audit and quality gates milestone:
  - Tri-browser Playwright test matrix verification across Chromium, Firefox, and WebKit (135/135 tests passing).
  - Cross-browser native select keyboard interactions and test timeout resilience.
  - Complete documentation UI overhaul powered directly by DEVVY UI canonical components (Card, Badge, Separator, Button, Input).
  - Verified zero axe accessibility violations in light and dark modes across all 17 component pages and playground.
  - Verified consumer fixture compatibility on React 18.3.1 and React 19.3.1 with packaged tarballs.

### Patch Changes

- Updated dependencies [a619ecb]
- Updated dependencies
  - @devvy-ui/tokens@0.1.0-beta.1
