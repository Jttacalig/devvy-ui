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
Optional `dependencies` in the inventory name composed component sources. The registry
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
Production reverse-proxy integration must route /ui and Next assets without colliding with
the main site's assets; that deployment is not performed here.

Future adapters must implement labeling, refs/focus, SSR IDs and lifecycle cleanup in their
own framework while reusing core navigation and token CSS. Do not ship empty framework
packages or promise adapters before testing actual applications.
