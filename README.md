<img src="apps/docs/public/devvy-logo.png" alt="DEVVY UI logo" width="96" />

# DEVVY UI

**Build once. Style freely. Run anywhere.**

An original, React-first UI foundation by [DEV STATION](https://www.dev-station.dev).
Repository: [Jttacalig/devvy-ui](https://github.com/Jttacalig/devvy-ui).
MIT licensed. **DEVVY UI v0.3.1** contains **100 React components** and the updated documentation experience.
The release adds optional fonts, table selection and a separate MCP developer preview.
All six public UI packages use npm's `latest` tag for stable releases. The historical `beta`
tag remains at **0.1.0-beta.2**. TypeScript APIs, keyboard accessibility, custom themes,
optional DEVVY GLASS and editable source are included.
Official docs: https://devvy-ui.dev-station.dev/ui. The library is independent of the
private Dev Station app.

The optional [modern font collection](packages/styles/fonts/README.md) is available
at `/ui/fonts`: self-hosted Geist, Manrope and Geist Mono with live specimens and scoped tokens.
These font entries ship in npm 0.3.0; base styles keep the system font default.

All six workspace packages are versioned at **0.3.1** in one fixed Changesets group.
The landing page automatically reads npm's stable tag on the documentation server, with
a five-minute cache and a verified fallback. API/source documentation remains tied to the
checkout; a live version label does not update its component examples. Default installation
commands resolve the published stable release. See [release verification](docs/verification-100.md), [the changelog](CHANGELOG.md),
and [release instructions](docs/publish.md). Source checks are recorded
in [0.3.0 verification](docs/verification-030.md); see [npm release verification](docs/verification-npm-030.md)
for the later publication and documentation correction.
The [0.3.1 verification record](docs/verification-031.md) covers the README correction and
automatic npm version display.

## Installation

```sh
npm install @devvy-ui/react
# or
pnpm add @devvy-ui/react
# or
yarn add @devvy-ui/react
# or
bun add @devvy-ui/react
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

| Package              | Delivered                                                                             |
| -------------------- | ------------------------------------------------------------------------------------- |
| `@devvy-ui/core`     | DOM-free class, keyboard navigation and material capability utilities                 |
| `@devvy-ui/react`    | 100 components: forms, overlays, data, media, application patterns and optional Glass |
| `@devvy-ui/tokens`   | Scoped light, dark, system, density, typography and contrast tokens                   |
| `@devvy-ui/styles`   | Namespaced CSS, focus styles, RTL, reduced motion and forced colors                   |
| `@devvy-ui/registry` | Source snapshots generated from those exact implementations                           |
| `@devvy-ui/cli`      | Local `init`, `add` and `doctor`; protects edited source files                        |

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

For external consumption without npm, `pnpm pack:all` writes installable release tarballs into
`.artifacts`. Install core, tokens, styles and react tarballs together. The companion packages
`@devvy-ui/tokens`, `@devvy-ui/styles`, and `@devvy-ui/core` are also published on npm.

## Source ownership

Run the published CLI from your React project's directory:

```sh
npx @devvy-ui/cli init
npx @devvy-ui/cli add button tabs
npx @devvy-ui/cli doctor
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

Customize the actual code at `/ui/playground#code-playground`: edit CSS and HTML with automatic updates
in a full-width isolated preview, and export a theme or standalone design. Component pages also offer
editable TSX source with copy/download actions. See [customization](docs/customization.md)
for using those edits with React or owning the implementation through the CLI.

Set `data-devvy-theme="light"`, `"dark"` or `"system"` on the root or a preview container.
Use `data-devvy-density="compact"` or `"comfortable"`,
`data-devvy-typography="mono"`, or `data-devvy-contrast="high"` on a container.
Override `--dvy-brand`, `--dvy-on-brand`, `--dvy-font` and radius tokens after the theme import.
Tabs requires an explicit `dir="rtl"` prop for RTL arrow navigation.

## Working with AI

An optional local MCP developer preview is available in `packages/mcp`. Connect your coding
assistant to discover components, read version-specific APIs/source and request installation
plans, version-matched design tokens, verified examples and UI recipes. Discover resources
and reusable prompts without introducing AI into the production UI bundle. It defaults to
published 0.3.1 and labels workspace additions as unreleased. See [editor setup and boundaries](docs/mcp.md).
The optional standalone artifact is prepared but private; the tool is not published on npm and does
not add an AI runtime to your application.

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

## Design and AI interface direction

See [design direction](docs/design-direction.md) for the library-wide review of forms,
menus, navigation, overlays, data and media, and [AI interface compositions](docs/ai-interfaces.md)
for patterns built from existing DEVVY primitives. No AI service or third-party chart
runtime is included. These comparisons do not establish a performance ranking.
