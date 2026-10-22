# 50-component milestone — 22 October 2026

Historical snapshot. See [current 100-component verification](verification-100.md) for the
0.2.0 candidate. Version/publication statements below describe the original run.

Current package candidate: **0.1.0-beta.2**, unpublished. The user approved this version
advance after the component checks. Changesets applied the fixed six-package prerelease
plan; root metadata, website labels, README and current release guidance match it.

The inventory now implements 50 of the requested 100 primary components. This batch adds
29 to the existing 21, without changing their APIs, tokens or optional Glass stylesheet.
The remaining 50 names in the [roadmap](roadmap-100.md) remain planned; no placeholders
or performance/accessibility certification are implied.

## New inventory

| Area                                | Additions                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Layout and identity (8)             | Avatar, AvatarGroup, AspectRatio, Container, Stack, Grid, Typography, IconButton                        |
| Disclosure, navigation and data (5) | Accordion, Pagination, RadioGroup, Slider, Table                                                        |
| Forms and inputs (8)                | Form, FormField, Fieldset, NumberInput, PasswordInput, SearchField, SegmentedControl, ColorPicker       |
| Feedback and display (8)            | CircularProgress, Spinner, EmptyState, StatusIndicator, Collapsible, DescriptionList, Meter, CopyButton |

Every primary entry has canonical typed source, a focused ESM/declaration export, styles,
generated source installation and documentation with a working preview. Layout is semantic
HTML/CSS. Forms use native validation, submission/reset, labels and fieldsets. Single-choice
controls use native radios and range inputs retain native keyboard/touch behavior. Disclosures
use details/summary; they add no overlay or focus trap. CopyButton reports rejection honestly,
offers selected manual-copy text and suppresses updates after unmount. Empty/loading/disabled
states are covered where they apply; decorative/layout primitives do not invent interactions.

## Architecture and customization

Composed source dependencies are declared in `packages/react/components.json`. Registry
generation resolves the full graph, deduplicates shared source and rejects unknown names or
cycles. Tests cover both standalone composed installs and the entire inventory. React remains
a peer, core remains DOM-free and this batch adds no runtime or development dependency.

Native props, refs, classes, scoped tokens and inline styles remain available. Typography
separates heading semantics from visual size. DescriptionList items can have stable ids for
dynamic reordering. Add your own tokens after imports and check their contrast. In Glass
scopes, EmptyState can adopt the material; layout and native controls keep their appropriate
base behavior. Reduced motion stops spinners and indeterminate circular progress stays still.

Package consumers import matching base styles. Source-owning users must review/merge the new
rules into their owned stylesheet: the installer does not overwrite customized style snapshots.
Keep local changes and MIT notices. Do not reinitialize an existing project to obtain updates.

## Local evidence

Windows x64, Node 24.19.0, pnpm 11.25.0, TypeScript 5.9.3. React package fixtures use
18.3.1 and 19.3.1. Checks below are local evidence, separately from public CI.

| Check                         | Result                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Build, types, lint            | Passed; production docs generated 62 pages                                                                          |
| Unit/installer                | 84 passed: 74 React, 6 core, 4 CLI                                                                                  |
| Exports/registry              | All 50 entries, declarations, helpers, dependent sources, CSS and licenses matched                                  |
| Packed React 18/19 consumers  | All six packages packed; installed React 18.3.1 and 19.3.1 fixtures passed, including every focused export and SSR  |
| Production browser checks     | 276 passed: 92 each in Chromium, Firefox and WebKit, two workers, production component build (7.5 minutes)          |
| Beta.2 display follow-up      | 27 passed across all three engines after the version update; landing/sidebar/footer labels and 320px layout checked |
| Formatting and bundle budgets | Passed                                                                                                              |

Build, types, lint, unit/installer, package parity, packing, installed React 18/19 consumers
and bundle checks were rerun successfully after the approved beta.2 advance. The full
component browser run preceded the metadata/display changes; the focused follow-up uses
the rebuilt beta.2 docs. Local browser JSON is retained in
`.artifacts/browser-results-midpoint-full.json` and `.artifacts/browser-results-beta2-display.json`.

The React fixture renders and hydrates all 29 additions with stable IDs and structural axe.
Focused tests cover image recovery, native form data/reset/validity, controlled disclosures,
huge pagination counts, radio groups, password visibility, numeric bounds, measurement
normalization, clipboard denial and completion after unmount. Browser route tests use real
styles and cover every component in both themes. Additional flows cover keyboard selection,
submission/error/reset, disabled fields, actual state changes, clipboard success/fallback,
all new layouts at 320/768/1024/1440, RTL and reduced motion.

JSDOM emits its missing canvas-context diagnostic during structural axe analysis. Those
tests pass with color contrast reserved for the real styled-browser checks; no canvas
dependency or browser rule suppression was introduced. Manual assistive-technology review
remains a separate gate.

## Size accounting

The previous 21-component public surface and CSS are frozen benchmark fixtures, retaining
their 5,500-byte JavaScript and 3,900-byte CSS gzip ceilings. The older 17-component CSS,
13-component foundation and focused-import limits are also retained. The expanded 50-entry
barrel and stylesheet have separate measured budgets; adding components is not reported as
a size improvement. React is external in these measurements; application/framework bytes
are not included. Individual new focused entries measure 207–833 gzip bytes, including
composed dependencies. The full 50-component JavaScript fixture measures 9,521 gzip bytes
against its 10,500-byte ceiling; component CSS measures 5,540 against 6,200. The frozen
21-component JavaScript fixture measures 5,261 bytes and its CSS remains 3,656; the new CSS
slice measures 2,596 against 2,900. Compression shares dictionaries, so slices do not add.
Raw results are retained in [the midpoint snapshot](../benchmarks/midpoint-win32-node24.json).
SSR timing samples during development are not comparative claims.

## Remaining release gates

### Linux CI follow-up

The [initial public CI browser job](https://github.com/Jttacalig/devvy-ui/actions/runs/39790946539/job/119866492529)
for `d131ba9` passed 270 checks and failed six: the SegmentedControl and CircularProgress
pages overflowed at 320px in Chromium, Firefox and WebKit. Wider Linux system-font metrics
exposed unbreakable component headings; the earlier Windows results remain historical evidence.
The Node 22/24 verification jobs and both installed React consumer jobs passed in that run.

Component-page headings now allow emergency wrapping without changing their text, font size
or component implementations. A regression check forces a wider monospace fallback at 320px
and checks the actual text bounds and document width in light/dark and LTR/RTL. It failed
in all three local engines before the fix. After the fix, all 33 targeted browser checks
passed (11 per engine), including the fallback-font cases; build, lint and formatting also
passed. The fresh Linux CI result is available on [PR #9](https://github.com/Jttacalig/devvy-ui/pull/9).

### Manual and release checks

Manual NVDA/VoiceOver, zoom, touch/native-picker, forced-color and target-device review remains
required. Real browser axe checks do not certify WCAG compliance. Custom palettes need their
own contrast review. Public CI and Node 22/Linux results are separate evidence. Complex overlay,
collection, editing, media and application widgets remain planned, with the existing phase
dependencies and quality gates. The approved beta version advance updates local metadata
and changelogs; it does not publish npm packages, deploy or merge protected main.
