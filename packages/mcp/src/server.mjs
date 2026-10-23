import { readFile } from 'node:fs/promises';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport, serveStdio } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';
import { boundedResult as result, attribution, MAX_RESPONSE_BYTES } from './content.mjs';

const snapshotURL = new URL('../dist/snapshot.json', import.meta.url);
const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

export async function createServer() {
  const data = JSON.parse(await readFile(snapshotURL, 'utf8'));
  const server = new McpServer(
    { name: 'devvy-ui', version: '0.1.0' },
    {
      instructions:
        'Read-only DEVVY UI source tools. Default published 0.2.0 is isolated from explicitly unreleased workspace data. Use get_component before inventing props; guides describe the workspace. Recipes are original MIT compositions, not additional components.',
    },
  );
  const versions = z.enum(['0.2.0', 'workspace']).default('0.2.0');
  const slugs = data.catalog.map((item) => item.slug);
  const slug = z.enum(slugs);
  const guide = z.enum(Object.keys(data.guides));
  function registry(version) {
    return version === 'workspace' ? data.workspace : data.stable;
  }
  function provenance(version) {
    const source = registry(version);
    return {
      requestedVersion: version,
      sourceVersion: source.version,
      status: source.status,
      registrySha256: data.versionData[version].registrySha256,
      ...(version === 'workspace'
        ? { baselineCommit: data.commit, includesUncommittedChanges: data.dirty }
        : {}),
    };
  }
  function itemFor(name, version) {
    const item = registry(version).items.find((entry) => entry.name === name);
    if (!item) throw new Error(`Component ${name} is unavailable in ${version}.`);
    return item;
  }
  const provenanceSchema = z.strictObject({
    requestedVersion: z.string(),
    sourceVersion: z.string(),
    status: z.string(),
    registrySha256: z.string(),
    baselineCommit: z.string().optional(),
    includesUncommittedChanges: z
      .union([z.boolean(), z.null().describe('Not applicable or unavailable.')])
      .optional(),
  });
  const attributionSchema = z.strictObject({
    author: z.string(),
    license: z.string(),
    copyright: z.string(),
    licenseUrl: z.string(),
    repository: z.string(),
    notice: z.string(),
  });
  const exampleSchema = z.strictObject({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    code: z.string(),
    imports: z.array(
      z.object({
        from: z.string(),
        symbols: z.array(z.string()),
        component: z.string(),
        slug: z.string(),
      }),
    ),
    dependencies: z.object({
      packages: z.array(z.string()),
      peers: z.record(z.string(), z.string()),
      sourceFiles: z.array(z.string()),
    }),
    styling: z.object({
      requiredImports: z.array(z.string()),
      themeAttribute: z.string(),
      customization: z.string(),
      fonts: z.string(),
    }),
    attribution: attributionSchema,
    primary: z.string(),
    origin: z.string(),
    license: z.string(),
    accessibility: z.array(z.string()),
    clientBoundary: z.string(),
  });
  const recipeId = z.enum(data.versionData['0.2.0'].examples.map((entry) => entry.id));
  function recipeFor(id, version) {
    const recipe = data.versionData[version].examples.find((entry) => entry.id === id);
    if (!recipe) throw new Error('Unsupported recipe for this version.');
    return recipe;
  }
  function tokensFor({ version, category, theme, offset, limit }) {
    const entries = data.versionData[version].tokens.filter((entry) => {
      const dark = entry.selector.includes("'dark'");
      const system = entry.selector.includes("'system'") || entry.conditions.length > 0;
      return (
        (category === 'all' || entry.category === category) &&
        (theme === 'all' ||
          (theme === 'dark' ? dark && !system : theme === 'system' ? system : !dark && !system))
      );
    });
    return {
      provenance: provenance(version),
      total: entries.length,
      offset,
      limit,
      nextOffset: offset + limit < entries.length ? offset + limit : null,
      tokens: entries.slice(offset, offset + limit),
      styling: {
        requiredImports: ['@devvy-ui/tokens/theme.css'],
        note: 'Values are canonical CSS declarations, including var() references and media conditions; they are not browser-computed colors.',
      },
      attribution,
    };
  }
  server.registerTool(
    'get_design_tokens',
    {
      title: 'Read version-matched design tokens',
      description:
        'Read canonical CSS tokens with original selectors and media conditions. Paginated; no workspace font or theme additions leak into published data.',
      inputSchema: z.strictObject({
        version: versions,
        theme: z.enum(['all', 'light', 'dark', 'system']).default('all'),
        category: z
          .enum(['all', 'color', 'typography', 'spacing', 'radius', 'effects'])
          .default('all'),
        offset: z.number().int().min(0).max(1000).default(0),
        limit: z.number().int().min(1).max(100).default(50),
      }),
      outputSchema: z.strictObject({
        provenance: provenanceSchema,
        total: z.number(),
        offset: z.number(),
        limit: z.number(),
        nextOffset: z.union([z.number(), z.null().describe('Not applicable or unavailable.')]),
        tokens: z.array(
          z.object({
            name: z.string(),
            value: z.string(),
            selector: z.string(),
            conditions: z.array(z.string()),
            category: z.string(),
          }),
        ),
        styling: z.strictObject({ requiredImports: z.array(z.string()), note: z.string() }),
        attribution: attributionSchema,
      }),
      annotations,
    },
    async (args) => result(tokensFor(args)),
  );
  server.registerTool(
    'get_component_examples',
    {
      title: 'Read verified component compositions',
      description:
        'Get original MIT examples type-checked against the selected canonical registry. Curated coverage only; unavailable examples are explicit rather than fabricated.',
      inputSchema: z.strictObject({
        slug,
        version: versions,
        limit: z.number().int().min(1).max(3).default(2),
      }),
      outputSchema: z.object({
        provenance: provenanceSchema,
        slug: z.string(),
        total: z.number(),
        examples: z.array(exampleSchema),
        note: z.string(),
      }),
      annotations,
    },
    async ({ slug: name, version, limit }) => {
      itemFor(name, version);
      const matches = data.versionData[version].examples.filter((entry) =>
        entry.imports.some((item) => item.slug === name),
      );
      return result({
        provenance: provenance(version),
        slug: name,
        total: matches.length,
        examples: matches.slice(0, limit),
        note: matches.length
          ? 'Composed application examples; adapt unique IDs and connect your own data/persistence.'
          : 'No verified example is bundled for this component yet. Use get_component and get_source for its exact API; do not invent an example as canonical.',
      });
    },
  );
  server.registerTool(
    'get_ui_recipe',
    {
      title: 'Read a supported UI recipe',
      description:
        'Get settings-form, project-dashboard or glass-workspace with resolved imports, dependency closure, styles and attribution. Every component is validated against the requested registry.',
      inputSchema: z.strictObject({ recipe: recipeId, version: versions }),
      outputSchema: z.object({ provenance: provenanceSchema, recipe: exampleSchema }),
      annotations,
    },
    async ({ recipe, version }) =>
      result({ provenance: provenance(version), recipe: recipeFor(recipe, version) }),
  );
  server.registerTool(
    'search_components',
    {
      description:
        'Search DEVVY components by name or task. Defaults to published 0.2.0; workspace is explicitly unreleased.',
      inputSchema: z.strictObject({
        query: z.string().max(200).default(''),
        limit: z.number().int().min(1).max(20).default(10),
        version: versions,
      }),
      outputSchema: z.strictObject({
        provenance: provenanceSchema,
        total: z.number(),
        items: z.array(z.object({ name: z.string(), slug: z.string(), description: z.string() })),
      }),
      annotations,
    },
    async ({ query, limit, version }) => {
      const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const supported = new Set(registry(version).items.map((item) => item.name));
      const matches = data.catalog.filter(
        (item) =>
          supported.has(item.slug) &&
          terms.every((term) => `${item.name} ${item.description}`.toLowerCase().includes(term)),
      );
      return result({
        provenance: provenance(version),
        total: matches.length,
        items: matches.slice(0, limit),
      });
    },
  );
  server.registerTool(
    'get_component',
    {
      description:
        'Read the actual canonical TypeScript component API for a supported version. Source is authoritative; do not invent props.',
      inputSchema: z.strictObject({ slug, version: versions }),
      outputSchema: z.strictObject({
        provenance: provenanceSchema,
        apiSource: z.string(),
        import: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string(),
        attribution: attributionSchema,
        docs: z.string(),
        note: z.string(),
      }),
      annotations,
    },
    async ({ slug: name, version }) => {
      const item = itemFor(name, version);
      const metadata = data.catalog.find((entry) => entry.slug === name);
      const canonical = item.files.find((file) => file.path === `components/${metadata.name}.tsx`);
      return result({
        provenance: provenance(version),
        ...metadata,
        import: `import { ${metadata.name} } from '@devvy-ui/react/${name}';`,
        apiSource: canonical.content,
        attribution,
        docs: `https://devvy-ui.dev-station.dev/ui/components/${name}`,
        note: 'The website may describe unreleased workspace additions. This version-specific source is the API authority.',
      });
    },
  );
  server.registerTool(
    'get_source',
    {
      description:
        'Retrieve canonical component files, full dependency/helper closure and MIT notices. Returns data only; does not write files.',
      inputSchema: z.strictObject({
        slug,
        version: versions,
        includeStyles: z.boolean().default(false),
      }),
      outputSchema: z.strictObject({
        provenance: provenanceSchema,
        files: z.array(z.object({ path: z.string(), content: z.string() })),
        styles: z.string().optional(),
        attribution: attributionSchema,
        notice: z.string(),
      }),
      annotations,
    },
    async ({ slug: name, version, includeStyles }) =>
      result({
        provenance: provenance(version),
        files: itemFor(name, version).files,
        attribution,
        ...(includeStyles ? { styles: registry(version).styles } : {}),
        notice:
          'Keep MIT notices. Use the CLI to install safely; compare local edits before updates.',
      }),
  );
  server.registerTool(
    'get_guide',
    {
      description:
        'Read a bundled DEVVY guide. Guides describe this development checkout; verify APIs with get_component for published versions.',
      inputSchema: z.strictObject({ guide }),
      outputSchema: z.strictObject({
        scope: z.string(),
        name: z.string(),
        content: z.string(),
        provenance: provenanceSchema,
        attribution: attributionSchema,
      }),
      annotations,
    },
    async ({ guide: name }) =>
      result({
        scope: 'workspace guide',
        name,
        content: data.guides[name],
        provenance: provenance('workspace'),
        attribution,
      }),
  );
  server.registerTool(
    'get_installation_plan',
    {
      description:
        'Return an installation plan without running commands or changing a project. Published installs are pinned; workspace features require a local build.',
      inputSchema: z.strictObject({
        components: z.array(slug).min(1).max(20),
        mode: z.enum(['package', 'source']).default('package'),
        version: versions,
      }),
      outputSchema: z.strictObject({
        provenance: provenanceSchema,
        mode: z.string(),
        commands: z.array(z.string()),
        note: z.string().optional(),
        styles: z.array(z.string()),
        optionalGlass: z.union([z.string(), z.null().describe('Not applicable or unavailable.')]),
        peers: z.string(),
        warnings: z.array(z.string()),
      }),
      annotations,
    },
    async ({ components, mode, version }) => {
      for (const name of components) itemFor(name, version);
      const names = [...new Set(components)];
      const commands =
        version === 'workspace'
          ? ['pnpm install --frozen-lockfile', 'pnpm build', 'pnpm pack:all']
          : mode === 'source'
            ? [
                'npx @devvy-ui/cli@0.2.0 init',
                `npx @devvy-ui/cli@0.2.0 add ${names.join(' ')}`,
                'npx @devvy-ui/cli@0.2.0 doctor',
              ]
            : ['npm install @devvy-ui/react@0.2.0'];
      return result({
        provenance: provenance(version),
        mode,
        commands,
        ...(version === 'workspace'
          ? {
              note: 'Run in the DEVVY checkout, then install its tarballs or use its local CLI from your application. This does not publish packages.',
            }
          : {}),
        styles:
          mode === 'source'
            ? ['src/devvy.css']
            : ['@devvy-ui/tokens/theme.css', '@devvy-ui/styles'],
        optionalGlass: names.includes('glass')
          ? mode === 'source'
            ? 'Import the copied glass.css after src/devvy.css.'
            : '@devvy-ui/styles/glass.css'
          : null,
        peers: 'React and React DOM ^18.2.0 || ^19.0.0',
        warnings: [
          'The CLI protects edited files. Do not bypass conflicts.',
          'Run copied interactive components behind your application client boundary in Next.js.',
        ],
      });
    },
  );
  for (const version of ['0.2.0', 'workspace']) {
    for (const kind of ['tokens', 'examples', 'recipes']) {
      server.registerResource(
        `${kind}-${version}`,
        `devvy://${kind}/${version}`,
        {
          title: `DEVVY ${kind} (${version})`,
          description:
            'Version-matched, bundled read-only data. Use the corresponding tool for bounded details.',
          mimeType: 'application/json',
        },
        async (uri) => {
          const value =
            kind === 'tokens'
              ? tokensFor({ version, category: 'all', theme: 'all', offset: 0, limit: 100 })
              : {
                  provenance: provenance(version),
                  attribution,
                  items: data.versionData[version].examples.map(
                    ({ id, title, description, imports }) => ({
                      id,
                      title,
                      description,
                      components: imports.map((entry) => entry.slug),
                    }),
                  ),
                };
          const text = JSON.stringify(value);
          if (Buffer.byteLength(text, 'utf8') > MAX_RESPONSE_BYTES)
            throw new Error('Resource exceeds response limit.');
          return { contents: [{ uri: uri.href, mimeType: 'application/json', text }] };
        },
      );
    }
    server.registerResource(
      `catalog-${version}`,
      `devvy://catalog/${version}`,
      { title: `DEVVY components (${version})`, mimeType: 'application/json' },
      async (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify({
              provenance: provenance(version),
              components: data.catalog.filter((entry) =>
                registry(version).items.some((item) => item.name === entry.slug),
              ),
            }),
          },
        ],
      }),
    );
  }
  server.registerResource(
    'about',
    'devvy://about',
    { title: 'DEVVY MCP capabilities and version policy', mimeType: 'text/plain' },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: 'Local read-only DEVVY developer preview. Eight tools, versioned component/token/example/recipe resources, and three reusable prompts. Supports immutable published 0.2.0 and explicitly unreleased workspace snapshots. Tool responses are capped at 384 KiB encoded; large source is never silently truncated. No file writes, shell execution, remote registry fetch, credentials or AI provider are used by tool requests.',
        },
      ],
    }),
  );
  const promptResult = (description, value) => {
    const text = JSON.stringify(value);
    if (Buffer.byteLength(text, 'utf8') > 48 * 1024)
      throw new Error('Prompt exceeds the 48 KiB limit.');
    return { description, messages: [{ role: 'user', content: { type: 'text', text } }] };
  };
  server.registerPrompt(
    'build_ui',
    {
      title: 'Build from a verified DEVVY recipe',
      description:
        'Start a UI using supported components and the selected version’s exact composition.',
      argsSchema: z.strictObject({ recipe: recipeId.default('settings-form'), version: versions }),
    },
    ({ recipe, version }) =>
      promptResult('Build a version-matched DEVVY interface', {
        instructions:
          'Adapt this original recipe to the user’s application. Preserve native semantics, labels, client boundaries, optional Glass and MIT notices. Inspect canonical component APIs before changing props. Installation plans are suggestions, not executed commands. Do not claim workspace additions are published.',
        provenance: provenance(version),
        recipe: recipeFor(recipe, version),
      }),
  );
  server.registerPrompt(
    'customize_theme',
    {
      title: 'Customize DEVVY tokens',
      description: 'Customize the selected version with canonical CSS tokens and scoped overrides.',
      argsSchema: z.strictObject({
        theme: z.enum(['light', 'dark', 'system']).default('light'),
        version: versions,
      }),
    },
    ({ theme, version }) =>
      promptResult('Customize a scoped DEVVY theme', {
        instructions:
          'Use the canonical selectors, token values and media conditions below. Put overrides after the imports on the intended theme container. Maintain readable contrast, visible focus, reduced motion and optional Glass fallbacks. Do not introduce a styling framework or assume workspace fonts exist in npm 0.2.0.',
        ...tokensFor({ version, theme, category: 'all', offset: 0, limit: 100 }),
      }),
  );
  server.registerPrompt(
    'review_component',
    {
      title: 'Review against the canonical DEVVY API',
      description: 'A bounded review workflow anchored to the component’s real source and version.',
      argsSchema: z.strictObject({ slug, version: versions }),
    },
    ({ slug: name, version }) =>
      promptResult('Review DEVVY usage', {
        provenance: provenance(version),
        component: name,
        instructions:
          'Ask for the user’s actual code if it is absent. Use get_component and get_source for this exact version, then review props, native forms, labels, keyboard focus, controlled state, SSR and styling imports. Preserve user customizations. Report evidence and limits; never claim an accessibility certification or execute installation commands.',
        sourceFiles: itemFor(name, version).files.map((file) => file.path),
        attribution,
      }),
  );
  return server;
}

if (
  process.argv[1] &&
  realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(import.meta.url))
) {
  try {
    await readFile(snapshotURL, 'utf8');
    serveStdio(createServer, {
      transport: new StdioServerTransport(process.stdin, process.stdout, {
        maxBufferSize: 4 * 1024 * 1024,
      }),
      onerror: (error) => console.error(`DEVVY MCP transport: ${error.message}`),
    });
  } catch (error) {
    console.error(
      `DEVVY MCP could not start: ${error.message}. Run pnpm --filter devvy-ui-mcp build first.`,
    );
    process.exitCode = 1;
  }
}
