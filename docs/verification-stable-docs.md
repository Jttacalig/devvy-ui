# Stable documentation update — 23 October 2026

This focused website update presents **DEVVY UI v0.2.0 Stable** and the existing
100-component inventory. It changes release messaging, installation guidance, landing
page entry points, canonical URLs, page titles, descriptions, Open Graph/Twitter metadata
and SoftwareSourceCode structured data. Component implementations, package versions,
dependencies, lockfile and playground isolation are unchanged.

## Published package verification

The live npm registry reports version **0.2.0** and `latest: 0.2.0` for all six scoped
packages: react, core, tokens, styles, registry and cli. Their historical `beta` tag remains
at **0.1.0-beta.2**. Published homepage fields point to the official `/ui` website.
React peers are `^18.2.0 || ^19.0.0`; core, styles and tokens resolve transitively.
The documented CSS exports and focused React entries are present in the published manifests.

A fresh external npm project ran `npm install @devvy-ui/react`, resolving 0.2.0.
The installed consumer fixture passed all 100 primary focused exports, optional chart
inspection, SSR, hydration, mixed state, dialog fallback and keyboard interaction on
React 19.3.1. The published scoped CLI successfully ran `init`, `add button tabs card`
and `doctor`. Registry manifests and local evidence are in
`.artifacts/published-stable.json` and `.artifacts/published-stable-consumer/`.

## Checks run for this update

Environment: Windows x64, Node 24.19.0, pnpm 11.25.0.

| Check                             | Result                                                                       |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `pnpm build`                      | Passed: packages, Vite example and 112 production docs routes                |
| `pnpm typecheck`                  | Passed                                                                       |
| `pnpm lint`                       | Passed                                                                       |
| `pnpm test`                       | Passed: 107 unit/installer tests                                             |
| `pnpm format:check`               | Passed                                                                       |
| Relevant production browser tests | 57 passed in one run: 19 each in Chromium, Firefox and WebKit                |
| Published npm consumer            | Passed on React 19.3.1; npm reported no known vulnerabilities in the fixture |

Browser coverage includes all 100 component routes with stable labels, imports, CLI
commands and unique metadata; npm/pnpm/Yarn/Bun tabs; release destination links; structured
data; documentation navigation and 404 handling; responsive light/dark layouts at
320, 677, 768, 1024 and 1440 pixels; Glass controls/dialog focus; component filtering;
CSS/HTML playground isolation and editable TSX export. Existing automated axe checks
passed for the selected responsive documentation and Glass pages.

The selection was run with `DEVVY_DOCS_PORT=60060` against the current production build.
Raw results: `.artifacts/stable-docs-browser.log` and
`.artifacts/browser-results-stable-docs.json`. Implementation-wide results remain in
[the 100-component record](verification-100.md); this docs update did not rerun the
complete release/consumer matrix or bundle benchmarks.

The local Markdown link check covered 48 files and found no broken targets.

## Limits

No production deployment was performed or verified. The in-app browser inspection tool
rejected access to the local preview through its URL policy; it was not bypassed.
Responsive checks and screenshots came from the repository's browser suite before that
attempt. Manual assistive-technology and device review remains separate from automated
axe checks. The published CLI's help text still contains a historical beta/unpublished
sentence; its documented installation commands work. Correcting that shipped text requires
a separately authorized package update, rather than replacing an existing npm version.

## Files updated

- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `README.md`
- `SECURITY.md`
- `apps/docs/app/layout.tsx`
- `apps/docs/app/site.css`
- `apps/docs/app/ui/[section]/page.tsx`
- `apps/docs/app/ui/components/[slug]/page.tsx`
- `apps/docs/app/ui/glass/page.tsx`
- `apps/docs/app/ui/layout.tsx`
- `apps/docs/app/ui/page.tsx`
- `apps/docs/components/LandingHeroBar.tsx`
- `apps/docs/components/LandingInstall.tsx`
- `apps/docs/components/LandingShowcase.tsx`
- `apps/docs/components/Navigation.tsx`
- `apps/docs/lib/metadata.ts`
- `apps/docs/lib/release.ts`
- `docs/ai-interfaces.md`
- `docs/architecture.md`
- `docs/compatibility.md`
- `docs/customization.md`
- `docs/design-direction.md`
- `docs/performance.md`
- `docs/publish.md`
- `docs/roadmap-100.md`
- `docs/verification-100.md`
- `docs/verification-foundations.md`
- `docs/verification-midpoint.md`
- `docs/verification-stable-docs.md`
- `docs/verification.md`
- `packages/cli/README.md`
- `packages/core/README.md`
- `packages/react/README.md`
- `packages/styles/README.md`
- `packages/tokens/README.md`
- `tests/browser/data-navigation.spec.ts`
- `tests/browser/release.spec.ts`
