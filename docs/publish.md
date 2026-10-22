# Repository and beta release workflow

DEVVY UI uses [Jttacalig/devvy-ui](https://github.com/Jttacalig/devvy-ui) and dedicated
feature branches with reviewable pull requests. Keep the private Dev Station application
independent of this repository. Review source, licenses, generated package contents and CI
before merging. Do not push directly to protected main.

The current local package candidate is **0.1.0-beta.2**, with 50 implemented components.
It remains unpublished. All six public packages follow the fixed Changesets group; root
workspace metadata matches them. Website labels derive from the React package manifest.
Historical changelogs and verification snapshots retain their original versions.

## Beta release preflight

Use Node 22.12+ and pnpm 11.25.0. `pnpm install --frozen-lockfile` must pass.
Run all README verification commands, including the installed-tarball React 18/19 consumers.
`pnpm pack:all` prepares all six tarballs and rewrites workspace dependency ranges for npm.
Review their contents and package manifests; never publish workspace-only references.

The release-preflight workflow runs only on main and references the legacy-named `npm-alpha`
GitHub environment. Its name does not change the current beta package channel. The repository owner must configure required reviewers; this source file
cannot enforce GitHub environment or branch protections by itself. It uploads packages
for review and does not publish automatically.

Use `pnpm changeset` for package changes. The checked-in prerelease state keeps the release
channel beta. After reviewing the proposal with `pnpm changeset status` and obtaining
authorization for a version advance, run `pnpm version-packages`. Align the private root
version, README, root changelog and current release guidance; preserve historical records.
Rebuild/retest and pack the new versions. Publication is a separate authorized maintainer
action through configured trusted publishing or short-lived scoped credentials using
`pnpm release`. Confirm the npm dist-tag is beta. Do not place tokens
in files or logs. First check scope and binary-name ownership, package provenance,
dependency licenses, logo rights, security reporting contacts and clean consumer installs.

Configure automatic secret scanning, dependency alerts and required CI checks in GitHub.
Update dependencies through Dependabot review PRs; keep the lockfile committed and rerun
browser, package-consumer and bundle checks for upgrades. Public CI and publishing remain
maintainer actions; a local version bump does not publish packages.

Licensing and public repo visibility are different: the MIT LICENSE grants reuse permissions, while a public repository makes the source accessible. Both matter for an open-source release.
