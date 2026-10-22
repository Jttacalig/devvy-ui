<img src="apps/docs/public/devvy-logo.png" alt="DEVVY UI logo" width="96" />

# DEVVY UI

**Build once. Style freely. Run anywhere.**

An original, React-first UI foundation by [DEV STATION](https://www.dev-station.dev).
Repository: [Jttacalig/devvy-ui](https://github.com/Jttacalig/devvy-ui).
MIT licensed. Published on npm: [`@devvy-ui/react`](https://www.npmjs.com/package/@devvy-ui/react) (`beta`).
This checkout is independent of the private Dev Station app.

This beta milestone contains **50 of the planned 100 components**. All six packages follow
one fixed Changesets version; website release labels read the React package metadata.
See [the changelog](CHANGELOG.md) and [midpoint verification](docs/verification-midpoint.md).

## Installation

```sh
npm install @devvy-ui/react@beta
# or
pnpm add @devvy-ui/react@beta
# or
yarn add @devvy-ui/react@beta
# or
bun add @devvy-ui/react@beta
```

## Run locally

Requires **Node.js 22.12+** and **pnpm 11.25.0**. Consumer framework requirements are separate
from repository build-tool requirements.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm dev:docs
```

Open [localhost:3000/ui](http://localhost:3000/ui) for searchable docs, interactive component
previews, source, API tables, themes and a responsive playground.

```sh
pnpm --filter devvy-ui-vite-example dev
```

The Vite app is a standalone React example. `apps/docs` is the complete Next.js App Router
example. `examples/vanilla/index.html` demonstrates native HTML with shared CSS and no JavaScript.

## The foundation

| Package              | Delivered                                                                     |
| -------------------- | ----------------------------------------------------------------------------- |
| `@devvy-ui/core`     | DOM-free class, keyboard navigation and material capability utilities         |
| `@devvy-ui/react`    | 50 components: layout, forms, feedback, charts, navigation and optional Glass |
| `@devvy-ui/tokens`   | Scoped light, dark, system, density, typography and contrast tokens           |
| `@devvy-ui/styles`   | Namespaced CSS, focus styles, RTL, reduced motion and forced colors           |
| `@devvy-ui/registry` | Source snapshots generated from those exact implementations                   |
| `@devvy-ui/cli`      | Local `init`, `add` and `doctor`; protects edited source files                |

No runtime styling engine. No Tailwind requirement. React and React DOM are peer dependencies.
Vue, Svelte and Web Components packages are intentionally absent until adapters work.

## Package mode

In a workspace app, declare the packages as `workspace:*` dependencies:

```tsx
import '@devvy-ui/tokens/theme.css';
import '@devvy-ui/styles';
import { Button } from '@devvy-ui/react/button';
import { Input } from '@devvy-ui/react/input';
import { Label } from '@devvy-ui/react/label';

export function Project() {
  return (
    <form>
      <Label htmlFor="project">Project name</Label>
      <Input id="project" name="project" required />
      <Button type="submit">Save project</Button>
    </form>
  );
}
```

Barrel imports also work. Individual entries and `sideEffects` metadata support tree shaking.
All React entries retain client boundaries for Next.js; SSR is supported, but a separate
React Server Component-only rendering API is not shipped. The original
`@devvy-ui/react/styles.css` import remains a compatibility alias.

For external consumption without npm, `pnpm pack:all` writes installable prerelease tarballs into
`.artifacts`. Install core, tokens, styles and react tarballs together. The companion packages
`@devvy-ui/tokens`, `@devvy-ui/styles`, and `@devvy-ui/core` are also published on npm.

## Source ownership

Build the workspace, then run the CLI from your React project's directory:

```sh
node /absolute/path/to/devvy-ui/packages/cli/src/cli.mjs init
node /absolute/path/to/devvy-ui/packages/cli/src/cli.mjs add button tabs
node /absolute/path/to/devvy-ui/packages/cli/src/cli.mjs doctor
```

Import `src/devvy.css` once and import the copied component files. This source installer
uses its bundled registry, does not install dependencies or edit app entry files, and
refuses changed-file overwrites. Styles are a snapshot; upgrades require manual review.
See [CLI documentation](packages/cli/README.md).

## Themes

**DEVVY GLASS** is an optional material in this library. Open `/ui/glass` for a live
dark/light material lab, adaptive quality, lighting, frost and opacity controls.
Import `@devvy-ui/styles/glass.css` after the base styles and wrap existing components
in `<Glass quality="auto">`. Glass, Dialog and Dock have independent React entries;
ordinary Button imports exclude their logic. No new runtime dependency was added.
See [the glass guide](docs/glass.md) for APIs, fallbacks and main-site hosting requirements.

Customize the actual code at `/ui/playground#code-playground`: edit CSS and HTML, apply it
in an isolated preview, and export a theme or standalone design. Component pages also offer
editable TSX source with copy/download actions. See [customization](docs/customization.md)
for using those edits with React or owning the implementation through the CLI.

Set `data-devvy-theme="light"`, `"dark"` or `"system"` on the root or a preview container.
Use `data-devvy-density="compact"` or `"comfortable"`,
`data-devvy-typography="mono"`, or `data-devvy-contrast="high"` on a container.
Override `--dvy-brand`, `--dvy-on-brand`, `--dvy-font` and radius tokens after the theme import.
Tabs requires an explicit `dir="rtl"` prop for RTL arrow navigation.

## Working with AI

Start with [AGENTS.md](AGENTS.md) and the [DEVVY UI skill](.agents/skills/devvy-ui/SKILL.md).
The skill covers component creation, theming, package integration and updates that preserve
owned source. Claude, Copilot and Cursor entry points share the same repository guidance.
See [the AI contributor guide](docs/ai.md) for invocation, consumer setup and maintenance.

## Verify and release

| Command                        | Purpose                                                                |
| ------------------------------ | ---------------------------------------------------------------------- |
| `pnpm build`                   | Turbo builds core, React declarations, registry, Vite and Next.js      |
| `pnpm typecheck`               | Strict TypeScript checks                                               |
| `pnpm lint`                    | Code and JSX accessibility rules                                       |
| `pnpm test`                    | Core, component, axe, SSR, hydration and CLI tests                     |
| `pnpm check:packages`          | Public exports, declarations, licenses and registry parity             |
| `pnpm exec playwright install` | Install browser test engines                                           |
| `pnpm test:browser`            | Production docs tests in Chromium, Firefox and WebKit                  |
| `pnpm bench`                   | Reproducible compressed sizes, CSS, SSR comparison and size budgets    |
| `pnpm pack:all`                | Prepare six installable prerelease tarballs                            |
| `pnpm test:consumer 18.3.1`    | Install packed packages and verify React 18 SSR/hydration/interactions |
| `pnpm test:consumer 19.3.1`    | Equivalent React 19 consumer check                                     |
| `pnpm audit`                   | Dependency advisory check                                              |
| `pnpm changeset`               | Propose a versioned package change                                     |

CI is configured for Node 22/24, installed React 18/19 consumers and all three browser engines.
Configured workflows are not proof of a successful public CI run. Local evidence and limitations
are recorded in [verification](docs/verification.md) and [compatibility](docs/compatibility.md).

Browser tests start a production preview and refuse to reuse an existing server by default.
Set `DEVVY_DOCS_PORT` to a free port if your development server is already on port 3000.
Only set `DEVVY_REUSE_DOCS_SERVER=1` when intentionally testing an identified production
preview of the current build. Build before running the browser suite.
The suite defaults to two workers locally and in CI; use the explicit `--workers` option
only when intentionally testing a different concurrency level.

The protected release-preflight workflow builds tarballs without publishing. Configure the
`npm-alpha` environment with required reviewers, verify scope ownership and provenance,
then follow [release instructions](docs/publish.md). Do not publish a stable tag for this prerelease.

## Project documentation

[Audit](docs/audit.md) · [Architecture](docs/architecture.md) ·
[Accessibility](docs/accessibility.md) · [Performance](docs/performance.md) ·
[Roadmap](ROADMAP.md) · [Contributing](CONTRIBUTING.md) ·
[100-component plan](docs/roadmap-100.md) ·
[Governance](GOVERNANCE.md) · [Security](SECURITY.md) · [MIT license](LICENSE)

This project is not affiliated with shadcn/ui, Base UI, Radix UI or React maintainers.
Radix Tabs is a development-only benchmark comparator, not an implementation dependency.
