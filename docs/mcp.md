# DEVVY UI MCP

Optional local, read-only tooling. **Private, not published on npm, no hosted endpoint.**
`devvy-ui-mcp` has no dependency path into production React, core, tokens or styles.
Its preview version is independent of the six public UI packages.

## Build

Use the repository's pinned pnpm and supported Node version. Inspector requires
Node `>=22.19.0`; local verification uses Node 24.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --filter devvy-ui-mcp test
```

Connect clients to the absolute path of `packages/mcp/dist/server.mjs`. Replace every
example path below. If your editor cannot find Node, also use its absolute executable path.
Windows JSON paths may use forward slashes: `C:/Projects/devvy-ui/...`.
No API key, AI provider, account or HTTP listener is required. DEVVY never edits client
configuration or approval settings automatically.

## Codex

```sh
codex mcp add devvy-ui -- node /absolute/path/devvy-ui/packages/mcp/dist/server.mjs
codex mcp list
```

Alternatively merge into your Codex `config.toml`:

```toml
[mcp_servers.devvy-ui]
command = "node"
args = ["/absolute/path/devvy-ui/packages/mcp/dist/server.mjs"]
```

Reference: [official Codex MCP configuration](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

## Claude Code

```sh
claude mcp add --transport stdio devvy-ui -- node /absolute/path/devvy-ui/packages/mcp/dist/server.mjs
claude mcp list
```

For shared project setup use Claude Code's project scope, or merge the `mcpServers`
configuration below into `.mcp.json`. Review the project's trust prompt.
Reference: [official Claude Code setup](https://code.claude.com/docs/en/mcp).

## Cursor

Merge into `.cursor/mcp.json` for the project or `~/.cursor/mcp.json` for personal use:

```json
{
  "mcpServers": {
    "devvy-ui": {
      "command": "node",
      "args": ["/absolute/path/devvy-ui/packages/mcp/dist/server.mjs"]
    }
  }
}
```

Enable the server in MCP customizations and confirm tool discovery.
Reference: [official Cursor configuration](https://cursor.com/docs/mcp).

## VS Code

Run **MCP: Add Server**, choose **Command (stdio)** and provide Node and the built server
path. Choose the destination for your agent harness. For VS Code's workspace format,
merge into `.vscode/mcp.json`:

```json
{
  "servers": {
    "devvy-ui": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/devvy-ui/packages/mcp/dist/server.mjs"]
    }
  }
}
```

Copilot Global uses a different destination; use the guided flow for that harness. Review
trust, then enable the server in chat's tool selection. Reference:
[official VS Code setup](https://code.visualstudio.com/docs/agent-customization/mcp-servers).
Vendor documentation supports these configurations; protocol tests do not establish that
an interactive session was tested in every editor.

## Tools and bounds

The original five tool names/defaults remain intact. All eight tools are read-only:

| Tool                     | Result and bounds                                                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `search_components`      | Supported components; query <=200 characters, limit 1–20                                                   |
| `get_component`          | Canonical TypeScript API and focused package import                                                        |
| `get_source`             | Complete dependency/helper/source closure and MIT notices; styles opt-in                                   |
| `get_guide`              | Whitelisted guide; explicitly workspace-only instructions                                                  |
| `get_installation_plan`  | Package/source commands as data, never executed; 1–20 slugs                                                |
| `get_design_tokens`      | Canonical declarations, selectors and media conditions; category/theme filters; offset 0–1000, limit 1–100 |
| `get_component_examples` | Original verified compositions; resolved imports, dependencies, styles, attribution; limit 1–3             |
| `get_ui_recipe`          | `settings-form`, `project-dashboard` or `glass-workspace`; complete typed composition and requirements     |

Example coverage is curated. A supported component without an example returns an empty
list with an explanation. Every recipe variant is type-checked against its version's
canonical registry source. Recipes reference real supported components and add no new
component names. Connect your own data/persistence and supply unique IDs for repeated forms.

```json
{"name":"get_design_tokens","arguments":{"category":"typography","version":"0.3.1"}}
{"name":"get_component_examples","arguments":{"slug":"data-table","version":"workspace"}}
{"name":"get_ui_recipe","arguments":{"recipe":"glass-workspace","version":"0.3.1"}}
```

## Version and response contract

`version` accepts only **`0.3.1`** (default) and **`workspace`**. Published data uses the
immutable `@devvy-ui/registry@0.3.1` pinned npm alias at build time. Workspace source is a
separate, explicitly unreleased snapshot with baseline commit and dirty state. Responses
include registry SHA-256 provenance. Published 0.3.1 supports the row selection introduced
in 0.3.0; future workspace changes remain separate. Tokens come from the selected registry's stylesheet, not live website overrides;
CSS `var()` values/media conditions remain declarations, not browser-computed colors.

Tools return `structuredContent` and equivalent JSON text with output schemas. Encoded
tool responses are capped at **384 KiB** before SDK wire metadata. Oversized source returns
`RESPONSE_TOO_LARGE` with smaller-request guidance, never silently truncated files.
Resources are bounded, prompt context is capped at 48 KiB and stdio input buffering at
4 MiB. Invalid keys, versions, types, ranges, slugs and recipes are rejected. Runtime
requests only read the bundled snapshot: no arbitrary file/URL reads, shell commands,
writes, credentials or AI calls.

The official SDK 2.3.1 `serveStdio` entry point handles current **2026-07-28** negotiation
and legacy stdio clients. Discovery, JSON-RPC and validation remain SDK-owned. References:
[SDK protocol versions](https://ts.sdk.modelcontextprotocol.io/v2/protocol-versions),
[current tools specification](https://modelcontextprotocol.io/specification/2026-07-28/server/tools).

## Resources and prompts

`resources/list` discovers nine entries: `devvy://about`, and `devvy://catalog/{version}`,
`devvy://tokens/{version}`, `devvy://examples/{version}`, `devvy://recipes/{version}` for
both versions. Example/recipe indexes list real IDs/components; corresponding tools return
full code. Token resources include pagination metadata.

`prompts/list` discovers `build_ui` (recipe/version), `customize_theme` (theme/version) and
`review_component` (slug/version). They supply bounded context and workflows; retrieving
a prompt does not execute tools or grant permission to run commands.

## Verification and standalone preparation

```sh
pnpm --filter devvy-ui-mcp test:inspector
pnpm --filter devvy-ui-mcp test:package
pnpm --filter devvy-ui-mcp check:artifact
pnpm --filter devvy-ui-mcp pack --pack-destination ../../.artifacts
```

Pinned Inspector 2.12.0 is development-only. Tests run its real CLI with modern negotiation,
strict schema checks and a generated read-only local config. They do not open a web listener
or edit the user's global Inspector catalog. Its source-checkout postinstall cascade is
explicitly disabled; published client builds are already included.

The archive contains the executable, bundled snapshot, README and MIT LICENSE. Only SDK
server and Zod are runtime dependencies. Registry inputs, Inspector, client SDK and
TypeScript remain development-only. The package test installs the archive offline into an
isolated consumer and calls its real server. No repository files are needed at runtime.

**Publishing remains disabled through `private: true`.** A future release requires explicit
authorization and review of npm name/ownership, independent version, packed files/notices,
clean reviewed snapshot provenance, tests, Inspector, audit and documentation. Rebuild from
the reviewed commit before release. Do not change the six UI package versions or introduce
MCP dependencies into their manifests. No build/test/pack command publishes a package.

DEVVY compositions/source are MIT with Dev Station / contributor attribution. Preserve
notices. SDK server/client are Apache-2.0; Zod MIT. Inspector retains its own upstream
notices and is tooling only.
