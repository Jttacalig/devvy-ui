# Dependency inventory

The six distributable DEVVY packages depend only on other DEVVY packages, with React
and React DOM as external peers for the React adapter. Their tarballs contain original
source/build output and an MIT LICENSE. No third-party primitive implementation is embedded.
The optional styles font entries, published since v0.3.0, also bundle unmodified Geist, Geist Mono and
Manrope variable Latin WOFF2 assets under SIL OFL 1.1. Their copyright/license files and
Manrope FONTLOG are included in `packages/styles/fonts`, with source URLs and sizes in its
README. These fonts are independently licensed and never imported by the base stylesheet.
Radix Tabs is a root development dependency used only by the comparison harness.

The optional private `devvy-ui-mcp` workspace is separate from those six public packages.
It pins the official MCP server SDK 2.3.1 (Apache-2.0) and Zod 4.6.7 (MIT); the client SDK
2.3.1 is used only for protocol tests. Inspector 2.12.0 and TypeScript 5.9.3 are development-only;
Inspector's source-checkout postinstall is explicitly disabled because published client builds
are included. Its upstream LICENSE describes the MIT/Apache-2.0 transition and retained notices.
Registry inputs are build-only dependencies, excluded from the standalone runtime dependency graph.
Its published-registry npm alias pins original
`@devvy-ui/registry@0.2.0` (MIT), while its workspace registry dependency supplies explicitly
unreleased source. These dependencies have no path into the React or styling bundles.
The same-day published registry has an explicit, pinned minimum-release-age exception;
the third-party SDK versions do not bypass that policy. Review the lockfile and upstream
notices before distributing the developer tool.

`pnpm licenses list --json` generated a local inventory at
`.artifacts/dependency-licenses.json` on 21 October 2026. The installed development/docs
graph reported MIT, MIT-0, Apache-2.0, MPL-2.0, Python-2.0, CC-BY-4.0, BSD-2-Clause,
BSD-3-Clause, ISC, CC0-1.0, BlueOak-1.0.0, 0BSD, and an Apache/LGPL combination.

Specific entries to retain in tooling or docs distributions:

| Package                          | Reported license                 | Use                                |
| -------------------------------- | -------------------------------- | ---------------------------------- |
| axe-core, @axe-core/playwright   | MPL-2.0                          | Development accessibility checks   |
| lightningcss and platform binary | MPL-2.0                          | Documentation/build tooling        |
| @img/sharp-win32-x64             | Apache-2.0 AND LGPL-3.0-or-later | Next.js image toolchain on Windows |
| caniuse-lite                     | CC-BY-4.0                        | Build-tool browser data            |

Keep upstream license files/notices when distributing those dependencies. The generated
inventory is metadata for review, not a claim that third-party code is relicensed under MIT.
Review the actual artifacts and license files for each release target, including Linux images.
No dependency was copied into DEVVY's source ownership components.

Versions are pinned and a lockfile is committed. CI uses frozen installs and audits.
esbuild is the only installed dependency with a required build script here; sharp is also
explicitly allowed for platform-specific image tooling. There is no broad allow-all policy.
