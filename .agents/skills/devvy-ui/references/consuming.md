# Using, customizing and updating DEVVY UI

Use the application's existing framework, package manager and file layout. Find the entry
that imports DEVVY CSS, existing component imports and any `devvy.json` configuration.
Inspect the installed package exports and source; this guide does not imply a published
version or guarantee every framework/browser is supported.

## Choose package mode or source ownership

- **Package mode:** import public entries such as `@devvy-ui/react/button` or the barrel.
  Import tokens and base styles once in the application's supported global CSS entry.
  Use native props, `className`, `style`, wrapper composition and token overrides first
  for application-specific presentation. Do not modify node_modules.
- **Source ownership:** `devvy.json` records the component and stylesheet paths. Honor its
  configuration rather than assuming defaults. The CLI's init/add commands copy bundled
  source and helpers, do not install dependencies, and refuse changed-file overwrites.
  The shared styles are a snapshot requiring deliberate review when updated.

Use the package/version already selected by the project unless the task includes an upgrade.
For a checkout of an unpublished alpha, use workspace packages or built archives as documented
by that checkout. Do not suggest `npx devvy-ui@latest` as if it were verified available.

## Customize without losing behavior

```tsx
import '@devvy-ui/tokens/theme.css';
import '@devvy-ui/styles';
import './my-theme.css';
import { Button } from '@devvy-ui/react/button';

export function SaveAction() {
  return (
    <Button className="project-save" type="submit">
      Save project
    </Button>
  );
}
```

Override existing `--dvy-` variables after base CSS, preferably within a project class or
theme container. Keep text/background contrast, native disabled/form behavior, visible
focus, accessible labels and reduced-motion/forced-color behavior. Use scoped
`data-devvy-theme="light"`, `"dark"` or `"system"` rather than editing vendor token files.

For Glass, add `@devvy-ui/styles/glass.css` after base styles and use a Glass scope with
quality="auto". Frost, opacity, radius and lighting use `--dvy-glass-*` properties. Keep
opaque fallbacks; full effects cannot defeat accessibility media preferences. Set Dialog's
returnFocusRef to the invoker when reliable pointer focus return is needed. Reserve content
space if using a floating Dock.

The docs playground exports customized CSS and static HTML. Component pages export editable
React TSX; that code is not live-compiled. Include copied helpers/imports through the source
installer before substituting an edited implementation. Keep the MIT notice with copied code.

## Update packages or copied components

1. Identify the current upstream version/revision, intended target and application-specific
   edits. Read actual release notes, manifests and compatibility information for that target.
2. In package mode, update only the relevant declared versions and lockfile with the existing
   package manager. Check React peer alignment and migrate changed APIs/styles explicitly.
3. For owned source, compare the old upstream baseline, local customized source and new
   upstream source. Merge needed fixes into the local copy; preserve deliberate UI/behavior
   changes. Use a temporary copy to inspect new installer output instead of overwriting work.
4. Review styles/tokens, helper imports, IDs, focus, form behavior and optional material
   dependencies together. Do not rerun init to replace a customized stylesheet. If the old
   baseline is unavailable and intent is unclear, preserve the local copy and explain the
   uncertain merge rather than silently replacing it.
5. Run the app's build, types, relevant tests and keyboard checks. Inspect responsive light/dark
   views and reduced effects when styling changes. Report migrated APIs and remaining manual
   checks. Do not claim a newly supported framework or browser based on a successful build alone.

Publication/deployment and bulk rewrites are separate from a routine component update. Follow
the user's existing authorization and preserve work outside the requested update.
