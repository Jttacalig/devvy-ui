# Architecture

`tokens → styles → React` defines presentation. `core → React` defines shared behavior.
Core never imports React, document, window or styling. React components wrap native controls
and expose their native attributes and refs. Tabs delegates navigation calculation to core;
the adapter owns focus, IDs and controlled/uncontrolled state.

ESM is the only published JavaScript format. Each component has its own entry and declaration.
Builds externalize React and core. React files retain `use client` boundaries for Next.js;
they can SSR and hydrate but are not a zero-client-JS RSC API. Static CSS and HTML need no JS.
CSS is explicitly marked as having side effects; component JS is tree-shakable.

`packages/react/components.json` is the primary component inventory. It drives focused
build entries, registry generation and documentation route checks. Public package exports
and the React barrel remain explicit; `check:packages` verifies their parity with that
inventory, including copied helpers, dependent component sources, licenses and styles.
Optional `dependencies` in the inventory name composed component sources; `helpers` lists
React-local shared files copied under `lib/`, including `widgets.tsx`. The registry
resolves their full dependency closure, deduplicates shared sources and rejects unknown
names/cycles. CLI tests cover standalone composed installs as well as the complete inventory.
Add docs catalog entries and consumer fixtures with each new component; helpers and variants
do not count as separate primary components. See the [100-component roadmap](roadmap-100.md)
for the phased plan and acceptance gates.

Registry build reads canonical source and rewrites only the internal core import path.
Turbo inputs include those sources so cached registries cannot silently become stale.
The CLI reads only the bundled registry, validates project paths, preflights conflicts and
copies source with exclusive writes. It does not download or execute third-party templates.

The Next.js docs app serves /ui and shares the Vite Showcase fixture. It builds in its own
directory and does not modify the private Dev Station app, DNS, hosting, databases or auth.
Its server-only published-release loader validates all six npm stable tags and caches the
result for five minutes. ISR refreshes release labels without a build. The verified fallback
is independent of workspace metadata; API examples and MCP source pins remain versioned.
The loader's bounded input, timeout and fallback tests run under the docs app's `test` task.
Production reverse-proxy integration must route /ui and Next assets without colliding with
the main site's assets; that deployment is not performed here.

Future adapters must implement labeling, refs/focus, SSR IDs and lifecycle cleanup in their
own framework while reusing core navigation and token CSS. Do not ship empty framework
packages or promise adapters before testing actual applications.

## 100-component release

The inventory is exactly 100 primary names in the 0.3.0 source and npm releases. Card helpers, variants and composed
application/AI examples do not inflate that count. `completion-catalog.ts` and
`CompletionPreview.tsx` provide explicit API examples for the final 50. Installed consumers
share the canonical completion fixture to exercise all additions on React 18 and 19.
Popover owns nonmodal positioning/dismissal; native Dialog owns modality for Drawer,
AlertDialog, CommandPalette, Lightbox and OnboardingTour. Backend services remain application-owned.

Documentation API/example catalogs stay on the server. Navigation receives only name,
slug and description; the server chooses the preview batch. Client preview shells do not
import the full API/code catalog. Keep that boundary when extending the documentation.

## Optional MCP developer tooling

`packages/mcp` is a private, locally connectable stdio server. Its build creates a bundled
snapshot from the canonical catalog, workspace registry and a pinned npm alias of the
published 0.2.0 registry. Requests read that snapshot; they cannot access arbitrary project
paths, execute commands, write files or fetch remote registries. Published source is the
default, workspace source is explicit and unreleased, and unsupported versions are rejected.
The official server SDK and schema validator remain isolated from all six public UI packages.
The same server factory registers tools, resources and prompts; the SDK's `serveStdio`
handles modern and legacy negotiation. Original recipe fixtures are checked against each
registry's full source closure, and token declarations come from the matching registry CSS.
Structured output schemas, byte caps and strict input bounds are shared by both eras.
The standalone executable bundles local modules and the snapshot, with only SDK/Zod runtime
dependencies. Build-time registry inputs and Inspector stay development-only. See [MCP](mcp.md).

The docs use a client shell receiving slim metadata and server-rendered content. `/ui` and
`/ui/playground` use the full canvas; inner guides retain documentation navigation. Website
Minimal/Modern/Glass styles compose the existing tokens and adaptive Glass material.
The live editor debounces HTML/CSS updates and retains the script-blocking sandbox/CSP;
edited TSX remains an export workflow.
