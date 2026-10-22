# Make DEVVY UI yours

DEVVY UI supplies a starting point, not a fixed visual result. Customize at the level your
project needs: theme tokens, ordinary CSS, native props or the component implementation.

## Edit and export a design

Open `/ui/playground#code-playground`. Edit `theme.css` and `index.html`, then choose
**Apply changes**. The preview uses the actual token, component and optional Glass styles.
Download your CSS separately, or download a standalone HTML file with the styles included.
The HTML export includes the original MIT license notice. No editor service or new dependency
is required; drafts stay in the current page and are lost on reload unless exported.

The preview supports HTML and CSS in a sandboxed iframe. Scripts, external assets and form
submissions are blocked there. It does not compile React/TSX. The standalone HTML is a static
design example; use the React components for their React behavior.

## Use your theme with React

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

The 0.2.0 candidate contains 100 primary components. Composed controls expose typed options
and callbacks; native wrappers preserve native props and refs. Source installation includes
dependency closure and listed helpers such as lib/widgets.tsx. Preserve your edits when
merging upstream helpers and CSS. Keep uploading, persistence and AI requests application-owned.
See [AI interface ideas](ai-interfaces.md) for optional compositions.

For copied source in Next.js App Router, import interactive components from a client
module marked `use client`. Package builds supply client entry boundaries; source ownership
uses your application’s boundary. Server rendering/hydration and RSC-only execution differ.
