# Repository and stable release workflow

Use feature branches and reviewable pull requests in
[Jttacalig/devvy-ui](https://github.com/Jttacalig/devvy-ui). Review source, licenses,
package contents and CI before merging; do not push directly to protected main.

**DEVVY UI v0.3.1 Stable is released on GitHub and npm.** Its six UI packages are
versioned together. npm publication is a separate, explicitly authorized action; the
optional MCP developer package remains private and is excluded from the six-package publication.

All six published packages report version 0.3.1 and
`latest: 0.3.1` in the live npm registry, verified on 24 October 2026 (Asia/Manila). The historical
`beta` tag remains at 0.1.0-beta.2. The 100-component library uses one fixed six-package
Changesets group. Publication does not deploy the documentation website.

See [npm release verification](verification-npm-030.md) for the publication checks and
the stale README discovered after publishing. npm renders the README shipped with a
package; changing GitHub or dist-tags does not replace it. Correct package README inputs
and publish a new, reviewed patch version to update npm's rendered documentation. Never
attempt to overwrite an existing release.

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

Publishing first requires a successful `CI` workflow for the **exact main commit**. If CI
is pending, missing or failed, publishing stops immediately with a clear error; finish CI
and dispatch publishing again. The three browser engines run in two shards each in CI,
with one retry and a twelve-minute Playwright limit per shard. The publish job reuses that
successful browser gate instead of repeating all browser tests. Every existing test remains
covered, and the shard reports are merged into the `browser-report` artifact.

After review, merge and explicit release authorization, dispatch that workflow from main.
The preflight workflow only uploads artifacts. Publication uses npm OIDC rather than a
committed token. Never place credentials in files or logs.

Verify all six names (tokens, styles, core, react, registry, cli) report the authorized version
and latest points to that version. Interrupted releases skip existing versions; check every tag before
claiming success. Preserve the historical beta tag. Never overwrite an npm version.

The landing page, shared header/footer and default installation version read the six npm
`latest` tags automatically on the documentation server. Successful results are cached for
five minutes. All six tags must agree on a stable version; malformed data, partial releases,
registry errors and requests exceeding 2.5 seconds do not imply a new release. Next.js keeps
the last successful cached result on a failed refresh. A cold failure uses the verified
`publishedNpmVersion` baseline in `apps/docs/lib/release.ts`. Normal future publications
need no label edit or documentation rebuild. Refreshes are request-driven: the first visit
after expiry can serve the previous value while regeneration completes.

Source/API examples, historical changelogs and the MCP registry pin remain tied to their
own versions. Live labels do not upgrade the documented component implementations.
Only after live verification, optionally advance the fallback baseline and current release
notes. Confirm a clean external
install using `npm install @devvy-ui/react`. Package publication does not deploy docs;
verify production routing separately.

## Future updates

Add a Changeset for public changes. Review `pnpm changeset status` before an authorized
`pnpm version-packages`; align root metadata and current guidance. Rebuild, test and pack.
Do not re-enter prerelease mode for ordinary stable patches. Dependency updates require
lockfile, peer/license, audit and consumer review. Configure required checks, dependency
alerts, secret scanning and private reporting in the hosting services.
