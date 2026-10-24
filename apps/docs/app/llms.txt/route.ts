import { catalog } from '../../lib/catalog';
import { docsUrl, githubRepoUrl, npmPackageUrl, releaseVersion } from '../../lib/release';
import { getPublishedRelease } from '../../lib/published-release';
import { mcpPublishedVersion } from '../../lib/mcp-release';

export const revalidate = 300;

export async function GET() {
  const { version } = await getPublishedRelease();
  const text = [
    '# DEVVY UI',
    '',
    '> Original MIT React component library by DEV STATION. 100 primary components, TypeScript, scoped themes, optional DEVVY GLASS and source ownership.',
    '',
    `- npm stable release (latest): ${version}`,
    `- Documentation implementation version: ${releaseVersion}`,
    `- Optional local MCP published-source pin: ${mcpPublishedVersion}`,
    '- MCP is a private local read-only developer preview, not a published npm package or hosted endpoint. Workspace requests remain explicitly unreleased.',
    '- A live npm label does not upgrade the documentation implementation or the MCP source pin.',
    '- React and React DOM ^18.2.0 or ^19.0.0 are peers. Other framework adapters are not shipped.',
    '- Install: npm install @devvy-ui/react',
    '- Required styles: @devvy-ui/tokens/theme.css, then @devvy-ui/styles.',
    '- Optional Glass: @devvy-ui/styles/glass.css. Optional fonts are separate CSS entries with SIL OFL notices.',
    '',
    '## Canonical references',
    `- [Getting started](${docsUrl}/getting-started): installation, imports and source ownership`,
    `- [Components](${docsUrl}/components): canonical typed API examples and source`,
    `- [Themes](${docsUrl}/themes): scoped tokens and customization`,
    `- [Glass](${docsUrl}/glass): optional material and reduced-effects fallbacks`,
    `- [Fonts](${docsUrl}/fonts): optional self-hosted typography`,
    `- [MCP](${docsUrl}/mcp): version-matched local developer tools`,
    `- [Release notes](${docsUrl}/changelog): historical release information`,
    `- [Repository](${githubRepoUrl}): original source and MIT notices`,
    `- [npm](${npmPackageUrl}): published version and distribution tags`,
    '',
    '## Component reference',
    ...catalog.map(({ name, slug }) => `- [${name}](${docsUrl}/components/${slug})`),
    '',
  ].join('\n');
  return new Response(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  });
}
