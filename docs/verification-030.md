# DEVVY UI 0.3.0 release verification — 23 October 2026

This record covers the GitHub source release, not npm publication or a website deployment.
The six UI packages and root workspace are versioned at 0.3.0. npm `latest` remains 0.2.0;
the MCP preview is independently versioned at 0.1.0 and remains `private: true`.

Environment: Windows x64, Node 24.19.0, pnpm 11.25.0, React 19.3.1 and TypeScript 5.9.3.
The following checks ran locally against the versioned candidate. GitHub CI is recorded
separately from these local results.

## Changes reviewed

- Documentation shell, landing cards, navigation, native select controls, compact search,
  independent visual styles and dedicated auto-preview playground in `apps/docs`.
- Optional font CSS/assets, upstream OFL notices and scoped typography tokens in
  `packages/styles`; base styles do not import font files.
- Optional DataTable selection and a dialog heading landmark correction in
  `packages/react`; native modal behavior, refs and existing APIs remain intact.
- Separate read-only `packages/mcp` tooling, canonical published/workspace snapshots,
  three new tools, resources/prompts, response bounds and editor setup guides.
- Fixed-group version metadata/changelogs, package checks, CI MCP artifact checks and
  mechanical formatting required by the existing CI formatter.

## Bundle tradeoff

Before the version update, the selection-enabled focused DataTable entry measured **1,970
gzip bytes**, exceeding the old 1,800-byte cap by 170 bytes. This is a real increase for the
new controlled/uncontrolled selection, mixed page checkbox and bulk-action behavior. The
focused cap is deliberately **2,000 bytes** for this feature release; it is not described as
a size improvement. The overall namespace cap remains **29,000 gzip bytes**, and other
component/CSS limits remain unchanged. Benchmarks measure bundling, not interaction speed.
Optional fonts and the MCP server are separate from the production React JavaScript bundle.

## Verification

| Check                                         | Local result                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------ |
| Frozen install, production build              | Passed                                                                         |
| Typecheck, lint, formatting                   | Passed                                                                         |
| Unit/protocol suite                           | 128 passed: 100 React, 6 core, 4 CLI, 18 MCP                                   |
| Package/source parity                         | Passed for all 100 entries and six public packages                             |
| Six-package archives                          | Passed; version 0.3.0                                                          |
| Installed React consumers                     | Passed with React 18.3.1 and 19.3.1                                            |
| MCP standalone archive                        | Passed isolated offline install, modern/legacy stdio, no React dependency      |
| MCP Inspector                                 | Passed strict discovery, tools, resources and prompts as part of the MCP suite |
| Bundle limits                                 | Passed: full namespace 28,143 gzip bytes; DataTable 1,970 gzip bytes           |
| Dependency audit                              | No known vulnerabilities at moderate threshold                                 |
| Focused UI browser checks before version bump | 51 passed across Chromium, Firefox and WebKit                                  |

The complete 540-case production browser suite is running against the 0.3.0 build. Its final
result and remote CI must be checked before the GitHub release is created.

## Limits

- Automated axe checks are not accessibility certification; manual assistive technology and
  real-device review remain valuable.
- Editor configurations were checked against official vendor documentation. Real stdio,
  MCP Inspector and isolated installed archives are tested; interactive sessions in all four
  editors are not claimed.
- npm publishing and deployment require their separate workflows and live verification.
