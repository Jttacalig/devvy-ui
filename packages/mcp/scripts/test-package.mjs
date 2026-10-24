import { readFile, mkdir, mkdtemp, writeFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

if (!process.env.npm_execpath) throw new Error('Run with pnpm --filter devvy-ui-mcp test:package.');
const root = fileURLToPath(new URL('../', import.meta.url));
const artifacts = fileURLToPath(new URL('../../../.artifacts/', import.meta.url));
await mkdir(artifacts, { recursive: true });
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
const pnpm = (args, cwd = root) =>
  execFileSync(process.execPath, [process.env.npm_execpath, ...args], {
    cwd,
    stdio: 'pipe',
    windowsHide: true,
    timeout: 120000,
  });
pnpm(['pack', '--pack-destination', artifacts]);
const archive = join(artifacts, `${pkg.name}-${pkg.version}.tgz`);
const consumer = await mkdtemp(join(artifacts, 'mcp-consumer-'));
await writeFile(
  join(consumer, 'package.json'),
  JSON.stringify({
    private: true,
    type: 'module',
    dependencies: { [pkg.name]: `file:${archive.replaceAll('\\', '/')}` },
  }),
);
pnpm(['install', '--offline', '--ignore-scripts', '--ignore-workspace'], consumer);
const installed = join(consumer, 'node_modules', pkg.name);
const manifest = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
assert.deepEqual(Object.keys(manifest.dependencies).sort(), [
  '@modelcontextprotocol/server',
  'zod',
]);
for (const excluded of ['src/server.mjs', 'data/examples.mjs', 'test/server.test.mjs', 'build.mjs'])
  await assert.rejects(access(join(installed, excluded)));
await assert.rejects(access(join(consumer, 'node_modules/react')));
for (const mode of ['legacy', { pin: '2026-07-28' }]) {
  const client = new Client(
    { name: 'devvy-packed-consumer', version: '1.0.0' },
    { versionNegotiation: { mode } },
  );
  try {
    await client.connect(
      new StdioClientTransport({
        command: process.execPath,
        args: [join(installed, 'dist/server.mjs')],
        cwd: consumer,
        stderr: 'pipe',
      }),
    );
    assert.equal((await client.listTools()).tools.length, 8);
    const response = await client.callTool({
      name: 'get_ui_recipe',
      arguments: { recipe: 'project-dashboard' },
    });
    assert.equal(response.structuredContent.provenance.requestedVersion, '0.3.1');
    assert.match(response.structuredContent.recipe.code, /rowSelection/);
    const local = await client.callTool({
      name: 'get_component_examples',
      arguments: { slug: 'data-table', version: 'workspace' },
    });
    assert.match(local.structuredContent.examples[0].code, /rowSelection/);
  } finally {
    await client.close();
  }
}
console.log(
  `Installed and tested ${archive} in an isolated offline consumer; current and legacy MCP passed without React or repository source.`,
);
