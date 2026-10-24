import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { read, connected } from './helpers.mjs';
import { boundedResult, tokenEntries, MAX_RESPONSE_BYTES } from '../src/content.mjs';

const snapshot = JSON.parse(
  await readFile(new URL('../dist/snapshot.json', import.meta.url), 'utf8'),
);

test('discovery advertises structured output, read-only annotations, resources and reusable prompts', async () =>
  connected(async (client) => {
    const first = await client.listTools();
    assert.deepEqual(
      (await client.listTools()).tools.map((item) => item.name),
      first.tools.map((item) => item.name),
    );
    assert.equal(first.tools.length, 8);
    for (const tool of first.tools) {
      assert.equal(tool.inputSchema.additionalProperties, false);
      assert.equal(tool.outputSchema.type, 'object');
      assert.deepEqual(tool.annotations, {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      });
    }
    const { resources } = await client.listResources();
    assert.equal(new Set(resources.map((entry) => entry.uri)).size, 9);
    for (const resource of resources) {
      const response = await client.readResource({ uri: resource.uri });
      assert.ok(Buffer.byteLength(JSON.stringify(response)) < MAX_RESPONSE_BYTES);
      if (resource.mimeType === 'application/json') {
        const value = JSON.parse(response.contents[0].text);
        assert.ok(['0.3.1', 'workspace'].includes(value.provenance.requestedVersion));
      }
    }
    assert.deepEqual((await client.listPrompts()).prompts.map((item) => item.name).sort(), [
      'build_ui',
      'customize_theme',
      'review_component',
    ]);
  }));

test('tokens come from immutable canonical version data and retain selectors, conditions and pagination', async () =>
  connected(async (client) => {
    for (const version of ['0.3.1', 'workspace']) {
      const registry = version === '0.3.1' ? snapshot.stable : snapshot.workspace;
      const all = read(
        await client.callTool({ name: 'get_design_tokens', arguments: { version, limit: 100 } }),
      );
      assert.deepEqual(all.tokens, tokenEntries(registry.styles));
      assert.equal(
        all.provenance.registrySha256,
        createHash('sha256')
          .update(
            JSON.stringify(
              Object.fromEntries(Object.entries(registry).filter(([key]) => key !== 'status')),
            ),
          )
          .digest('hex'),
      );
      assert.ok(
        all.tokens.some(
          (entry) =>
            entry.name === '--dvy-brand' &&
            entry.conditions.some((condition) => condition.includes('prefers-color-scheme')),
        ),
      );
      const first = read(
        await client.callTool({ name: 'get_design_tokens', arguments: { version, limit: 3 } }),
      );
      const second = read(
        await client.callTool({
          name: 'get_design_tokens',
          arguments: { version, limit: 3, offset: first.nextOffset },
        }),
      );
      assert.deepEqual([...first.tokens, ...second.tokens], all.tokens.slice(0, 6));
      const type = read(
        await client.callTool({
          name: 'get_design_tokens',
          arguments: { version, category: 'typography', theme: 'light' },
        }),
      );
      assert.ok(type.tokens.every((entry) => entry.category === 'typography'));
      assert.ok(type.tokens.some((entry) => entry.name === '--dvy-font'));
      assert.ok(!JSON.stringify(all).includes('manrope-latin'));
    }
  }));

test('examples and recipes preserve published/workspace API isolation and actual import closure', async () =>
  connected(async (client) => {
    for (const version of ['0.3.1', 'workspace']) {
      const example = read(
        await client.callTool({
          name: 'get_component_examples',
          arguments: { slug: 'data-table', version },
        }),
      );
      assert.equal(example.examples.length, 1);
      assert.match(example.examples[0].code, /rowSelection/);
      assert.equal(example.provenance.requestedVersion, version);
      for (const definition of snapshot.versionData[version].examples) {
        const { recipe, provenance } = read(
          await client.callTool({
            name: 'get_ui_recipe',
            arguments: { recipe: definition.id, version },
          }),
        );
        assert.equal(provenance.requestedVersion, version);
        assert.equal(recipe.attribution.license, 'MIT');
        assert.ok(recipe.dependencies.sourceFiles.includes('LICENSE'));
        for (const entry of recipe.imports) {
          assert.equal(entry.from, `@devvy-ui/react/${entry.slug}`);
          assert.ok(
            (version === '0.3.1' ? snapshot.stable : snapshot.workspace).items.some(
              (item) => item.name === entry.slug,
            ),
          );
        }
        assert.equal(
          recipe.styling.requiredImports.includes('@devvy-ui/styles/glass.css'),
          definition.id === 'glass-workspace',
        );
      }
    }
    const unavailable = read(
      await client.callTool({ name: 'get_component_examples', arguments: { slug: 'tooltip' } }),
    );
    assert.equal(unavailable.total, 0);
    assert.match(unavailable.note, /No verified example/);
  }));

