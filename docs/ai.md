# AI-assisted development

DEVVY UI includes shared instructions for developers using coding assistants. The same
component contracts apply whether a change is written by a person or with AI assistance.
No AI service, account or runtime dependency is required to use the library.

## Entry points

| File                                                                            | Purpose                                                                       |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [AGENTS.md](../AGENTS.md)                                                       | Shared repository structure, contracts, verification and release boundaries   |
| [DEVVY UI skill](../.agents/skills/devvy-ui/SKILL.md)                           | Task-specific routing for library contributions, customization and updates    |
| [Contributing reference](../.agents/skills/devvy-ui/references/contributing.md) | Source, exports, registry, docs and Changeset workflow                        |
| [Consumer reference](../.agents/skills/devvy-ui/references/consuming.md)        | Package integration, theming and preserving customized source during upgrades |
| [CLAUDE.md](../CLAUDE.md)                                                       | Imports the shared repository instructions for Claude Code                    |
| [Copilot instructions](../.github/copilot-instructions.md)                      | Repository-wide Copilot entry point                                           |
| [Cursor rule](../.cursor/rules/devvy-ui.mdc)                                    | Always-applied Cursor entry point referencing the shared rules                |

Codex discovers repository skills in `.agents/skills`; the skill can also be invoked as
`$devvy-ui`. See [Codex skill discovery](https://developers.openai.com/codex/skills).
Other tools can read the same SKILL.md directly; automatic discovery depends on the tool
and version. The adapters use documented [Copilot repository instructions](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions),
[Claude imports](https://code.claude.com/docs/en/memory#import-additional-files) and
[Cursor project rules](https://cursor.com/docs/rules).

Restart or refresh an assistant session after adding instruction files if its skill list
has not updated. Ask it to identify the instruction files it loaded when checking discovery.
The repository files are provided; this implementation does not configure or certify a
particular user's editor installation.

## Contribute to this repository

Start the assistant in the checkout and give it the actual behavior and compatibility you
want. For example:

```text
Use $devvy-ui to add an accessible Progress component using native progress markup.
Follow AGENTS.md, update its public entry, source registry and documentation, and
run the checks appropriate to the new component. Keep Glass optional.
```

The skill points to the canonical package locations and tells the assistant which files must
move together. It includes exports/declarations, generated registry parity, native behavior,
SSR/hydration, optional materials, docs, meaningful tests and Changesets. Current versions
and validation commands come from the repository rather than a hardcoded AI template.

For a tool without skill discovery, start with:

```text
Read AGENTS.md and .agents/skills/devvy-ui/SKILL.md, then follow the reference
relevant to this task. Make the requested change and report actual validation.
```

## Customize DEVVY UI in another application

Copy the **whole** `.agents/skills/devvy-ui` directory into a skill location supported by
your assistant, including its references and LICENSE.txt. Keep the consuming application's
existing AGENTS.md and conventions. Do not copy this repository's root AGENTS.md over the
application's own instructions: its package layout and contributor commands are different.

Example request:

```text
Use $devvy-ui to adapt our existing Button and Card to the product's brand.
Inspect our installed version and imports. Prefer scoped CSS/token overrides,
preserve keyboard/form behavior, and keep our application's existing structure.
```

For owned source updates:

```text
Use $devvy-ui to update our copied Tabs component to the upstream fix.
Compare the old upstream baseline, our local edits and the target source.
Preserve our customizations and report any uncertain merge decisions.
```

The source installer refuses edited-file overwrites and does not implement automatic
upgrades. AI guidance does not bypass that protection. Use a deliberate comparison and
merge, including shared helpers, tokens and styles. See [customization](customization.md).

## Keep the instructions current

Maintain repository-wide rules in AGENTS.md, task procedures in the skill references and
tool discovery details in this guide. Keep adapters short. When changing a package boundary,
export/registry layout, CLI behavior, supported target or command, review those files with
the implementation. Do not replace actual manifests, tests or CI with prose rules.

Check Markdown links and referenced paths, compare command names against package.json,
and run `pnpm format:check` after text changes. The skill uses the Agent Skills frontmatter
format and carries UI metadata in `agents/openai.yaml`. A skill validator checks its metadata
and structure; it cannot prove a model will always follow the instructions.

These files guide assistants; they are not a security boundary or an automatic release
system. Existing CI, code review and user authorization still apply. No hooks, auto-publishing,
agent service or external data transmission is enabled by these files.

## AI product interfaces

The optional local MCP server is now implemented in `packages/mcp`. See
[its setup and version policy](../packages/mcp/README.md) or `/ui/mcp` for component search,
canonical API/source lookup, guides and installation plans. This is a private developer
preview with version-matched tokens, verified examples/recipes, discoverable resources and
reusable prompts. See [MCP editor setup and response contracts](mcp.md) for Codex, Claude
Code, Cursor and VS Code. Standalone packaging is prepared; publishing stays disabled.
It is not a published MCP package or hosted service. Calls are read-only; project updates
still use reviewed assistant edits and the CLI's conflict protection. The published 0.2.0
registry and unreleased workspace snapshot are separate, explicitly selectable sources.

See [AI interface direction](ai-interfaces.md) for optional provider-independent compositions
using the existing 100 DEVVY components. AI contributor guidance does not add an AI backend.
