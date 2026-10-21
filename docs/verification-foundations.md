# Foundation batch — 22 October 2026

This batch preserves the existing 17 components and adds Select, Alert, Progress and Skeleton.
The canonical inventory contains 21 primary components. The remaining 79 additions in the
[100-component plan](roadmap-100.md) are planned, not implemented. Existing APIs and visual
identity remain intact; no new dependency, version command or publication was introduced.

Environment: Windows x64, Node 24.19.0, pnpm 11.25.0, TypeScript 5.9.3, React 19.3.1.
These are local results, not GitHub CI or manual accessibility certification.

| Check                | Actual result                                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build                | Packages/declarations, Vite and 33 Next.js pages passed                                                                                              |
| Types and lint       | Passed across the workspace                                                                                                                          |
| Unit/installer       | 65 passed: 57 React, 6 core, 2 CLI; unchanged core can use Turbo cache                                                                               |
| Exports and registry | Six packages passed; all 21 focused/barrel entries, every copied component/helper, optional CSS, shared CSS and MIT notices matched canonical source |
| Packed consumers     | Six tarballs generated; React 18.3.1 and 19.3.1 passed installed exports, SSR, hydration, native select/progress and existing dialog/tab flows       |
| Production browsers  | 159/159 passed: 53 each in Chromium, Firefox and WebKit, current production build on a separate local port, two workers, no retries                  |
| Bundle budgets       | Passed; measured values below                                                                                                                        |

The native Select tests cover required validation, FormData, reset, controlled multiple
selection, numeric size, disabled controls/options, attributes and refs. Progress tests cover
finite bounds, invalid maxima and indeterminate values. Alert tests cover polite/urgent roles
and composed actions. Skeleton checks cover decorative semantics, dimensions and motion opt-out.
The batch also passes combined SSR/hydration and structural axe checks. Browser tests apply
real styles in both themes, check keyboard selection, message dismissal/restoration, progress,
loading replacement, 320/768/1024/1440 layouts, RTL and reduced motion.

Browser checks now start a production server unless reuse is explicitly requested. A first
exploratory run reused the existing development server; it is not the production evidence.
An intermediate production run found a WebKit test assuming pointer clicks focus buttons.
The final test deliberately uses keyboard activation to verify keyboard focus retention.
The existing development server is left running; tests use a separate available local port.

A four-worker production run timed out once while Firefox checked the sandboxed preview
after Restore starter. The unchanged export test then passed three isolated runs. The final
full run passed all 159 tests with CI's two-worker setting. Two workers are now also the
local default. Assertions and sandbox protections remain unchanged.

## Consumer update notes

Package consumers import the matching updated base stylesheet. Existing source-owned installs
must review and merge the new control/feedback CSS into their owned stylesheet: `add` copies
component/helper sources and deliberately does not overwrite an existing styles snapshot.
Keep local token/style changes and MIT notices. Do not reinitialize or replace customized
components just to add this batch. No existing component prop migration is required.

## Measured incremental bytes

Raw snapshot: [foundations-win32-node24.json](../benchmarks/foundations-win32-node24.json).
Production esbuild browser ESM/es2020 with React external, minification and default gzip.
These are library bytes, not complete application downloads or interaction-speed scores.

| Fixture                                | Gzip bytes |
| -------------------------------------- | ---------: |
| Select                                 |        230 |
| Alert                                  |        429 |
| Progress                               |        320 |
| Skeleton                               |        266 |
| All 21 components and compound exports |      5,259 |
| Existing 17-component CSS slice        |      3,078 |
| Added controls/feedback CSS alone      |      1,035 |
| Combined 21-component CSS              |      3,656 |
| Theme tokens                           |        613 |
| Optional Glass CSS                     |        998 |

Existing JavaScript limits are retained, including 5,500 bytes for the full barrel. The
17-component CSS slice retains its 3,600-byte ceiling. Four additions increase the combined
CSS by 578 gzip bytes; its ceiling is now 3,900, with a separate 1,250-byte new-slice limit.
Shared compression means the standalone slices do not sum to the combined size. Native
Select uses the browser arrow so width customization keeps the indicator aligned, without
extra wrapper markup, an SVG or measurement code. Prior measurement snapshots are retained.
SSR timings in the raw file were recorded during development and are not an idle-hardware
performance comparison.

## Remaining release gates

Manual NVDA/VoiceOver, zoom, touch/native-picker and target-device reviews remain required.
Forced-color/Glass regressions are exercised by the existing browser suite; manual review of
the new components under those preferences remains part of release review. Custom consumer
palettes need their own contrast checks. Node 22/Linux and public CI results must be reviewed
separately. No claim is made that all 100 components or WCAG certification are complete.

The Changeset proposes future React/styles/registry minor updates and a CLI patch. Package
versions remain at the existing beta while that proposal is reviewed. No npm publish, merge,
deployment or protected-main push is part of this batch.
