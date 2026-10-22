# @devvy-ui/react

Original MIT React foundation by DEV STATION. DEVVY UI v0.2.0 Stable is published on npm with 100 primary components.
The latest tag points to 0.2.0; the historical beta tag remains at 0.1.0-beta.2.
Package: https://www.npmjs.com/package/@devvy-ui/react.
Requires react/react-dom ^18.2.0 or ^19.0.0; exact tested versions are in docs/compatibility.md.

```sh
npm install @devvy-ui/react
```

Import tokens/theme.css, then @devvy-ui/styles once. Import components from
@devvy-ui/react or individual entries such as @devvy-ui/react/button.
Native attributes and forwarded refs are preserved by native-element wrappers; tokens and className customize CSS.
No runtime CSS engine is used. All ESM entries preserve Next.js client boundaries.

See https://devvy-ui.dev-station.dev/ui/components in the docs for complete props, examples, source and accessibility
notes for Button, Input, Textarea, Label, Badge, Card, Separator, Checkbox, Switch and Tabs.
CardTitle renders h3. Checkbox's mixed state is set on hydration; manage checked separately.
Tabs items require unique values, a list label and explicit dir for RTL. Panels stay mounted.

The optional DEVVY GLASS enhancement adds Glass, Dialog and Dock at individual /glass,
/dialog and /dock entries. Import the material CSS explicitly. Dialog uses native modality
with a nonmodal inline fallback; pass returnFocusRef for explicit pointer-trigger focus return.

## Data and navigation

Chart supports bar, line, area and donut views with an equivalent HTML data table.
Navbar, Sidebar and Breadcrumbs compose native route links. Focused imports:
/chart, /navbar, /sidebar and /breadcrumbs. See docs/charts-and-navigation.md in the repository.

## Native controls and feedback

Select preserves native options, multiple, numeric size, validation and form/reset semantics;
use controlSize for its visual size. Alert defaults to a polite status; use role="alert" for
urgent changes or role="note" for static guidance. Progress requires a label and accepts a
finite value/max; omit value for indeterminate progress. Skeleton is decorative; put aria-busy
and loading announcements on the enclosing content. Focused entries: /select, /alert,
/progress and /skeleton. See their local /ui/components pages for working examples.

## Complete component inventory

All 100 primary entries are listed in `components.json` and documented at the component catalog.
The new additions cover overlays and selection, dates and files, trees and split panels,
searchable data tables, manual media viewing, Markdown editing, windowed lists and boards.
Every entry has focused imports, types and generated source. RichTextEditor edits a safe
Markdown subset, ImageCropper exports a local PNG, and upload components select files;
application services handle persistence, uploading and AI requests.

See the repository’s `docs/verification-100.md` for actual checks and limitations.

For copied source in Next.js App Router, import interactive components from a client
module marked `use client`. Package builds supply client entry boundaries; source ownership
uses your application’s boundary. Server rendering/hydration and RSC-only execution differ.