test('prompts embed only bounded version-matched context; bad prompt/resource names are rejected', async () =>
  connected(async (client) => {
    for (const version of ['0.3.1', 'workspace']) {
      for (const [name, args] of [
        ['build_ui', { recipe: 'project-dashboard' }],
        ['customize_theme', { theme: 'dark' }],
        ['review_component', { slug: 'data-table' }],
      ]) {
        const response = await client.getPrompt({ name, arguments: { ...args, version } });
        assert.ok(Buffer.byteLength(JSON.stringify(response)) < 48 * 1024);
        const value = JSON.parse(response.messages[0].content.text);
        assert.equal(value.provenance.requestedVersion, version);
        if (name === 'build_ui') assert.ok(value.recipe.code.includes('rowSelection'));
      }
    }
    await assert.rejects(
      client.getPrompt({ name: 'build_ui', arguments: { recipe: 'invented-grid' } }),
    );
    await assert.rejects(
      client.getPrompt({ name: 'customize_theme', arguments: { version: 'latest' } }),
    );
    await assert.rejects(client.readResource({ uri: 'file:///etc/passwd' }));
    await assert.rejects(client.readResource({ uri: 'devvy://tokens/latest' }));
  }));

test('malformed tools reject unknown keys, invalid enums, oversized values and invalid bounds', async () =>
  connected(async (client) => {
    for (const [name, args] of [
      ['get_design_tokens', { version: 'latest' }],
      ['get_design_tokens', { theme: 'sepia' }],
      ['get_design_tokens', { limit: 101 }],
      ['get_design_tokens', { offset: -1 }],
      ['get_design_tokens', { category: ['color'] }],
      ['get_design_tokens', { limit: 1.5 }],
      ['get_design_tokens', { limit: '5' }],
      ['get_design_tokens', { path: '../../.env' }],
      ['get_component_examples', { slug: 'button', limit: 4 }],
      ['get_component_examples', { slug: null }],
      ['get_ui_recipe', { recipe: 'password-stealer' }],
      ['get_ui_recipe', { recipe: 'settings-form', code: 'run this' }],
      ['search_components', { query: 'x'.repeat(1024 * 1024) }],
      ['get_installation_plan', { components: Array(21).fill('button') }],
    ]) {
      const response = await client.callTool({ name, arguments: args });
      assert.equal(response.isError, true, `${name}: ${JSON.stringify(args).slice(0, 100)}`);
      assert.ok(Buffer.byteLength(JSON.stringify(response)) < 16 * 1024);
    }
    const valid = read(
      await client.callTool({
        name: 'search_components',
        arguments: { query: 'button', limit: 1 },
      }),
    );
    assert.equal(valid.items[0].slug, 'button');
  }));

test('all canonical source responses obey the encoded cap without silently truncating files', async () =>
  connected(async (client) => {
    for (const version of ['0.3.1', 'workspace']) {
      for (const item of (version === '0.3.1' ? snapshot.stable : snapshot.workspace).items) {
        const response = await client.callTool({
          name: 'get_source',
          arguments: { slug: item.name, version, includeStyles: true },
        });
        const value = read(response);
        if (response.isError) {
          assert.equal(value.error.code, 'RESPONSE_TOO_LARGE');
          assert.deepEqual(
            read(
              await client.callTool({
                name: 'get_source',
                arguments: { slug: item.name, version },
              }),
            ).files,
            item.files,
          );
        } else assert.deepEqual(value.files, item.files);
      }
    }
  }));

test('byte cap counts UTF-8 and replaces oversized structured output with a bounded actionable error', () => {
  const response = boundedResult({
    provenance: { requestedVersion: 'workspace' },
    code: '界'.repeat(MAX_RESPONSE_BYTES),
  });
  assert.equal(response.isError, true);
  assert.equal(read(response).error.code, 'RESPONSE_TOO_LARGE');
});

test('built standalone entry supports protocol discovery without repository-relative runtime imports', async () =>
  connected(async (client) => {
    assert.equal((await client.listTools()).tools.length, 8);
    assert.equal(
      read(await client.callTool({ name: 'get_ui_recipe', arguments: { recipe: 'settings-form' } }))
        .provenance.requestedVersion,
      '0.3.1',
    );
  }, true));

test('the current 2026-07-28 stdio era negotiates and serves the same canonical tools', async () =>
  connected(
    async (client) => {
      assert.equal(client.getProtocolEra(), 'modern');
      assert.equal((await client.listTools()).tools.length, 8);
      assert.equal(
        read(
          await client.callTool({
            name: 'get_ui_recipe',
            arguments: { recipe: 'project-dashboard' },
          }),
        ).provenance.requestedVersion,
        '0.3.1',
      );
    },
    true,
    true,
  ));
