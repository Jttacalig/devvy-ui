# Source registry

`pnpm build` generates `dist/registry.json` from the React components, shared core and
CSS. Source ownership and package mode use these same implementations. No separately
maintained templates. The registry is bundled locally; no network fetch or code execution.

The 100 entries follow `packages/react/components.json`, including layout, native forms,
disclosure, tables, feedback, charts, navigation and optional Glass. Glass copies
its optional material stylesheet and shared capability policy; it is not added by init.
Composed components declare source dependencies in the inventory; generation copies their
complete closure. Registry parity checks cover every entry, helper, dependency and stylesheet.

Inventory `helpers` lists React-local files such as `widgets.tsx`. Generation collects
helpers across the complete component dependency closure and installs them under `lib/`.
Source installers preserve MIT notices and refuse conflicting edited files.
