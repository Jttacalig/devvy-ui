# Repository and stable release workflow

Use feature branches and reviewable pull requests in
[Jttacalig/devvy-ui](https://github.com/Jttacalig/devvy-ui). Review source, licenses,
package contents and CI before merging; do not push directly to protected main.

**DEVVY UI v0.3.0 is the current GitHub source release.** Its six workspace packages are
versioned together. npm publication is a separate, explicitly authorized action; the
optional MCP developer package remains private and is excluded from the six-package publication.

**DEVVY UI v0.2.0 Stable is published on npm.** All six published packages report version 0.2.0 and
`latest: 0.2.0` in the live npm registry, verified on 23 October 2026. The historical
`beta` tag remains at 0.1.0-beta.2. The 100-component library uses one fixed six-package
Changesets group. Publication does not deploy the documentation website.

The following workflow applies to future authorized releases. Preserve historical changelogs.

## Preflight

Use Node 22.12+ and pnpm 11.25.0. Install with `pnpm install --frozen-lockfile`. Run the
complete CI matrix: build, types, lint, formatting, unit tests, source/package parity,
budgets, audit, all three browser engines and installed React 18/19 consumers. See
[verification](verification-100.md) for actual implementation results.

`pnpm pack:all` produces six tarballs and rewrites workspace dependency ranges for npm.
Review manifests, licenses, focused exports, declarations and package contents. Confirm
scope/binary ownership and provenance. Never publish workspace-only references.

## Explicit publication

`.github/workflows/publish-beta.yml` retains its filename for configured npm Trusted
Publishing identities. Its current behavior publishes **stable versions to latest** and
refuses prerelease strings. It is manually dispatched, runs only on main, validates the
candidate and publishes dependencies before dependents with provenance. Its npm-alpha
environment name is legacy; maintainers must configure reviewers and branch protections
in GitHub. Workflow text alone cannot enforce those account settings.

After review, merge and explicit release authorization, dispatch that workflow from main.
The preflight workflow only uploads artifacts. Publication uses npm OIDC rather than a
committed token. Never place credentials in files or logs.

Verify all six names (tokens, styles, core, react, registry, cli) report the authorized version
and latest points to that version. Interrupted releases skip existing versions; check every tag before
claiming success. Preserve the historical beta tag. Never overwrite an npm version.

Only after live verification, update publishedNpmVersion and publishedNpmTag in
`apps/docs/lib/release.ts`, installation hints and current notes. Confirm a clean external
install using `npm install @devvy-ui/react`. Package publication does not deploy docs;
verify production routing separately.

## Future updates

Add a Changeset for public changes. Review `pnpm changeset status` before an authorized
`pnpm version-packages`; align root metadata and current guidance. Rebuild, test and pack.
Do not re-enter prerelease mode for ordinary stable patches. Dependency updates require
lockfile, peer/license, audit and consumer review. Configure required checks, dependency
alerts, secret scanning and private reporting in the hosting services.
