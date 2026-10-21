# DEVVY UI roadmap

The [100-component architecture and phased plan](docs/roadmap-100.md) preserves the existing
17 components and allocates 83 additions. The current foundation batch adds Select, Alert,
Progress and Skeleton, bringing the source inventory to 21. The remaining 79 are planned;
they are not shipped implementations. Release verification and manual review remain separate gates.

## Delivered alpha foundation

- [x] pnpm/Turbo workspace, exact dependencies, lockfile, strict types and package exports
- [x] Shared core, tokens, scoped themes and ordinary CSS
- [x] All ten first-release React components
- [x] Keyboard, axe, SSR, hydration and local installer checks
- [x] Next.js documentation, playground, Vite and vanilla CSS examples
- [x] Generated source registry and local init/add/doctor CLI
- [x] Size/SSR harness, bundle budgets and external comparator fixture
- [x] Changesets, CI configuration, release preflight and contributor files

- [x] Original bar/line/area/donut chart views with HTML data tables
- [x] Responsive Navbar, composable Sidebar and Breadcrumbs
- [x] Paper-and-ink docs theme and live component previews
- [x] Tri-browser verification (Chromium, Firefox, WebKit: 135/135 tests passing)
- [x] Documentation UI overhaul with native DEVVY UI components
- [x] Pre-release version progression to beta (`0.1.0-beta.1`) via Changesets

## Before a public beta release

- [ ] Run public GitHub CI and review artifacts, including Linux Firefox results
- [ ] Complete manual NVDA/VoiceOver, zoom, forced-colors and RTL review
- [ ] Verify namespace ownership, logo rights, release contacts and dependency licenses
- [ ] Configure protected branches, private reporting, secret scanning and npm-alpha reviewers
- [ ] Record idle-hardware benchmark baselines with browser timing experiments
- [ ] Publish signed/provenance-backed alpha packages and confirm clean consumer installs
- [ ] Integrate /ui into Dev Station hosting with separate Next asset routing

## Next component cycle

DEVVY GLASS, Dialog and Dock are implemented as alpha enhancements. Complete their
manual assistive-technology and target-device checks before promoting them to stable.

Dropdown Menu, Tooltip, Popover, Accordion, Toast, Drawer and Navigation Menu.
Each needs an interaction specification, focus/overlay review and browser/assistive-tech tests
before shipping. Proven accessible primitives can be evaluated for complex overlays.

## Later work

Data Table, Combobox, Date Picker, Calendar, Command Palette, Virtualized List, File Upload
and richer forms. Vue, Svelte and Web Components adapters follow demonstrated core reuse.
Investigate older React only if demand justifies explicit IDs and extra compatibility costs.
Add versioned documentation channels when multiple releases exist. Stable release dates are not promised.
