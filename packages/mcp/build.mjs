import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
import { createHash } from 'node:crypto';
import { examplesFor } from './data/examples.mjs';
import { tokenEntries, describeExample } from './src/content.mjs';

const root = new URL('../../', import.meta.url);
const output = new URL('./dist/', import.meta.url);
await mkdir(output, { recursive: true });
await build({
  entryPoints: [fileURLToPath(new URL('apps/docs/lib/catalog.ts', root))],
  outfile: fileURLToPath(new URL('catalog.mjs', output)),
  bundle: true,
  platform: 'node',
  format: 'esm',
});
const { catalog } = await import(new URL('catalog.mjs', output));
const read = (path) => readFile(new URL(path, root), 'utf8');
const workspace = JSON.parse(
  await readFile(new URL(import.meta.resolve('@devvy-ui/registry/registry.json')), 'utf8'),
);
const stable = JSON.parse(
  await readFile(
    new URL(import.meta.resolve('@devvy-ui/published-registry/registry.json')),
    'utf8',
  ),
);
const manifest = JSON.parse(await readFile(new URL('./package.json', import.meta.url), 'utf8'));
const publishedVersion = manifest.devDependencies['@devvy-ui/published-registry'].match(
  /^npm:@devvy-ui\/registry@(\d+\.\d+\.\d+)$/,
)?.[1];
if (!publishedVersion || stable.version !== publishedVersion)
  throw new Error(
    'Published source alias must resolve to the reviewed immutable registry version.',
  );
const guidePaths = {
  installation: 'README.md',
  customization: 'docs/customization.md',
  accessibility: 'docs/accessibility.md',
  architecture: 'docs/architecture.md',
  contribution: 'AGENTS.md',
  consuming: '.agents/skills/devvy-ui/references/consuming.md',
  mcp: 'docs/mcp.md',
};
const guides = Object.fromEntries(
  await Promise.all(
    Object.entries(guidePaths).map(async ([name, path]) => [name, await read(path)]),
  ),
);
const metadata = catalog.map(({ name, slug, description }) => ({ name, slug, description }));
const versionData = Object.fromEntries(
  [
    [publishedVersion, stable],
    ['workspace', workspace],
  ].map(([version, registry]) => [
    version,
    {
      registrySha256: createHash('sha256').update(JSON.stringify(registry)).digest('hex'),
      tokens: tokenEntries(registry.styles),
      examples: examplesFor(version).map((example) => describeExample(example, registry, metadata)),
    },
  ]),
);
let commit = 'unknown';
let dirty = null;
try {
  commit = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: fileURLToPath(root),
    encoding: 'utf8',
  }).trim();
  dirty = Boolean(
    execFileSync('git', ['status', '--porcelain'], {
      cwd: fileURLToPath(root),
      encoding: 'utf8',
    }).trim(),
  );
} catch {
  /* Git metadata is optional in a source archive. */
}
await writeFile(
  new URL('snapshot.json', output),
  JSON.stringify({
    schemaVersion: 1,
    commit,
    dirty,
    catalog: metadata,
    versionData,
    workspace: {
      ...workspace,
      status:
        'Unreleased workspace snapshot; package version is a baseline, not proof of npm publication.',
    },
    stable: {
      ...stable,
      status: `Immutable published @devvy-ui/registry@${publishedVersion} source.`,
    },
    guides,
  }) + '\n',
);
await writeFile(new URL('./LICENSE', import.meta.url), await read('LICENSE'));
await build({
  entryPoints: [fileURLToPath(new URL('./src/server.mjs', import.meta.url))],
  outfile: fileURLToPath(new URL('server.mjs', output)),
  bundle: true,
  packages: 'external',
  platform: 'node',
  format: 'esm',
  target: 'node22',
  banner: { js: '#!/usr/bin/env node' },
});
console.log(
  `Built optional MCP snapshot: ${stable.items.length} published and ${workspace.items.length} workspace components.`,
);
