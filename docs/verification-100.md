# 100-component release verification — 23 October 2026

Release: **v0.2.0 Stable**. The live npm registry was verified on 23 October 2026:
all six scoped packages have version 0.2.0 and `latest: 0.2.0`; `beta` remains at
0.1.0-beta.2. Their published manifests expose the documented React, CSS and CLI entries.
This confirms package publication, not deployment of this documentation update.

The implementation checks below were recorded before publication. Documentation release
checks are tracked separately in [the stable docs verification record](verification-stable-docs.md).

The canonical inventory contains exactly 100 primary components. The final 50 are:

Tooltip, Popover, DropdownMenu, Combobox, Toast, MultiSelect, Autocomplete, RangeSlider, OTPInput, Rating, TagInput, ToggleGroup, FileUpload, Dropzone, Calendar, DatePicker, DateRangePicker, TimePicker, Stepper, Menubar, ContextMenu, CommandPalette, NavigationMenu, TreeView, ScrollArea, ResizablePanels, TableOfContents, HoverCard, AlertDialog, Drawer, FloatingActionButton, OnboardingTour, LoadingOverlay, DataTable, Timeline, Stat, CodeBlock, Carousel, Gallery, ImageCropper, VideoPlayer, AudioPlayer, MarkdownViewer, RichTextEditor, Lightbox, VirtualList, InfiniteScroll, KanbanBoard, SortableList, MentionsInput.

## Evidence

Local environment: Windows x64, Node 24.19.0, pnpm 11.25.0, React 19.3.1.

| Check                | Actual result                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------ |
| Frozen install       | Passed; no dependency or lockfile update                                                   |
| Build                | Core/React/registry, Vite example and 112 production docs routes passed                    |
| Types and lint       | Passed                                                                                     |
| Unit/installer tests | 107 passed: 97 React, 6 core, 4 CLI                                                        |
| SSR/hydration        | Stable ids and structural checks, including all 50 additions                               |
| Package parity       | All 100 focused entries, declarations, copied sources/helpers, styles and licenses matched |
| Packaging            | Six 0.2.0 tarballs; installable dependency ranges                                          |
| Installed consumers  | React 18.3.1 and 19.3.1; all 100 focused exports and optional ChartInspector               |
| Browser matrix       | 498 unique planned checks verified across the full run and affected reruns: 166 per engine |
| Advisory check       | No known vulnerabilities from pnpm audit at moderate threshold                             |
| Markdown             | 47 files checked for local link targets; no broken targets                                 |

The browser evidence combines a 486-case full run with added cases and targeted reruns.
The first run passed 473 cases and exposed tree/gallery naming, virtual-list contrast,
pre-hydration input and WebKit video issues. These were fixed and affected cases rerun.
Further checks covered hover activation, directory hydration and native reset cancellation;
all latest results match the current 498-case test listing with no missing or failed case.
This is not a claim that a single clean 498-case run was performed locally.

Raw local files: .artifacts/browser-results-complete100-{initial,interactions,final,repaired,metadata}.json,
.artifacts/browser-current-list.json and .artifacts/browser-aggregate.json. The last metadata
optimization smoke run passed 15/15 across all three engines. Configured Linux Node 22/24
CI must be checked on the new review branch; earlier public CI belongs to an older snapshot.

The tree uses separately named treeitems with owned child groups, following the
[APG ownership contract](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/). Native reset
callbacks wait until event cancellation is complete; browser checks include a later native
listener that cancels reset. Preview controls wait for hydration before accepting edits.
WebKit playback was verified using the local MP4 fallback with captions and transcript.
JSDOM emits canvas diagnostics during axe inspection; real canvas export and contrast are
verified in browsers rather than relying on JSDOM color measurement.

## Size and dependency evidence

The [raw Windows snapshot](../benchmarks/complete-win32-node24.json) records gzip bytes:

| Fixture                                     | Gzip bytes |
| ------------------------------------------- | ---------: |
| Button                                      |        334 |
| Tabs                                        |        960 |
| Chart                                       |      1,649 |
| Optional ChartInspector                     |      2,168 |
| Frozen first 21 imports                     |      5,455 |
| Frozen first 50 imports                     |      9,720 |
| Entire 100-component namespace plus helpers |     27,684 |
| Shared component CSS                        |      8,641 |
| Tokens                                      |        613 |
| Optional Glass CSS                          |        998 |

React is external to these JavaScript measurements. Shared CSS is not isolated per component.
The original focused-import, first-21 and first-50 ceilings remain in force. Chart refinements
add about 0.2 KB to the older surface; optional inspection is a separate export. The completion
CSS slice measures 3,944 bytes, while the older 50-component CSS measures 5,546 bytes.
Compression dictionaries mean slices do not add to the full stylesheet size.

New-component ceilings were calibrated during implementation: tooltip viewport positioning
measures 802 bytes, and hover-card keyboard pinning/scoped popup behavior measures 1,711.
Their final ceilings are 1,000 and 1,900 bytes. These are new entries, not raised legacy
regression limits. Full-inventory ceilings account for the 50 added implementations. No new
runtime or development dependency was added. Concurrent SSR timing samples are not an
idle-hardware comparison or evidence of faster interaction.

## Narrow contracts and remaining manual gates

RichTextEditor edits a Markdown subset with a safe preview; it is not a full WYSIWYG editor.
MarkdownViewer escapes HTML and is not a full CommonMark parser. File controls select and
validate locally; applications upload and validate on the server. ImageCropper exports PNG
from an origin-clean decoded image. VirtualList requires fixed-height rows and includes a
Show all items alternative. Carousel is manual and has no autoplay. Media playback depends
on browser codecs; provide captions and transcripts. AI interface compositions are proposed
in [the direction document](ai-interfaces.md), not shipped provider integrations.

Manual NVDA/VoiceOver, touch, 200–400% zoom, OS forced colors and representative low-end
hardware review remain release gates. Automated axe and bundle checks are not accessibility
certification or performance rankings. Public CI, npm publication and production docs must
be verified separately from local checks.
