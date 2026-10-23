# DEVVY UI CLI

Run the stable CLI from your React project:

```sh
npx @devvy-ui/cli init
npx @devvy-ui/cli add button tabs
npx @devvy-ui/cli doctor
```

Run these commands in your React project. Import `src/devvy.css` once, then import
the copied components. The CLI does not install dependencies or modify app entry files.
Add uses the bundled registry, refuses edited-file overwrites and rejects symlinks and
paths outside the project. Keep the source and styling snapshots under your version control.
Doctor checks declarations and files, not full compatibility. Upgrades require manual review.
For local development after `pnpm build`, use `node /absolute/path/to/devvy-ui/packages/cli/src/cli.mjs` or install its packed tarball.
The unscoped package name is not the scoped CLI package.

For the optional material, run `add glass dialog dock` with the same local CLI.
Import the copied `src/components/devvy/glass.css` after `src/devvy.css`; check the CLI output
for the actual destination if your configuration changes the component directory. Glass includes
its shared capability policy and stylesheet; Dialog includes its Button dependency.

The stable CLI installs all 100 inventory entries. Composed controls include their
component dependencies and shared React helpers. For example, add gallery installs
Lightbox and Dialog too; add rich-text-editor includes MarkdownViewer. Package name is
@devvy-ui/cli; its binary is devvy-ui. Default installation resolves npm's stable latest tag.

For copied source in Next.js App Router, import interactive components from a client
module marked `use client`. Package builds supply client entry boundaries; source ownership
uses your application’s boundary. Server rendering/hydration and RSC-only execution differ.
