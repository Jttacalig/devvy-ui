# npm 0.3.0 release documentation verification — 23 October 2026

Read-only live npm queries verified all six UI packages (`react`, `core`, `tokens`,
`styles`, `registry`, `cli`) expose version `0.3.0` with `latest: 0.3.0` and
`beta: 0.1.0-beta.2`. These are registry observations, not evidence of a docs deployment.
The optional MCP package remains private. Its published source is still deliberately
pinned to the immutable 0.2.0 registry; this correction does not change its version contract.

The npm website screenshot still displayed 0.2.0. A registry query for
`@devvy-ui/react@0.3.0` confirmed its README itself also contained stale 0.2.0 release
claims. Website caching alone does not explain all of the outdated content.

Corrected source inputs cover the landing npm label, SEO description, installation and
font guidance, table selection availability, current repository guidance and package
READMEs. Historical release records and the pinned MCP 0.2.0 source are preserved.
Published package README introductions now avoid declaring a moving current version.

npm renders the README supplied during publication. A new reviewed patch release is
required to replace that README; see [npm's README instructions](https://docs.npmjs.com/about-package-readme-files/).
At this initial correction stage, a patch Changeset was prepared for the six-package fixed
group, with versions still at 0.3.0 and no publication, push or deployment performed.
The user subsequently authorized the 0.3.1 release and automatic version implementation;
see [0.3.1 verification](verification-031.md) for that follow-up.

## Local checks for this correction

- `pnpm build`: passed, including all 114 generated documentation pages.
- `pnpm typecheck`, `pnpm lint` and `pnpm format:check`: passed.
- `pnpm pack:all`: passed for all six UI packages. Inspected the React archive's
  `package/README.md` and confirmed the corrected introduction and stable install example.
- Built HTML assertions: landing npm label, SEO description, pinned install version and
  font availability match 0.3.0. The first literal installation assertion failed because
  React inserts HTML comments between text nodes; stripping tags/comments confirmed the
  visible command. No application change was needed for that assertion.
- No component behavior, styles or dependencies changed. Browser interaction and unit
  suites were not rerun for these text and release metadata corrections.
