# Publish Devvy UI to GitHub

The user supplied the public repository [Jttacalig/devvy-ui](https://github.com/Jttacalig/devvy-ui).
It was verified empty on 21 October 2026. This checkout has a local main branch and that
repository configured as origin. No commit, push or package publication was performed.

1. Review `git status`, the source and ignored build artifacts. Keep the private Dev Station
   application independent of this public component library.
2. When ready to upload the reviewed implementation, from this checkout:

```bash
git remote -v
git add .
git commit -m "chore: initial MIT-licensed Devvy UI alpha"
git push -u origin main
```

3. On GitHub, verify visibility is **Public** and the `LICENSE` file displays **MIT**.
4. Enable Discussions, issue templates, branch protections and private vulnerability reporting.
5. Let CI complete successfully before announcing that the build is verified.
6. Check ownership of the proposed `@devvy-ui` npm namespace. Update package names if unavailable. Build, test and publish via npm only when packages are stable enough for alpha testers.

## Alpha release preflight

Use Node 22.12+ and pnpm 11.25.0. `pnpm install --frozen-lockfile` must pass.
Run all README verification commands, including the installed-tarball React 18/19 consumers.
`pnpm pack:all` prepares all six tarballs and rewrites workspace dependency ranges for npm.
Review their contents and package manifests; never publish workspace-only references.

The release-preflight workflow runs only on main and references the `npm-alpha` GitHub
environment. The repository owner must configure required reviewers; this source file
cannot enforce GitHub environment or branch protections by itself. It uploads packages
for review and does not publish automatically.

Use Changesets for package changes. The checked-in prerelease state keeps the release
channel alpha. After reviewing Changesets' version proposal, run `pnpm version-packages`,
rebuild/retest, then publish through configured trusted publishing or short-lived scoped
credentials using `pnpm release`. Confirm the npm dist-tag is alpha. Do not place tokens
in files or logs. First check scope and binary-name ownership, package provenance,
dependency licenses, logo rights, security reporting contacts and clean consumer installs.

Configure automatic secret scanning, dependency alerts and required CI checks in GitHub.
Update dependencies through Dependabot review PRs; keep the lockfile committed and rerun
browser, package-consumer and bundle checks for upgrades. Public CI and publishing remain
maintainer actions; configuring origin does not upload this implementation.

Licensing and public repo visibility are different: the MIT LICENSE grants reuse permissions, while a public repository makes the source accessible. Both matter for an open-source release.
