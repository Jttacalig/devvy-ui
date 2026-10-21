# @devvy-ui/react

Original MIT React foundation by DEV STATION. Beta and unpublished.
Requires react/react-dom ^18.2.0 or ^19.0.0; exact tested versions are in docs/compatibility.md.

Import tokens/theme.css, then @devvy-ui/styles once. Import components from
@devvy-ui/react or individual entries such as @devvy-ui/react/button.
All native attributes and forwarded refs are supported; tokens and className customize CSS.
No runtime CSS engine is used. All ESM entries preserve Next.js client boundaries.

See /ui/components in the local docs for complete props, examples, source and accessibility
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
