# Changelog

## 0.2.0 — 100-component candidate

- Added the remaining 50 roadmap components: overlays, searchable selection, file/date
  controls, application navigation, data tables, media, Markdown editing and large collections.
- Refined menu focus and scoped themes, native reset cancellation, tree/gallery names,
  virtual-list contrast, Calendar formatting and codec fallbacks. Added a searchable directory
  and optional chart inspection without a chart dependency.
- Extended focused exports, types, registry dependency/helper closure and React consumers.
- Rebuilt the landing page around an interactive project workspace using DEVVY components.
- Prepared all six packages for stable 0.2.0 and the explicit npm latest publishing workflow.
- Preserved existing focused bundle budgets and added a frozen first-50 baseline; full
  inventory growth is measured separately. No new runtime dependency was added.
- Refreshed contributor, AI, customization and release guidance. Proposed optional AI
  interface compositions use DEVVY primitives and application-owned provider callbacks.

See [completion verification](docs/verification-100.md). Publication and deployment are
separate; historical notes below retain their status at the time they were written.

## 0.1.0-beta.2 — unpublished 50-component milestone

- Added Select, Alert, Progress and Skeleton, followed by 29 layout, native form, disclosure,
  table and feedback components. The canonical inventory now contains 50 of the planned 100.
- Added focused exports, typed APIs, interactive documentation and editable source for every addition.
- Source installation resolves complete component dependency graphs and protects edited files.
- Local verification: 84 unit/installer tests and 276 production browser checks; installed React
  18.3.1 and 19.3.1 consumers, build, types, lint, registry parity and bundle budgets passed.
- Advanced all six packages to `0.1.0-beta.2` using the fixed Changesets prerelease group.
  Landing, sidebar, header channel and footer labels now derive from package metadata.

See [midpoint verification](docs/verification-midpoint.md) for measurement scope and remaining
manual review. Packages remain unpublished; no stable release or production deployment is implied.

## 0.1.0-beta.1 — unreleased beta milestone

Production-grade audit and verified quality gates milestone:

- Tri-browser Playwright test matrix verification across Chromium, Firefox, and WebKit (135/135 tests passing).
- Cross-browser native select keyboard interactions and test timeout resilience.
- Complete documentation UI overhaul powered directly by DEVVY UI canonical components (`Card`, `Badge`, `Separator`, `Button`, `Input`).
- Verified zero axe accessibility violations in light and dark modes across all 17 component pages and playground.
- Verified consumer fixture compatibility on React 18.3.1 and React 19.3.1 with packaged beta tarballs.
- Pre-release version progression to `0.1.0-beta.1` across workspace packages via Changesets.

## Charts, navigation and paper website — unreleased

Added Chart with bar, line, area and donut views; Navbar, Sidebar and Breadcrumbs.
Includes individual package entries, source installation, API docs and working examples.
The documentation website now uses a warm paper-and-ink theme with neutral dark mode,
quieter surfaces and a shorter introduction, built from DEVVY UI components.
No new runtime dependency, npm release or production deployment. See docs/verification.md.

## DEVVY GLASS — unreleased alpha enhancement

Added optional glass CSS, an adaptive material scope, reusable native Dialog and Dock,
source registry entries, the /ui/glass live material lab and a Vite material toggle.
Conservative hardware hints, reduced transparency, reduced motion, forced colors and
opaque fallbacks keep the theme adaptable. No runtime dependency was added. Repository
metadata points to Jttacalig/devvy-ui; no npm publication or main-site deployment is claimed.

## 0.1.0-alpha.0 — unpublished development

21 October 2026: completed the React-first foundation from the supplied starter.
Added core/styles/registry/CLI packages; Textarea, Label, Checkbox, Switch and Tabs;
scoped tokens, native form interactions and loading buttons; Next.js docs and shared
Vite preview; supplied DEVVY logo; frozen dependency installation, tests, package checks,
benchmarks, Changesets and protected release-preflight configuration.

No stable release, public CI result, npm publication, manual accessibility certification
or future framework compatibility is claimed. See docs/verification.md for local evidence.
