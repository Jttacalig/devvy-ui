# Contributing to the library

Paths below are relative to the DEVVY UI checkout, not to this skill folder.
Use the root AGENTS.md for shared rules and CONTRIBUTING.md for the contributor workflow.

## Where a change belongs

| Concern                                                  | Canonical location                                                     |
| -------------------------------------------------------- | ---------------------------------------------------------------------- |
| Framework-independent state/navigation/capability policy | `packages/core/src`                                                    |
| React markup, props, focus and lifecycle                 | `packages/react/src/components`                                        |
| Theme colors, density and shared scales                  | `packages/tokens/src/theme.css`                                        |
| Base component appearance                                | `packages/styles/components.css`                                       |
| Optional Glass material                                  | `packages/styles/glass.css`                                            |
| Registry inputs and copied dependencies                  | `packages/registry/build.mjs`                                          |
| Installer behavior and conflict handling                 | `packages/cli/src/cli.mjs` and its tests                               |
| Documentation/interactive previews                       | `apps/docs/app/ui`, `apps/docs/components`, `apps/docs/lib/catalog.ts` |

Do not maintain a second source template or edit generated registry JSON. A docs-only control
belongs in the docs app until a reusable public component is deliberately being introduced.

## Add or change a public component

1. Read a comparable canonical component and its tests. Establish the relevant native
   attributes, ref target, controlled/uncontrolled behavior, disabled/loading/form behavior,
   keyboard pattern and SSR output. Preserve existing behavior outside the requested change.
2. Implement the React source; extract reusable non-DOM logic to core only when appropriate.
   Use public `dvy-` classes and `--dvy-` tokens. Preserve focus, RTL and media fallbacks.
3. For a new public entry, update `packages/react/src/index.ts`,
   `packages/react/components.json` and `packages/react/package.json` exports/types. Build entries derive from the inventory in tsup.config.ts. Keep
   React external/peer and retain client boundaries in built entries.
4. Registry entries derive from the inventory. Declare composed component names in its `dependencies` array; the registry resolves their complete closure and rejects cycles/unknown names. Update `packages/registry/build.mjs` only for other required copied
   dependencies. List React-local shared files in the inventory helpers array (for example
   widgets.tsx); generation copies them under lib/ across the complete dependency closure.
   Helper names must be flat .ts/.tsx filenames. Its core import rewrite must stay compatible
   with the generated layout.
   Rebuild; keep `scripts/check-packages.mjs`'s current inventory/parity checks accurate
   when adding an entry. Do not reduce parity coverage to make a new component pass.
5. Add catalog API/usage data and a working `ComponentPreview` case. Keep source/install
   instructions accurate. Keep API/code catalogs server-side; pass only slim navigation
   metadata and preview routing to client shells. Verify standalone source installation for composed components. Browser route checks use the shared inventory; update relevant consumer
   fixtures. Shared Vite `Showcase` changes also affect docs previews.
6. Add focused behavior/SSR/hydration/keyboard tests where relevant. Cover new public
   interactions and regressions rather than duplicating the implementation in assertions.
7. Add a Changeset for affected public packages and document compatibility/migration changes.
   Keep the existing prerelease channel unless changing it is part of the authorized release.

A bug fix does not require inventing a new API or component. If props/exports remain the
same, update only the layers actually affected by the behavior change.

## Glass, dialogs and customization

Glass stays optional in the same library. Never import its CSS from the base entry or add
its detection logic to unrelated focused imports. Automatic quality SSR-renders reduced
and enhances using capability hints. CSS media preferences can still override full effects.

Dialog uses native showModal, cancellation and cleanup. Preserve the nonmodal inline fallback
and `returnFocusRef` for pointer invokers in browsers that do not focus clicked buttons.
Dock uses native navigation/link/button semantics rather than invented keyboard behavior.

The docs HTML/CSS editor uses canonical styles in a script-blocking sandboxed iframe. Its
React source editor exports code, without running edited TSX. Preserve the hydration readiness
guard so early edits are not lost. Do not relax isolation to allow audit scripts into the frame;
test the editor UI and functional preview behavior separately.

## Verification and updates

Read the root scripts and CI matrix for current commands/versions. Build before checking
generated exports, packing, consumers or production browser flows. Run the relevant unit
tests, types and lint for code changes. Run browser checks for UI/focus/SSR integration,
package parity for public entries, and bundle budgets for component/CSS size changes.

For exports, dependency boundaries or SSR changes, pack all packages and run the isolated
React consumers configured in CI; workspace symlinks alone do not verify installability.
Dependency changes include lockfile, peer, license and advisory review. Do not update
dependencies or relax budgets merely to silence an unrelated failure.

For a textual instruction change, verify formatting and referenced paths/commands instead
of rebuilding all applications. A blocked local browser is a reported limit, not permission
to remove its CI project. Keep actual evidence separate from future support or release plans.
