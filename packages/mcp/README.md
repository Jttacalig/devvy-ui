# DEVVY UI MCP developer preview

Optional read-only stdio tooling. **Private, not published on npm, no hosted endpoint.**
No MCP dependency is imported by production React, core, tokens or styles.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --filter devvy-ui-mcp test
```

Connect an MCP client to `node /absolute/path/devvy-ui/packages/mcp/dist/server.mjs`.
The built entry works outside the repository with its bundled snapshot and installed SDK/Zod.
Codex uses `codex mcp add devvy-ui -- node /absolute/path/devvy-ui/packages/mcp/dist/server.mjs`.
Claude Code uses `claude mcp add --transport stdio devvy-ui -- node /absolute/path/devvy-ui/packages/mcp/dist/server.mjs`.
Cursor uses a `mcpServers` object in `.cursor/mcp.json`; VS Code's workspace format uses
`servers` and `type: "stdio"` in `.vscode/mcp.json`. Merge command/args into the right client
configuration. DEVVY does not edit configuration or approval settings automatically.

Eight tools: `search_components`, `get_component`, `get_source`, `get_guide`,
`get_installation_plan`, `get_design_tokens`, `get_component_examples`, `get_ui_recipe`.
Discover versioned catalogs/tokens/example/recipe indexes with `resources/list`, and
`build_ui`, `customize_theme`, `review_component` with `prompts/list`.

Default version **0.3.1** uses the pinned immutable published registry. Choose **workspace**
explicitly for unreleased APIs. Other versions are rejected. Source is the API authority;
workspace guides can discuss additions not on npm. Recipes are original MIT compositions
validated against each version's actual source. Example coverage is curated; unavailable
examples are explicit. Responses include resolved imports, dependencies, styling, attribution
and version provenance. Source preserves the full dependency/helper closure and notices.

Structured tool results include equivalent JSON text and are capped at 384 KiB encoded
before SDK wire metadata. Oversized source returns an actionable error, never truncated files.
Prompt context is capped at 48 KiB and input buffering at 4 MiB. Requests only read the bundled
snapshot: no file/URL reads, shell execution, writes, secrets or AI provider calls. Installation
plans are data for the developer to review.

The official SDK serves current 2026-07-28 and legacy stdio negotiation. `test:inspector`
runs pinned Inspector CLI checks; `test:package` tests an isolated archive consumer.
The bin is `devvy-ui-mcp`; packed files are the built executable, snapshot, README and LICENSE.
Only SDK server 2.3.1 (Apache-2.0) and Zod 4.6.7 (MIT) are runtime dependencies. Registry
inputs, TypeScript, Inspector and SDK client stay development-only. Preserve upstream notices.

Publishing is disabled by `private: true`. A future release requires reviewed name/version,
clean snapshot provenance, tests, Inspector, audit and explicit publishing authorization.
Build, test and pack never publish. No MCP npm install command is claimed.

Full editor-specific JSON/TOML, limits, protocol references and release preparation:
[DEVVY MCP guide](https://github.com/Jttacalig/devvy-ui/blob/main/docs/mcp.md).
The guide belongs to this development checkout and may not be on main yet.
