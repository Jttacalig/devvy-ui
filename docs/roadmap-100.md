# Roadmap to exactly 100 components

## Current milestone: 50 implemented components · 0.1.0-beta.2

The source inventory now contains 50 primary components: the first 21 plus 29 layout,
native form, disclosure, table and feedback additions. See [midpoint verification](verification-midpoint.md)
for their names and actual evidence. This reaches the requested halfway point. Phase 1's
five complex overlay/collection components remain planned; selecting independent native
components from Phase 2 does not declare all of Phase 1 complete.

## Audit and counting policy

The audited starting point is commit `7800494`: 17 primary components at
`0.1.0-beta.1`, six library/tooling packages, Next docs, Vite and vanilla examples.
The first batch used `feat/component-foundations`; the midpoint uses `feat/component-midpoint`. Existing APIs and the paper-and-ink
docs design are preserved. No stable release, push, merge or npm publication is implied.

One named primary component counts once. Compound helpers such as CardTitle and variants
such as Chart's four views do not increase the count. A planned name is not a shipped
implementation. The target is the 17 existing names plus the 83 distinct names below.

The baseline unit command passed (50 tests, cached results) and lint passed. Existing
infrastructure includes SSR/hydration, native interactions, axe, three browser projects,
packed React consumers, source registry parity, bundle budgets and Changesets. Historical
claims in docs/verification.md describe older snapshots; fresh batch results are recorded
separately rather than treating them as current proof.

### Preserve these 17

Badge, Breadcrumbs, Button, Card, Chart, Checkbox, Dialog, Dock, Glass, Input, Label,
Navbar, Separator, Sidebar, Switch, Tabs, Textarea.

### Gaps to address before scaling

- Component names/counts are duplicated in the build config, registry, package checks and
  browser test list. A shared primary-component inventory will drive these; package exports
  remain explicit and are checked against it.
- Registry checks compare the first implementation but need to verify every copied helper,
  dependency and optional stylesheet. Installer checks must cover the new batch as well.
- Current source ownership must retain conflict protection. A 100-component target does
  not justify overwriting edited source or replacing shared CSS snapshots automatically.
- Shared overlay, collection, positioning, async-state and editing behavior needs explicit
  interaction specifications before complex widgets are built. Existing native Dialog is
  retained; new overlays must not independently implement competing focus traps.
- Documentation counts and release evidence must follow actual candidates. Automated tests
  complement manual screen-reader, zoom, touch and target-device review; they are not WCAG
  certification. Future adapters and public publication remain separate work.

## Architecture

Keep the existing `core → React` and `tokens → styles → React` boundaries. Every primary
component has a typed canonical TSX implementation, a focused ESM/declaration entry, base
CSS, generated CLI source, catalog/API documentation and an interactive preview. Material
styling remains an optional import in the same library. There is no new backend or paid API.

Use a shared `packages/react/components.json` for primary names/slugs. Build entries,
registry generation and inventory checks use it. Documentation examples remain explicit
so adding a manifest row cannot disguise missing implementation or behavior.

| Shared concern          | Architecture and gate                                                                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native controls         | Preserve native names, validity, form/reset, disabled and readonly behavior where applicable; avoid redundant custom interaction code                     |
| Collections             | DOM-free navigation/selection rules in core; adapter owns refs, focus, IDs, controlled state and RTL                                                      |
| Overlays                | Specify dismissal, layering, positioning, nested behavior, scroll and focus return; evaluate platform APIs or a small licensed primitive only when needed |
| Forms                   | Composable Form/Field labeling and descriptions before complex inputs; validation belongs to the application unless explicitly specified                  |
| Dates and numbers       | Explicit locale/time-zone/value policy, finite bounds and keyboard semantics; keep formatting separate from storage                                       |
| Async controls          | Defined loading/error/empty/disabled states; avoid announcing every render or stale request result                                                        |
| Content/editing/uploads | Explicit content model and safe URL/HTML policy, file constraints and cleanup; no eval, arbitrary HTML execution or implied server upload                 |
| Large collections       | Measure before virtualization; stable keys, focus retention, keyboard and screen-reader alternatives                                                      |
| Styles/motion           | Namespaced tokens, light/dark, logical layout, visible focus, forced colors and reduced effects; animate transform/opacity only when useful               |

## Phased inventory

The following allocation contains all 83 requested additions exactly once.

| Phase                             | Additions | Cumulative target |
| --------------------------------- | --------: | ----------------: |
| Existing                          |        17 |                17 |
| 1 — essential UI and layout       |        22 |                39 |
| 2 — advanced forms and navigation |        44 |                83 |
| 3 — data and media                |        12 |                95 |
| 4 — application interaction       |         5 |               100 |

### Phase 1: 22 additions

