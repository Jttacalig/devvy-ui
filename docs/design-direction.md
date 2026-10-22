# DEVVY UI design and engineering direction

Review date: 23 October 2026. This direction applies across the library: forms, navigation,
overlays, feedback, data, media and application patterns. It is not a chart-only redesign.

## Learn from patterns, keep an original implementation

| Reference                                                               | Useful lesson                                                       | DEVVY choice and tradeoff                                                                                                         |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| [shadcn/ui](https://ui.shadcn.com/docs/components)                      | Consistent component examples and owned source                      | Keep canonical package/source parity, explicit APIs and editable source. Use DEVVY tokens and ordinary CSS.                       |
| [Base UI](https://base-ui.com/react/overview/about)                     | Open composition and styling freedom                                | Preserve native props, classes, refs, callbacks and scoped tokens. Native controls stay native where appropriate.                 |
| [Radix](https://www.radix-ui.com/primitives/docs/overview/introduction) | Predictable controlled/uncontrolled APIs and careful focus behavior | Review focus, dismissal, keyboard navigation, SSR ids and cleanup. Do not substitute a new dependency merely to resemble its API. |
| [MUI X](https://mui.com/x/react-charts/)                                | Clear states, labels and capable data presentation                  | Document narrow contracts and use accessible data equivalents. Advanced analytics are outside the small built-in chart.           |

These are design judgments from the referenced documentation, not evidence that DEVVY has
equivalent coverage, assistive-technology testing or performance. No implementation from
these libraries is copied and none is added as a runtime dependency by this release.

## System-wide changes in this release

- 100 primary components with focused imports, declarations, source ownership and explicit previews.
- Shared namespaced tokens, logical spacing, visible focus, light/dark themes and optional Glass.
- Native forms, file selection, date/time pickers and non-drag alternatives for list/board moves.
- Consistent menu states, disabled skipping, Escape dismissal, scoped theme inheritance,
  viewport-aware panels and keyboard activation. Tooltips clamp to narrow viewports.
- Native dialog compositions and focus return for Drawer, AlertDialog, CommandPalette,
  Lightbox and OnboardingTour. Popovers inside native dialogs stay in their modal layer.
- Searchable component categories, useful empty-state recovery and a working landing workspace.
- SVG chart interpolation, optional gradient/inspection composition and the complete data table.

## Where DEVVY aims to be useful

Small focused JavaScript entries, optional visual effects, plain CSS and minimal dependencies
make the implementation approachable. Source ownership lets a consuming developer or coding
assistant change the implementation. Consistent tests and package checks keep package mode
and copied source aligned. These are concrete properties to verify, not a blanket claim of
being faster or more accessible than another library.

Keep advanced features optional. Rendering a basic Chart does not register inspection
events; ChartInspector adds that behavior. Glass is a separate CSS import. AI compositions
remain [provider-independent proposals](ai-interfaces.md), without an AI backend in core.
The React adapter supports its documented React targets; other adapters are future work.

## Gates for future improvements

Write the behavior and customization contract before adding an option. Verify default,
hover/focus, selected, disabled, loading, error and empty states where meaningful. Check
native form semantics, IME, focus return, long labels, 320px layouts, RTL, themes and reduced
effects. Test actual installed packages, not only workspace imports.

Measure changed focused entries and full CSS. Preserve historical measurements and explain
feature cost. Avoid adding a generic runtime, continuous animation, parser or network service
to improve a small visual detail. Manual screen-reader, touch and device review remains
necessary; automated axe, SSR timings and bundle bytes are limited evidence.
