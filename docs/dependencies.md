# Dependency inventory

The six distributable DEVVY packages depend only on other DEVVY packages, with React
and React DOM as external peers for the React adapter. Their tarballs contain original
source/build output and an MIT LICENSE. No third-party primitive implementation is embedded.
Radix Tabs is a root development dependency used only by the comparison harness.

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
