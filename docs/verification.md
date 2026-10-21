# Local verification — 21–22 October 2026

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

## Charts, navigation and paper website — 22 October 2026

Actual local checks for the four added public entries and the docs-owned neutral theme:

| Check                     | Result                                                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build                     | Passed; 17 registry entries, declarations, Vite app and 29 Next.js pages                                                                                                       |
| Types / lint / formatting | Passed                                                                                                                                                                         |
| Unit checks               | 50 passed: 6 core, 42 React, 2 installer                                                                                                                                       |
| Public package checks     | All six packages passed; 17 registry implementations match canonical source                                                                                                    |
| Packed consumers          | Passed on React 18.3.1 and 19.3.1, including SSR/hydration of the four new entries                                                                                             |
| Browser suite             | 90 passed across Chromium and WebKit                                                                                                                                           |
| Firefox                   | All 45 cases stopped before execution: local Firefox process failed to launch with spawn UNKNOWN. Firefox support is not verified by this run; CI configuration remains intact |
| Size checks               | Passed expanded aggregate limits plus retained foundation and individual component limits                                                                                      |

The new checks cover all four chart views and data disclosures, signed/empty/invalid/extreme
datasets, native navigation attributes, Escape focus return, breadcrumb semantics and deterministic
hydration. Installed consumer fixtures include all four new public components. Source installer
checks also install Chart, Navbar, Sidebar and Breadcrumbs.

Real browser tests cover the new documentation routes in both themes and widths 320/768/1024/1440,
mobile navigation, existing component examples and editors. The paper palette is checked against
computed styles; desktop and phone screenshots were inspected. The website uses DEVVY tokens
and components with app-owned theme overrides. No dependency, production deployment or npm
publication is part of this update. Node 22 was not run locally.

Evidence: .artifacts/data-navigation-\*.log, .artifacts/devvy-paper-desktop.png,
.artifacts/devvy-paper-phone.png and benchmarks/results.json. These files are local artifacts.
