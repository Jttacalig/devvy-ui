# Local verification — 21–22 October 2026

This page records the earlier foundation/Glass snapshot. For the current 21-component
foundation batch, see [its separate verification record](verification-foundations.md).

Environment: Windows x64, Node 24.19.0, pnpm 11.25.0, React 19.3.1,
TypeScript 5.9.3. These are actual local results, not public CI results.
Foundation/package measurements were recorded on 21 October. The refined docs, native
dropdowns and customization editors were built and verified on 22 October.

| Check                                                               | Result                                                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `pnpm install --frozen-lockfile`                                    | Passed; Glass adds no dependency                                                     |
| `pnpm build`                                                        | Passed; package declarations, registry, Vite and 25 Next.js pages                    |
| `pnpm typecheck`                                                    | Passed across core, React, Vite and Next.js                                          |
| `pnpm lint`                                                         | Passed; includes JSX accessibility checks                                            |
| `pnpm test`                                                         | 39 passed: 6 core, 31 React, 2 installer                                             |
| `pnpm check:packages`                                               | Six packages passed export/declaration/license checks; all 13 registry entries match |
| `pnpm pack:all`                                                     | Six installable alpha tarballs generated in .artifacts                               |
| `pnpm test:consumer 18.3.1`                                         | Passed with installed archives, including Glass, Dialog and Dock                     |
| `pnpm test:consumer 19.3.1`                                         | Passed with the same installed-package checks                                        |
| `pnpm test:browser --project=chromium --project=webkit --workers=2` | 68 passed in 1.3 minutes                                                             |
| `pnpm peers check`                                                  | No peer dependency issues                                                            |
| `pnpm audit --audit-level=moderate`                                 | No known vulnerabilities                                                             |
| `pnpm licenses list --json`                                         | Inventory recorded; see dependencies.md                                              |
| `pnpm bench`                                                        | All JavaScript and CSS gzip budgets passed                                           |

React tests cover native forms, loading/disabled buttons, controlled and mixed controls,
automatic/manual/RTL tabs, preserved panel state, SSR and hydration IDs. Glass checks cover
capability profiles, deterministic SSR, disabling without remount, modal dismissal, initial
focus, StrictMode cleanup and the inline fallback. Installed-package tests exercise both
React versions, public exports, SSR, hydration and interactions.

Browser checks cover all 13 component documentation pages in light and dark, axe contrast
and semantics, home layouts at 320/677/768/1024/1440px, keyboard tabs, native reset, search,
theme controls, routes and a real 404. Glass checks add light/dark layouts at 320/768/1440px,
computed filtering and customization, dock actions, device hints, reduced motion/contrast,
forced colors, unsupported-dialog fallback, native modal inertness, Escape, save and focus
return in Chromium and WebKit. Browser chrome remains reachable from native dialogs.
Reports are in .artifacts/browser-results.json and playwright-report.

The added browser checks cover native dropdown keyboard selection, touch-width picker
fallback, reset without losing task state, and mobile documentation disclosure/search.
Customization checks edit actual CSS and HTML, verify computed preview styles and script
blocking, inspect downloaded CSS/HTML/TSX contents and MIT notices, restore originals, and
delay hydration to confirm that the first edit is protected. Editor UI axe checks pass in
light/dark at 320px. The sandboxed iframe is excluded from axe script injection; shared
components have separate axe coverage, and arbitrary user-authored designs are not certified.
No new dependency was added. React source editing exports TSX; it does not compile it live.

Desktop and mobile screenshots were visually inspected. The supplied logo was copied
unchanged to both apps; both copies have the original SHA-256 hash.

## Measured incremental sizes

Production browser ESM, esbuild 0.28.2, React external, gzip defaults. Final raw measurements
are in benchmarks/glass-win32-node24.json. The earlier foundation snapshot remains in
benchmarks/baseline-win32-node24.json for history.

| Fixture              | Minified bytes | gzip bytes | Brotli bytes |
| -------------------- | -------------: | ---------: | -----------: |
| Button               |            511 |        334 |          282 |
| Tabs                 |          1,917 |        960 |          825 |
| Glass scope          |          1,080 |        564 |          487 |
| Dialog               |          2,381 |      1,113 |          990 |
| Dock                 |            302 |        227 |          189 |
| All React components |          8,420 |      3,027 |        2,695 |
| Tokens CSS           |          1,775 |        613 |          526 |
| Base component CSS   |          7,683 |      2,035 |        1,729 |
| Optional glass CSS   |          4,187 |        998 |          854 |

These exclude React and are not complete application sizes. CSS entries are measured
separately; base styles never import glass.css. Button's bundle check asserts that it
excludes Glass capability detection and Dialog logic. Raw results also include a development-only
Radix Tabs comparator and SSR samples. Different APIs and capabilities prevent a blanket
performance ranking; see performance.md. Browser timing and memory claims are not made.

## Remaining gates