| Batch                             | Components                                                                       | Dependencies / interaction policy                                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 1A — current implementation batch | Select, Alert, Progress, Skeleton                                                | Native select/progress; composed status content and decorative loading shapes. No new dependency                             |
| 1B — layout and identity          | Avatar, AvatarGroup, AspectRatio, Container, Stack, Grid, Typography, IconButton | Shared tokens; image fallback and group names; explicit icon-button names; responsive logical layout                         |
| 1C — disclosure and navigation    | Accordion, Pagination, RadioGroup, Slider, Table                                 | Native semantics first; roving focus/RTL only when needed; form/reset and pointer/keyboard slider parity                     |
| 1D — overlays and collections     | Tooltip, Popover, DropdownMenu, Combobox, Toast                                  | Overlay/collection specifications first; focus return, Escape, outside interaction, typeahead and live announcement policies |

After 1A the implementation inventory was 21. The midpoint also implements 1B and 1C,
plus 16 independent components from Phase 2. The five 1D names remain planned.
Do not call this phase complete until all 22 additions meet the gates below.

### Phase 2: 44 additions

| Group                   | Components                                                                                                                    | Sequence / dependencies                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Form composition (3)    | Form, FormField, Fieldset                                                                                                     | Label/description/error relationships and native validation before composite fields                |
| Selection and text (10) | MultiSelect, Autocomplete, RangeSlider, NumberInput, PasswordInput, OTPInput, SearchField, Rating, TagInput, SegmentedControl | Phase-one Select/Combobox/Slider/RadioGroup rules; composition/IME, paste and native form behavior |
| Additional controls (2) | ToggleGroup, ColorPicker                                                                                                      | Group selection semantics; keyboard-accessible color controls and value parsing                    |
| Uploads (2)             | FileUpload, Dropzone                                                                                                          | Native file input; constraints, keyboard alternative, cancellable feedback; no implied backend     |
| Date/time (4)           | Calendar, DatePicker, DateRangePicker, TimePicker                                                                             | Calendar/value/locale policy before pickers; overlay behavior and meaningful typed input           |
| Navigation (9)          | Stepper, Menubar, ContextMenu, CommandPalette, NavigationMenu, TreeView, ScrollArea, ResizablePanels, TableOfContents         | Collection/overlay policies; touch alternatives, focus retention, resize keys and native scrolling |
| Overlays/actions (5)    | HoverCard, AlertDialog, Drawer, FloatingActionButton, OnboardingTour                                                          | Tooltip/Popover/native Dialog; explicit focus, confirmation, mobile and non-hover alternatives     |
| Feedback (5)            | CircularProgress, Spinner, EmptyState, LoadingOverlay, StatusIndicator                                                        | Progress/Skeleton and announcement policy; decorative versus named states                          |
| Display utilities (4)   | Collapsible, DescriptionList, Meter, CopyButton                                                                               | Native disclosure/dl/meter where suitable; clipboard fallback and result announcement              |

### Phase 3: 12 additions

| Group             | Components                                                                                | Dependencies / gates                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Data display (4)  | DataTable, Timeline, Stat, CodeBlock                                                      | Table, collections, sorting/filtering policy, CopyButton; semantic nonvisual data access                                                |
| Media/content (7) | Carousel, Gallery, ImageCropper, VideoPlayer, AudioPlayer, MarkdownViewer, RichTextEditor | Native media; captions/transcripts, keyboard/touch parity, constrained crop geometry, safe content handling and a defined editing model |
| Overlay media (1) | Lightbox                                                                                  | Gallery and reviewed overlay/focus behavior; zoom/close controls and accessible captions                                                |

### Phase 4: 5 additions

VirtualList, InfiniteScroll, KanbanBoard, SortableList, MentionsInput.

Build on stable collections/combobox/scrolling and measure actual large-list performance.
Each drag interaction needs a keyboard/action alternative; preserve focus when items move
or unmount. InfiniteScroll has a manual load-more path and predictable announcements.
MentionsInput must specify IME, selection/caret behavior, escaping and suggestion navigation.

## Quality gate for each batch

1. Specify the public API, composition, native semantics, relevant variants/states and
   controlled/uncontrolled behavior. Mark inapplicable states rather than inventing them.
2. Ship working code, styles, named/focused exports and declarations; no placeholder entries.
3. Document usage, API, source ownership, limitations and an actual interactive example.
4. Verify meaningful unit/interaction/axe checks, SSR/hydration and native form behavior
   where relevant. Review 320/768/1024/1440 layouts, both themes, RTL and reduced effects.
5. Build and check all package entries and every registry file. Exercise CLI conflict
   protection and installed React 18/19 consumers for new exports.
6. Run Chromium, Firefox and WebKit; report any unavailable engine as an unfinished gate.
   Complete manual assistive-technology/device review before calling a component production
   grade. Prioritize reproducible regressions over a count target.
7. Record real incremental JS/CSS sizes and total budgets. Keep prior fixtures/baselines;
   explain legitimate feature cost rather than concealing regressions by raising limits.
8. Include Changesets and accurate release notes. Keep work on a feature branch, prepare
   reviewable changes, and do not push protected main, merge or publish without authorization.

The 100-component list is a plan, not a claim that the unimplemented components exist.

The first implementation batch contains four candidates, bringing the current source count
to 21. Its [verification record](verification-foundations.md) separates automated evidence
from the manual release gates. Subsequent batches should use the same evidence standard.
