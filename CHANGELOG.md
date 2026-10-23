# Changelog

## 0.3.1 — release documentation correction

- Corrected package READMEs that still described the previous stable release.
- Updated installation, optional font and DataTable selection availability guidance.
- Added server-side npm release discovery for the landing page, header, footer,
  installation labels and metadata. The site checks all six stable tags, caches successful
  results for five minutes and falls back safely during registry failures.
- No component implementations, public APIs, styles or runtime dependencies changed.

## 0.3.0 — GitHub source release

- Refined the full-width landing page with consistent DEVVY cards, restrained green accents,
  live component examples, responsive navigation and creator/repository links in the footer.
- Added Minimal, Modern and optional Glass styles independently of light/dark appearance,
  a dedicated auto-preview playground, consistent select controls and compact keyboard search.
- Added optional self-hosted Geist, Manrope and Geist Mono font entries with original OFL notices.
  Base component styles continue to use system fonts and do not download font assets.
- Added optional DataTable selection, eligible page-level select-all, controlled/uncontrolled
  state and application-owned bulk actions using native checkboxes. Corrected nested dialog
  heading landmarks without changing native modal behavior.
- Extended the separate, private MCP preview with eight read-only tools, version-matched
  tokens/examples/recipes, discoverable resources and reusable prompts. Published source remains
  pinned to npm 0.2.0; workspace requests are explicitly separate.
- Added protocol, malformed-input, response-bound, Inspector and standalone archive checks,
  plus setup guides for Codex, Claude Code, Cursor and VS Code.
- Recorded the selection feature's measured DataTable cost (about 1.97 KB gzip) and deliberately
  changed its focused limit from 1.8 KB to 2 KB. The overall 29 KB JavaScript cap is unchanged.
- Applied mechanical formatting to resolve existing CI formatting drift.

This release is GitHub source only. npm `latest` remains 0.2.0 and the MCP package remains
private; no npm publication or production deployment is implied. See
[release verification](docs/verification-030.md) for actual results and limits.

## 0.2.0 Stable — 23 October 2026

- Added the remaining 50 roadmap components: overlays, searchable selection, file/date
  controls, application navigation, data tables, media, Markdown editing and large collections.
- Refined menu focus and scoped themes, native reset cancellation, tree/gallery names,
  virtual-list contrast, Calendar formatting and codec fallbacks. Added a searchable directory
  and optional chart inspection without a chart dependency.
- Extended focused exports, types, registry dependency/helper closure and React consumers.
- Rebuilt the landing page around an interactive project workspace using DEVVY components.
- Published all six packages at 0.2.0 on npm latest; beta remains at 0.1.0-beta.2.
- Preserved existing focused bundle budgets and added a frozen first-50 baseline; full
  inventory growth is measured separately. No new runtime dependency was added.
- Refreshed contributor, AI, customization and release guidance. Proposed optional AI
  interface compositions use DEVVY primitives and application-owned provider callbacks.

See [completion verification](docs/verification-100.md). npm publication is verified;
production documentation deployment is separate. Historical notes below retain their
status at the time they were written.

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
