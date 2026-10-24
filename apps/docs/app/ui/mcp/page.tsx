import Link from 'next/link';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@devvy-ui/react';
import { CopyCode } from '../../../components/CopyCode';
import { docsMetadata } from '../../../lib/metadata';
import { mcpPublishedVersion } from '../../../lib/mcp-release';
import { docsUrl } from '../../../lib/release';

export const metadata = docsMetadata(
  'MCP developer tools',
  `Read canonical DEVVY UI ${mcpPublishedVersion} component APIs, source, design tokens and recipes with the optional local, read-only MCP developer preview.`,
  '/mcp',
);

export default function MCPPage() {
  return (
    <article className="article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            '@id': `${docsUrl}/mcp#guide`,
            headline: 'Give your assistant the actual source.',
            description: `Local read-only MCP developer tools with canonical DEVVY UI ${mcpPublishedVersion} source, tokens and recipes.`,
            url: `${docsUrl}/mcp`,
            version: mcpPublishedVersion,
            inLanguage: 'en',
            isAccessibleForFree: true,
            author: {
              '@type': 'Organization',
              name: 'DEV STATION',
              url: 'https://www.dev-station.dev',
            },
            about: {
              '@type': 'SoftwareSourceCode',
              name: 'DEVVY UI',
              version: mcpPublishedVersion,
              url: docsUrl,
            },
          }),
        }}
      />
      <div className="breadcrumb">
        Developer tools / <span>MCP</span>
      </div>
      <Badge tone="neutral">Local developer preview</Badge>
      <h1>Give your assistant the actual source.</h1>
      <p className="page-lead">
        Discover components, read their real APIs, and retrieve the source you can own. DEVVY MCP
        connects your coding assistant to the library without adding AI dependencies to your
        application.
      </p>
      <div className="mcp-capabilities">
        {[
          [
            'Find the right pieces',
            'Search 100 components by name or task. Responses stay small until you request more.',
          ],
          [
            'Use the right version',
            `Published ${mcpPublishedVersion} is the default. Workspace requests remain explicitly separate and unreleased.`,
          ],
          [
            'Own the implementation',
            'Get canonical TypeScript, dependency and helper closure, styles and MIT notices.',
          ],
        ].map(([title, text]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2>Connect from a local checkout</h2>
      <p>
        This optional tool is implemented in the repository. It is not published as an npm MCP
        package and has no hosted endpoint. Build the checkout before connecting:
      </p>
      <p>
        Rebuild your local server to use the updated published-source pin. Updating this website
        does not replace a previously built MCP snapshot or change your editor configuration.
      </p>
      <CopyCode
        label="Build local MCP developer tools"
        code={'pnpm install --frozen-lockfile\npnpm build'}
      />
      <p>
        Configure a local stdio server in your MCP client. Replace the example with the absolute
        path to your checkout. Configuration file formats vary by client.
      </p>
      <CopyCode
        label="Local MCP server configuration"
        code={
          '{\n  "mcpServers": {\n    "devvy-ui": {\n      "command": "node",\n      "args": ["/absolute/path/devvy-ui/packages/mcp/dist/server.mjs"]\n    }\n  }\n}'
        }
      />
      <h2>Connect your editor</h2>
      <h3>Codex</h3>
      <CopyCode
        label="Connect DEVVY MCP to Codex"
        code={
          'codex mcp add devvy-ui -- node /absolute/path/devvy-ui/packages/mcp/dist/server.mjs\ncodex mcp list'
        }
      />
      <h3>Claude Code</h3>
      <CopyCode
        label="Connect DEVVY MCP to Claude Code"
        code={
          'claude mcp add --transport stdio devvy-ui -- node /absolute/path/devvy-ui/packages/mcp/dist/server.mjs\nclaude mcp list'
        }
      />
      <h3>Cursor</h3>
      <p>
        Merge the local-server JSON above into <code>.cursor/mcp.json</code> (project) or{' '}
        <code>~/.cursor/mcp.json</code> (personal), then enable the server in MCP customizations.
      </p>
      <h3>VS Code</h3>
      <p>
        Use MCP: Add Server → Command (stdio), or merge this VS Code workspace configuration into{' '}
        <code>.vscode/mcp.json</code>. Copilot Global uses its own configuration destination; select
        the appropriate agent harness in the guided flow.
      </p>
      <CopyCode
        label="VS Code MCP workspace configuration"
        code={
          '{\n  "servers": {\n    "devvy-ui": {\n      "type": "stdio",\n      "command": "node",\n      "args": ["/absolute/path/devvy-ui/packages/mcp/dist/server.mjs"]\n    }\n  }\n}'
        }
      />
      <p>
        Use absolute paths and review your client’s trust prompt. DEVVY does not change editor
        settings automatically. Protocol tests and Inspector checks do not certify an interactive
        session in every editor.
      </p>
      <h2>Try a useful request</h2>
      <CopyCode
        label="Example AI development request"
        code={`Find a searchable selector for our settings form.\nRead its published ${mcpPublishedVersion} API and source dependencies.\nGive me an installation plan, then explain how to customize\nits colors while preserving keyboard behavior.`}
      />
      <h2>What the tools do</h2>
      <div className="table-scroll" role="region" tabIndex={0} aria-label="MCP tools">
        <table>
          <thead>
            <tr>
              <th>Tool</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['search_components', 'Bounded component discovery by name and description.'],
              ['get_component', 'Version-specific canonical API source and focused import.'],
              ['get_source', 'Component, dependency/helper source and license; optional styles.'],
              ['get_guide', 'Bundled customization, accessibility and contributor guidance.'],
              [
                'get_installation_plan',
                'Reviewed commands and required imports, without executing them.',
              ],
              [
                'get_design_tokens',
                'Version-matched CSS tokens, selectors and media conditions; filtered and paginated.',
              ],
              [
                'get_component_examples',
                'Verified compositions with real imports, dependency closure, styles and attribution.',
              ],
              [
                'get_ui_recipe',
                'Settings form, project dashboard or adaptive Glass workspace using supported components.',
              ],
            ].map(([name, description]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                </td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Discover resources and reusable prompts</h2>
      <p>
        Read the versioned catalog, token, example and recipe resources via{' '}
        <code>resources/list</code>. Use <code>build_ui</code>, <code>customize_theme</code> or{' '}
        <code>review_component</code> from <code>prompts/list</code> to start with verified context.
        Example coverage is curated; unavailable examples are clearly marked.
      </p>
      <CopyCode
        label="Request a supported DEVVY recipe"
        code={JSON.stringify({
          name: 'get_ui_recipe',
          arguments: { recipe: 'project-dashboard', version: mcpPublishedVersion },
        })}
      />
      <p>
        Structured tool responses are capped at 384 KiB before SDK wire metadata. Source is never
        silently truncated. The official SDK handles current 2026-07-28 and legacy stdio clients.
        Standalone packaging is prepared, with publishing disabled until tests and a release review
        are complete.
      </p>
      <p>
        <a href="https://github.com/Jttacalig/devvy-ui/blob/main/docs/mcp.md">
          Full setup, protocol references and verification guide ↗
        </a>
      </p>
      <h2>Predictable boundaries</h2>
      <p>
        Tool requests read bundled data. They do not modify your project, execute shell commands,
        request secrets, or fetch arbitrary remote content. Source installation stays with the CLI
        and its conflict protection. This connection supplies context; your assistant and
        application remain responsible for reviewing generated changes.
      </p>
      <p>
        The pinned published registry supplies {mcpPublishedVersion} source, including optional
        table selection. Choose <code>workspace</code> only when you intend to use the unreleased
        checkout; unsupported versions are rejected. Development guides can describe newer features,
        so version-specific component source is the API authority.
      </p>
      <Link href="/ui/getting-started">Install the stable React library →</Link>
    </article>
  );
}
