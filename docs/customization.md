# Make DEVVY UI yours

DEVVY UI supplies a starting point, not a fixed visual result. Customize at the level your
project needs: theme tokens, ordinary CSS, native props or the component implementation.

## Edit and export a design

Open the dedicated full-width workspace at `/ui/playground#code-playground`. Edit
`theme.css` and `index.html`; Auto preview updates the isolated canvas 350 ms after typing.
Pause Auto preview to apply larger edits manually with **Apply changes** or Ctrl/⌘ + Enter.
Use Code, Split view or Preview, resize the divider with pointer/arrow keys, and choose
a mobile, tablet or fitted canvas. The preview uses actual token, component and optional Glass styles.
Download your CSS separately, or download a standalone HTML file with the styles included.
The HTML export includes the original MIT license notice. No editor service or new dependency
is required; drafts stay in the current page and are lost on reload unless exported.

The preview supports HTML and CSS in a sandboxed iframe. Scripts, external assets and form
submissions are blocked there. It does not compile React/TSX. The standalone HTML is a static
design example; use the React components for their React behavior.

## Use your theme with React

### Optional modern fonts

Preview Geist, Manrope and Geist Mono at `/ui/fonts`. The new workspace styles entries
`@devvy-ui/styles/fonts/geist.css`, `fonts/manrope.css` and `fonts/geist-mono.css` declare
self-hosted variable Latin WOFF2 fonts. Import only the family you use, after the tokens,
then apply `data-devvy-font="geist"` (or `manrope` / `geist-mono`) to your theme container.
These entries are unreleased and are not available in npm 0.2.0 yet. System fonts remain
the base default. Keep the OFL notices with copied font assets; see
`packages/styles/fonts/README.md` for sources and coverage.

Published 0.2.0 already supports your own fonts: load a licensed font in your application,
then set `--dvy-font` and `--dvy-font-mono` on the theme container. The isolated HTML/CSS
playground intentionally blocks font files; use the font specimens or your app to test them.

### Theme scope

Import your CSS after the DEVVY styles. Scope custom properties and selectors with a class
so your design affects the intended part of your application:

```tsx
import '@devvy-ui/tokens/theme.css';
import '@devvy-ui/styles';
import '@devvy-ui/styles/glass.css';
import './devvy-theme.css';
import { Glass, Card, CardContent, Button } from '@devvy-ui/react';

export function MyWorkspace() {
  return (
    <Glass className="my-workspace" theme="light" quality="auto">
      <Card className="custom-card">
        <CardContent>
          <h1>Your next idea starts here.</h1>
          <Button onClick={() => console.log('Your application action')}>Make it yours</Button>
        </CardContent>
      </Card>
    </Glass>
  );
}
```

Glass is optional. An ordinary div with your class can scope foundation tokens without it.
Every component accepts native attributes, className, style and a ref. Recheck contrast,
focus visibility and reduced effects after changing colors, transparency or dimensions.

## Change the implementation

Each component page has a **Make the source yours** editor. Edit the real TSX, copy it or
download your modified file, or restore the original. The downloaded copy includes the MIT
notice. These edits affect the exported file; the shipped component preview above it does
not execute edited TSX.

First run the local source installer from your React project, as documented in the getting
started guide. It copies shared helpers and dependencies alongside the component. Replace
the corresponding copied component with your edited version, preserving its import paths,
then build and test your application. The CLI refuses to overwrite edited files.
You own that source and can change its markup, behavior and styling under the MIT license.

The editors keep drafts in memory. Copy or download before leaving or reloading the page.

## Customize the completed inventory

The 0.2.0 Stable release contains 100 primary components. Composed controls expose typed options
and callbacks; native wrappers preserve native props and refs. Source installation includes
dependency closure and listed helpers such as lib/widgets.tsx. Preserve your edits when
merging upstream helpers and CSS. Keep uploading, persistence and AI requests application-owned.
See [AI interface ideas](ai-interfaces.md) for optional compositions.

For copied source in Next.js App Router, import interactive components from a client
module marked `use client`. Package builds supply client entry boundaries; source ownership
uses your application’s boundary. Server rendering/hydration and RSC-only execution differ.

## Signature website styles

The documentation offers DEVVY Minimal (default), Modern (dark-first) and Glass through
the palette button in the header. Appearance remains a separate light/dark/system choice.
Choices persist locally when browser storage is available. Glass uses the existing adaptive
material and accessibility fallbacks. These website compositions do not change the library
defaults or require a new UI dependency.
