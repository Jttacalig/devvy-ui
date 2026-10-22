# DEVVY UI CLI (beta, unpublished)

From the workspace, after `pnpm build`:

```sh
node /absolute/path/to/devvy-ui/packages/cli/src/cli.mjs init
node /absolute/path/to/devvy-ui/packages/cli/src/cli.mjs add button tabs
node /absolute/path/to/devvy-ui/packages/cli/src/cli.mjs doctor
```

Run these commands in your React project. Import `src/devvy.css` once, then import
the copied components. The CLI does not install dependencies or modify app entry files.
Add uses the bundled registry, refuses edited-file overwrites and rejects symlinks and
paths outside the project. Keep the source and styling snapshots under your version control.
Doctor checks declarations and files, not full compatibility. Upgrades require manual review.
The target `npx devvy-ui@latest` command is reserved for a future verified publication.

For the optional material, run `add glass dialog dock` with the same local CLI.
Import the copied `src/components/devvy/glass.css` after `src/devvy.css`; check the CLI output
for the actual destination if your configuration changes the component directory. Glass includes
its shared capability policy and stylesheet; Dialog includes its Button dependency.
