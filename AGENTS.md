# Working on DEVVY UI

DEVVY UI is Dev Station's original MIT component library. Follow the user's requested
scope and preserve unrelated changes. Read the affected implementation before editing;
examples, package mode and copied source must describe the same behavior.

## Source of truth

Read versions and commands from `package.json`, package manifests, `pnpm-lock.yaml` and
`.github/workflows/ci.yml`. See `docs/compatibility.md` for tested targets and
`docs/verification.md` for actual results. Configured CI is not evidence that CI ran.
Do not infer npm publication or a deployed website from repository/package metadata.

| Location                        | Responsibility                                                                |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `packages/core/src`             | DOM-free, framework-independent behavior; no React, browser globals or styles |
| `packages/react/src/components` | Canonical typed React components and colocated behavior/SSR tests             |
| `packages/tokens/src/theme.css` | Scoped light/dark/system design tokens                                        |
| `packages/styles`               | Shared component CSS and the separately imported optional `glass.css`         |
| `packages/registry/build.mjs`   | Generates source snapshots from canonical implementations                     |
| `packages/cli/src`              | Bundled-source installer; validates paths and protects edited files           |
| `apps/docs`                     | Next.js docs at `/ui`, including Glass and code customization                 |
| `examples`                      | Vite/React and vanilla integration examples                                   |
| `tests/browser`, `scripts`      | Browser flows, package/consumer checks and reproducible measurements          |

Change source inputs, not `dist`, `.next`, `.turbo`, `.artifacts` or generated registry JSON.
This repository is independent of the private Dev Station application and its hosting.

## Component and styling contracts

- Preserve native HTML attributes, refs, accessible names, keyboard behavior and native form
  semantics. Follow existing controlled/uncontrolled APIs where relevant.
- Keep render-time code SSR-safe. Browser detection belongs in enhancement effects; use
  stable IDs and clean up effects. Preserve the React client entry boundaries.
- Keep ESM exports, declarations and focused per-component imports working. React/React DOM
  stay peers; shared core must remain framework independent.
- Use `dvy-` classes, `--dvy-` custom properties and scoped `data-devvy-*` attributes.
  Offer customization through native props, classes, variables and source ownership.
- Glass remains optional within DEVVY UI. Base styles must not import `glass.css`; retain
  opaque/reduced-effects, reduced-motion/transparency and forced-color fallbacks. Animate
  opacity/transforms rather than continuously animating blur or layout.
- Keep dialogs' native modal behavior and explicit inline fallback; do not replace them
  with an unreviewed focus trap. Preserve the invoker/focus-return behavior.
- Keep dependencies minimal. Preserve the original identity, supplied logo and MIT notices;
  do not copy proprietary assets or another library's implementation without provenance.
- Preserve the code playground's iframe sandbox and content policy. Edited TSX is exported,
  not executed in the docs. Do not add eval or relax the sandbox to make a test pass.

## Making and verifying changes

Use pnpm with the version declared by `packageManager`; use the root Node engine requirement.
Install with `pnpm install --frozen-lockfile`. Dependency changes must include an intentional
lockfile update. Do not silently upgrade the toolchain during a UI change.

For code changes, run relevant tests, then the applicable repository checks:

| Change                                         | Checks                                                                                                 |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Docs/instruction text only                     | `pnpm format:check`; verify paths, links and command names                                             |
| React/core behavior                            | `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test`                                               |
| User interface/accessibility                   | Build, then relevant `pnpm test:browser` projects; inspect responsive light/dark UI and keyboard focus |
| Public entries, registry or SSR                | `pnpm check:packages`, `pnpm pack:all`, installed React consumer fixtures from the CI matrix           |
| CSS, components or dependencies affecting size | `pnpm bench`; explain regressions rather than raising budgets to conceal them                          |
| Dependencies                                   | Lockfile/peer/license review and `pnpm audit --audit-level=moderate`                                   |

CI defines the complete release verification matrix. Run supported engines; report unavailable
checks honestly rather than deleting them. `pnpm test:browser` can reuse a local production
server: make sure it serves the current build, and only restart a process identified as this
project's preview. Docs-only work does not require unrelated browser/benchmark reruns.

Public package changes require a Changeset and matching docs. Report what changed, checks
actually run and remaining limits. Do not claim accessibility certification or a performance
ranking from axe checks or bundle measurements. Push, publish, version releases and deploy
only within explicit task authorization; routine implementation does not authorize a release.

## Detailed workflows

Use [.agents/skills/devvy-ui/SKILL.md](.agents/skills/devvy-ui/SKILL.md) for component additions,
consumer customization and source updates. Read only its reference relevant to the task.
See [CONTRIBUTING.md](CONTRIBUTING.md), [architecture](docs/architecture.md),
[accessibility](docs/accessibility.md) and [customization](docs/customization.md) as needed.
Update this shared guidance and the skill when architecture or commands change; keep tool
adapters short so they do not become conflicting copies of these rules.
