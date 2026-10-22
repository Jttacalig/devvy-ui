# Contributing to Devvy UI

The current v0.2.0 Stable release contains 100 primary components. Read
[architecture](docs/architecture.md), [compatibility](docs/compatibility.md) and
[current verification](docs/verification-100.md) before changing a public contract.

## Before you start

1. Check existing issues and open a proposal for major API changes.
2. Keep component behavior framework-native and dependency-light.
3. Do not copy source code from other libraries without verifying the license, preserving required notices, and identifying provenance.
4. Add tests for behavior and accessibility-related changes; update docs alongside API changes.

## Local workflow

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm check:packages
pnpm exec playwright install
pnpm test:browser
pnpm bench
```

Create a feature branch and open a focused pull request. Include the motivation, reproduction steps for bugs, screenshots for visual changes, and any compatibility or accessibility implications.

Use Node 22.12+ and pnpm 11.25.0. Add `pnpm changeset` for public package changes.
Run `pnpm pack:all` and the React 18/19 `test:consumer` fixtures after changing exports or SSR behavior.
Use `pnpm format` for formatting. Dependency changes require lockfile review and `pnpm audit`.
Release notes and version history credit contributors; see GOVERNANCE.md for decision making.

## Style principles

- Prefer real `<button>`, `<input>`, and semantic HTML instead of reimplementing native behavior.
- Support both controlled and uncontrolled props when relevant.
- Avoid `any`, implicit dependencies, or unconditional browser APIs during SSR.
- Export focused, tree-shakable entry points.
- Use CSS variables for tokens and respect `prefers-reduced-motion`.
- Test behavior, not implementation internals.

## Working with coding assistants

AI-assisted contributions are welcome. Start with [AGENTS.md](AGENTS.md) and the
[DEVVY UI skill](.agents/skills/devvy-ui/SKILL.md); see [docs/ai.md](docs/ai.md) for tool
entry points and examples. Contributors remain responsible for the submitted code,
licenses and actual verification. When architecture or commands change, update the shared
instructions and relevant skill reference alongside the implementation.

## Code review

Maintainers review changes for correctness, readability, security, compatibility, documentation and bundle impact. Submitting a patch does not guarantee that it will be merged.

By contributing, you agree to license your contribution under this repository's MIT license. You confirm you have the right to submit the work.

## Inventory and composed components

Use `packages/react/components.json` for primary names. Keep explicit barrel/package exports,
API catalog examples, consumer fixtures and source snapshots aligned. Declare composed
components in `dependencies` and React-local shared files in `helpers`; never edit registry
JSON. Preserve the existing 50-component bundle baseline when measuring new additions.
AI compositions and product-specific wrappers should use existing primitives first.

The stable release uses npm `latest` after an explicit maintainer publication; the existing
`beta` tag continues to identify historical prereleases. See [publishing](docs/publish.md).
