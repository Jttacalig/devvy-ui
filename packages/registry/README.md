# Source registry

`pnpm build` generates `dist/registry.json` from the React components, shared core and
CSS. Source ownership and package mode use these same implementations. No separately
maintained templates. The alpha registry is bundled locally; no network fetch or code execution.

The 17 entries comprise ten foundation components, Glass, Dialog, Dock, Chart, Navbar, Sidebar and Breadcrumbs. Glass copies
its optional material stylesheet and shared capability policy; it is not added by init.
Dialog declares Button as a source dependency. Registry parity checks cover every entry.
