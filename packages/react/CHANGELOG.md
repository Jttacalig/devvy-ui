# @devvy-ui/react

## 0.3.1

### Patch Changes

- Correct stable installation and font availability in package documentation after the
  verified 0.3.0 npm release. Remove stale current-version claims from package READMEs
  so published documentation does not recommend an older release. No runtime APIs change.
- Updated dependencies
  - @devvy-ui/core@0.3.1
  - @devvy-ui/styles@0.3.1

## 0.3.0

### Minor Changes

- Add optional DataTable row selection with controlled/uncontrolled ids, eligible page-level
  select-all, mixed states and application-owned bulk actions. Existing tables remain unchanged
  when rowSelection is omitted. Selection uses native checkboxes without a new runtime dependency.

### Patch Changes

- Use a generic dialog heading container so dialogs placed inside a site header do not
  introduce a nested banner landmark. Native modal behavior and heading labels are unchanged.
- Updated dependencies
- Updated dependencies
  - @devvy-ui/styles@0.3.0
  - @devvy-ui/core@0.3.0

## 0.2.0

### Minor Changes

- Refine scoped menu surfaces, menubar navigation and native Tab dismissal; preserve cancelled form resets. Improve tree/gallery labels, virtual-list contrast, viewport tooltips, Calendar formatter reuse and codec fallbacks. Add optional ChartInspector with keyboard inspection and native SVG composition without a chart runtime.

- Complete the 100-component source inventory with 50 typed components for overlays, selection, dates, uploads, navigation, data, media, safe Markdown editing and application workflows. Include focused imports, source dependency/helper snapshots, native form and keyboard behavior, interactive API documentation and a redesigned landing page built from DEVVY UI. Preserve existing APIs and optional Glass. Prepare the maintainer-requested 0.2.0 release for the npm latest channel; publication and verification status are recorded separately.
- d131ba9: Add 29 typed components for layout, native forms, disclosure, tables, measurements and feedback, bringing the primary inventory to 50. Include focused exports, theme styles, interactive documentation, SSR/hydration and native interaction coverage. Resolve complete copied-source dependency closures with unknown/cycle checks so composed components install independently. Existing component APIs and optional Glass remain intact; no new runtime dependency is added.
- a619ecb: Add optional DEVVY GLASS material CSS, adaptive quality, reusable Dialog and Dock,
  source registry entries, and an interactive /ui/glass material lab. Preserve ordinary
  DEVVY styling when the material is not opted into. Alpha publication remains pending.
- 525cfe3: Add native Select, Alert, Progress and Skeleton with focused exports, copied-source installation, theme styles and interactive documentation. Preserve native selection/form semantics, normalize progress values and respect reduced-motion preferences. Centralize component inventory and verify every registry helper and stylesheet against canonical sources.
- a619ecb: Add original SVG Chart (bar, line, area and donut), responsive Navbar, composable Sidebar
  and Breadcrumbs. All entries support package imports and copied source. Include themed
  styles, documentation, sample-data previews and native chart data disclosures.
- dda1902: Production-grade audit and quality gates milestone:
  - Tri-browser Playwright test matrix verification across Chromium, Firefox, and WebKit (135/135 tests passing).
  - Cross-browser native select keyboard interactions and test timeout resilience.
  - Complete documentation UI overhaul powered directly by DEVVY UI canonical components (Card, Badge, Separator, Button, Input).
  - Verified zero axe accessibility violations in light and dark modes across all 17 component pages and playground.
  - Verified consumer fixture compatibility on React 18.3.1 and React 19.3.1 with packaged tarballs.

### Patch Changes

- Updated dependencies
- Updated dependencies [d131ba9]
- Updated dependencies [a619ecb]
- Updated dependencies [525cfe3]
- Updated dependencies [a619ecb]
- Updated dependencies [dda1902]
  - @devvy-ui/styles@0.2.0
  - @devvy-ui/core@0.2.0

## 0.1.0-beta.2

### Minor Changes

- Add 29 typed components for layout, native forms, disclosure, tables, measurements and feedback, bringing the primary inventory to 50. Include focused exports, theme styles, interactive documentation, SSR/hydration and native interaction coverage. Resolve complete copied-source dependency closures with unknown/cycle checks so composed components install independently. Existing component APIs and optional Glass remain intact; no new runtime dependency is added.
- 525cfe3: Add native Select, Alert, Progress and Skeleton with focused exports, copied-source installation, theme styles and interactive documentation. Preserve native selection/form semantics, normalize progress values and respect reduced-motion preferences. Centralize component inventory and verify every registry helper and stylesheet against canonical sources.

### Patch Changes

- Updated dependencies
- Updated dependencies [525cfe3]
  - @devvy-ui/styles@0.1.0-beta.2
  - @devvy-ui/core@0.1.0-beta.2

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
- Updated dependencies [a619ecb]
- Updated dependencies
  - @devvy-ui/styles@0.1.0-beta.1
  - @devvy-ui/core@0.1.0-beta.1
