# Charts and navigation

These original components extend the existing React foundation. No new runtime dependencies
or backend requests are introduced. Import the existing token and base styles once.

## Charts

`import { Chart } from '@devvy-ui/react/chart'`

Pass a title and a readonly array of `{ label: string, value: number }`. Choose
`type="bar"` (default), `"line"`, `"area"` or `"donut"`. Cartesian charts support
negative, zero, single-point and constant data, with a zero baseline. Donuts require
nonnegative finite values and a positive finite total. Nonfinite values are omitted.
Empty or unsupported donut datasets display `emptyLabel`. Data is never fetched or
silently truncated. For large datasets aggregate before rendering.

Every chart has a visible caption, an SVG accessible name and a native `View data`
disclosure containing every valid value. Donut labels and values are visible outside
the graphic, so colors are not the only way to identify a category. Axis labels are
abbreviated for compact layouts; the table preserves full labels. Use short number
formatting for axes via `valueFormatter` (the same formatter applies to the table).
Labels of the disclosure and empty state can be localized with `dataLabel` and
`emptyLabel`. The built-in column headings are English.

The chart remains single-series: no time parser, zoom or multiseries stacking. The optional
ChartInspector composition adds pointer/touch inspection and one native keyboard slider.
Its readout complements the native data table; no hover-only tooltip is required. Set `--dvy-chart-color` or `--dvy-chart-series-1`
through `--dvy-chart-series-4` to customize the marks.

## Navigation

`Navbar` receives a required `label`, a `brand` slot, optional `actions` and child
links. Below 40rem the links and actions are a native button disclosure. Escape closes
it and returns focus to the trigger. It is route navigation, not an ARIA menu;
ordinary Tab and link behavior are preserved. Set `menuLabel` to localize the trigger.

`Sidebar` is a named nav shell for native links, optional headings and custom icons.
Use `aria-current="page"` on the active link. The `dvy-sidebar-heading` class
styles group labels. It does not impose viewport positioning or hide mobile content.

`Breadcrumbs` accepts `items` with ReactNode `label` and optional native anchor
attributes, including `href`. The last entry receives `aria-current="page"`;
omit its href for a noninteractive current location. Customize the nav name with
`label`. Separators are decorative and long labels wrap.

All four entries forward refs, native attributes, className and style. They inherit
light/dark tokens, use visible keyboard focus and include forced-color fallbacks.
Docs preview data is fictional and labelled as sample data. The landing workspace includes an Insights view alongside table and board views.

## Size accounting

The previous 13-entry JavaScript bundle measured 3,027 gzip bytes; the 17-entry
bundle measures about 4,816 bytes. Shared component CSS grows from 2,035 to about
3,078 gzip bytes. These are real additions for the new SVG rendering and navigation,
not a claim of zero cost. The benchmark retains the previous 4,200-byte JavaScript
and 2,600-byte CSS ceilings as separate foundation fixtures. Expanded aggregate
ceilings are 5,500 and 3,600 bytes, with individual limits on all four new entries.
Existing button, tabs, material, dialog and dock limits remain unchanged.

## Paper website theme

The docs application uses its own paper-and-ink token overrides in paper.css.
Warm off-white, charcoal and neutral grays replace green in the landing page and
standard previews; a matching dark mode remains available. Components still come
from DEVVY UI. The default palette shipped to library consumers is unchanged.

## 0.2.0 chart refinement

Import ChartInspector from the same /chart entry for a gradient area and optional point
inspection. Chart itself remains an event-free SVG presentation. Choose curve="linear",
"smooth" or "step"; smooth cubic segments stay inside adjacent endpoint values.
axisFormatter shortens axis ticks independently of valueFormatter and the full data table.
Chart accepts native SVG definitions through its definitions slot; --dvy-chart-fill can
reference a custom paint server or solid color. Give gradient ids stable unique values.
There is no chart engine, data fetch, autoplay or continuous animation.

The docs period selector filters actual sample data. Its totals and inspection values
follow the selected period; this is fictional data, not a backend metric. See
[design direction](design-direction.md) for the wider library review and measured tradeoffs.