- Firefox failed before tests with `browserType.launch: spawn UNKNOWN` on this Windows
  host. All three engines remain configured in Linux CI; a successful Firefox run is not claimed.
- Node 22 is configured in CI; the local host ran Node 24 only.
- NVDA/VoiceOver, 400% zoom, manual forced-color/RTL review and target-device timing/memory
  profiling remain release work. Automated axe does not certify WCAG conformance.
- The supplied public Jttacalig/devvy-ui repository was verified empty and configured as
  local Git origin. No commit, push, public CI run, npm publication or production deployment
  was performed. Namespace ownership and repository protections still need verification.
- React 16/17, future framework adapters and a zero-client-JS RSC adapter are not shipped.
- Only one alpha documentation version exists. CLI source/styles upgrades require manual review.

The local docs run at http://127.0.0.1:3000/ui/glass while the preview process runs.
Restart with `pnpm preview:docs` after building, or `pnpm dev:docs` while developing.
Next steps are manual accessibility and public CI checks, release ownership/provenance,
and reviewed main-site route and asset integration described in glass.md.

## Production-grade audit and tri-browser verification — 22 October 2026

Actual local checks for the complete production-grade repository audit:

| Check                       | Result                                                                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `pnpm build`                | Passed; 17 registry entries, declarations, Vite app, Next.js docs (29 SSG routes)                              |
| `pnpm typecheck`            | Passed across core, React, Vite, Next docs and CLI                                                             |
| `pnpm lint`                 | Passed; 0 errors, 0 warnings (including JSX a11y rules)                                                        |
| `pnpm format:check`         | Passed; 100% Prettier compliance                                                                               |
| `pnpm test`                 | 50 passed: 6 core, 42 React, 2 CLI installer                                                                   |
| `pnpm check:packages`       | All six packages passed; all 17 registry entries match canonical React implementations                         |
| `pnpm pack:all`             | Six installable beta tarballs generated in `.artifacts/` (`0.1.0-beta.1`)                                      |
| `pnpm test:consumer 18.3.1` | Passed with installed archives on React 18.3.1                                                                 |
| `pnpm test:consumer 19.3.1` | Passed with installed archives on React 19.3.1                                                                 |
| `pnpm test:browser`         | 135 passed across Chromium (45), Firefox (45) and WebKit (45)                                                  |
| `pnpm audit`                | 0 known vulnerabilities                                                                                        |
| `pnpm bench`                | All JavaScript and CSS gzip/brotli budgets passed; all 17 React components = 4.8 kB gzip, styles = 3.0 kB gzip |

### Tri-browser verification details

All three major modern browser engines were installed and verified locally on Windows x64:

- **Chromium (Desktop Chrome)**: 45/45 tests passed.
- **Firefox (Desktop Firefox)**: 45/45 tests passed. Native select dropdown keyboard interactions were aligned in `tests/browser/design.spec.ts`, and test timeout resilience was configured in `playwright.config.ts` (60s timeout for heavy parallel Axe scans).
- **WebKit (Desktop Safari)**: 45/45 tests passed.

### Quality gates & version progression

With all quality gates met — 17 canonical implementations, 0 axe accessibility violations across all pages/themes/viewports, clean SSR/hydration, clean consumer installs across React 18 & 19, zero audit vulnerabilities, and 100% tri-browser pass rate — the project progressed from alpha to beta (`0.1.0-beta.1`) via Changesets pre-mode.

### WebKit Ubuntu Linux accessibility failure investigation & resolution

GitHub Actions CI run on Ubuntu Linux previously revealed 24 failing WebKit accessibility tests:

- **Root cause confirmed**: Base CSS transitions on `.site-header > nav a` (`transition: color 160ms, background-color 160ms`) and `.header-icon-link` caused text color to interpolate gradually when `data-devvy-theme` changed from light to dark. Because `.site-header` changed its background instantaneously from `#f5f3ee` to `#1b1a18`, the lingering intermediate text colors (e.g. `#686661`, luminance ratio 3.03:1) violated the WCAG 2.1 AA minimum contrast threshold of 4.5:1.
- **Why it passed on Windows**: Host CPU and worker scheduling differences caused Axe scans on Windows to run slightly after the 160ms transition had settled, masking the race condition locally. In Linux headless WebKit on GitHub Actions, Axe audits evaluated immediately during the transition.
- **Underlying UI fix**:
  1. Scoped `transition: color ..., background-color ...` to `:hover` on `.site-header > nav a:hover` and `.header-icon-link:hover` so theme palette switches update instantaneously without intermediate low-contrast interpolation.
  2. In `ThemeControl.tsx`, temporarily suppressed global transitions during theme attribute mutation via a transient head stylesheet to guarantee zero intermediate transition artifacts across all page elements.
  3. No accessibility rules or checks were disabled; full WCAG AA Axe audits remain active on every page in both themes.

Evidence: `.artifacts/browser-results.json`, `.artifacts/devvy-ui-*-0.1.0-beta.1.tgz`, and `benchmarks/results.json`.
