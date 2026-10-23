import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';

const run = promisify(execFile);
const require = createRequire(import.meta.url);
const inspector = resolve(
  dirname(require.resolve('@modelcontextprotocol/inspector/package.json')),
  'clients/launcher/build/index.js',
);
const directory = fileURLToPath(new URL('../../../.artifacts/', import.meta.url));
await mkdir(directory, { recursive: true });
const config = resolve(directory, 'mcp-inspector-config.json');
await writeFile(
  config,
  JSON.stringify({
    mcpServers: {
      devvy: {
        command: process.execPath,
        args: [fileURLToPath(new URL('../dist/server.mjs', import.meta.url))],
      },
    },
  }),
);
async function inspect(name, args) {
  const { stdout, stderr } = await run(
    process.execPath,
    [
      inspector,
      '--cli',
      '--config',
      config,
      '--server',
      'devvy',
      '--protocol-era',
      'modern',
      ...args,
    ],
    { timeout: 30000, maxBuffer: 1024 * 1024, windowsHide: true },
  );
  await writeFile(resolve(directory, `mcp-inspector-${name}.json`), stdout);
  assert.doesNotMatch(stderr, /Warning:|Error:|"error"|failed/i);
  return JSON.parse(stdout);
}
function payload(value) {
  return value.result ?? value;
}

test('official Inspector CLI discovers eight portable tool schemas and nine resources', async () => {
  const tools = payload(await inspect('tools', ['--method', 'tools/list', '--strict']));
  assert.equal(tools.tools.length, 8);
  const resources = payload(await inspect('resources', ['--method', 'resources/list']));
  assert.equal(resources.resources.length, 9);
});

test('official Inspector CLI calls new tools, reads versioned data and retrieves reusable prompts', async () => {
  for (const [tool, args] of [
    ['get_design_tokens', ['category=typography']],
    ['get_component_examples', ['slug=data-table', 'version=workspace']],
    ['get_ui_recipe', ['recipe=glass-workspace']],
  ]) {
    const value = payload(
      await inspect(tool, ['--method', 'tools/call', '--tool-name', tool, '--tool-arg', ...args]),
    );
    assert.equal(value.isError, undefined);
    assert.ok(value.structuredContent.provenance.registrySha256);
  }
  const resource = payload(
    await inspect('tokens', ['--method', 'resources/read', '--uri', 'devvy://tokens/0.2.0']),
  );
  assert.equal(JSON.parse(resource.contents[0].text).provenance.requestedVersion, '0.2.0');
  const prompts = payload(await inspect('prompts', ['--method', 'prompts/list']));
  assert.equal(prompts.prompts.length, 3);
  const prompt = payload(
    await inspect('prompt', [
      '--method',
      'prompts/get',
      '--prompt-name',
      'build_ui',
      '--prompt-args',
      'recipe=project-dashboard',
      'version=0.2.0',
    ]),
  );
  assert.doesNotMatch(JSON.parse(prompt.messages[0].content.text).recipe.code, /rowSelection/);
});
