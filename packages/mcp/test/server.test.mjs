import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';

const read = (result) => JSON.parse(result.content.find((item) => item.type === 'text').text);
async function connected(run) {
  const client = new Client({ name: 'devvy-integration-test', version: '1.0.0' });
  try {
    await client.connect(
      new StdioClientTransport({
        command: process.execPath,
        args: [fileURLToPath(new URL('../src/server.mjs', import.meta.url))],
        stderr: 'pipe',
      }),
    );
    await run(client);
  } finally {
    await client.close();
  }
}

test('real stdio discovery preserves the original five tools alongside three extensions', async () =>
  connected(async (client) => {
    const { tools } = await client.listTools();
    assert.equal(tools.length, 8);
    for (const name of [
      'search_components',
      'get_component',
      'get_source',
      'get_guide',
      'get_installation_plan',
    ])
      assert.ok(tools.some((tool) => tool.name === name));
    assert.ok(
      tools.every((tool) => tool.annotations.readOnlyHint && !tool.annotations.destructiveHint),
    );
    const { resources } = await client.listResources();
    assert.equal(resources.length, 9);
    const catalog = await client.readResource({ uri: 'devvy://catalog/0.2.0' });
    const data = JSON.parse(catalog.contents[0].text);
    assert.equal(data.components.length, 100);
    assert.equal(data.provenance.requestedVersion, '0.2.0');
  }));

test('version-specific APIs distinguish published source from workspace additions', async () =>
  connected(async (client) => {
    const stable = read(
      await client.callTool({ name: 'get_component', arguments: { slug: 'data-table' } }),
    );
    const workspace = read(
      await client.callTool({
        name: 'get_component',
        arguments: { slug: 'data-table', version: 'workspace' },
      }),
    );
    assert.doesNotMatch(stable.apiSource, /rowSelection/);
    assert.match(workspace.apiSource, /rowSelection/);
    assert.match(workspace.provenance.status, /Unreleased/);
    assert.match(stable.import, /@devvy-ui\/react\/data-table/);
  }));

test('source retrieval includes dependency closure and MIT notices; plans do not execute', async () =>
  connected(async (client) => {
    const source = read(
      await client.callTool({ name: 'get_source', arguments: { slug: 'gallery' } }),
    );
    for (const name of ['Gallery', 'Lightbox', 'Dialog', 'Button'])
      assert.ok(source.files.some((file) => file.path === `components/${name}.tsx`));
    assert.ok(
      source.files.some((file) => file.path === 'LICENSE' && file.content.includes('MIT License')),
    );
    const plan = read(
      await client.callTool({
        name: 'get_installation_plan',
        arguments: { components: ['glass', 'button'], mode: 'source' },
      }),
    );
    assert.ok(plan.commands.includes('npx @devvy-ui/cli@0.2.0 add glass button'));
    const local = read(
      await client.callTool({
        name: 'get_installation_plan',
        arguments: { components: ['data-table'], version: 'workspace' },
      }),
    );
    assert.ok(local.commands.includes('pnpm pack:all'));
    assert.ok(!local.commands.some((command) => command.startsWith('npm install ')));
  }));

test('search and guides work, while traversal, unsupported versions and unbounded queries are rejected', async () =>
  connected(async (client) => {
    const search = read(
      await client.callTool({ name: 'search_components', arguments: { query: 'table' } }),
    );
    assert.ok(search.items.some((item) => item.slug === 'data-table'));
    const guide = read(
      await client.callTool({ name: 'get_guide', arguments: { guide: 'customization' } }),
    );
    assert.match(guide.content, /sandboxed iframe/);
    for (const args of [
      { name: 'get_component', arguments: { slug: '../package.json' } },
      { name: 'get_guide', arguments: { guide: '../../.env' } },
      { name: 'get_component', arguments: { slug: 'button', version: '99.0.0' } },
      { name: 'search_components', arguments: { query: 'x'.repeat(201) } },
      { name: 'get_installation_plan', arguments: { components: ['button; rm'] } },
    ])
      assert.equal((await client.callTool(args)).isError, true);
  }));
