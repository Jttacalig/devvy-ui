import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../src/cli.mjs';
import { componentSources } from '../../registry/dependencies.mjs';

test('source installation, repeat installs and doctor', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'devvy-cli-'));
  await writeFile(
    join(dir, 'package.json'),
    JSON.stringify({ dependencies: { react: '^19.0.0' } }),
  );
  await run(['init'], dir);
  await run(['add', 'button', 'tabs'], dir);
  await run(['add', 'button'], dir);
  assert.match(
    await readFile(join(dir, 'src/components/devvy/components/Tabs.tsx'), 'utf8'),
    /\.\.\/lib\/core/,
  );
  assert.match(await run(['doctor'], dir), /stylesheet found/);
  assert.doesNotMatch(await readFile(join(dir, 'src/devvy.css'), 'utf8'), /--dvy-glass-filter/);
  const glass = await run(['add', 'glass', 'dialog', 'dock'], dir);
  assert.match(glass, /glass.css/);
  assert.match(
    await readFile(join(dir, 'src/components/devvy/glass.css'), 'utf8'),
    /backdrop-filter/,
  );
  assert.match(
    await readFile(join(dir, 'src/components/devvy/lib/glass.ts'), 'utf8'),
    /resolveGlassQuality/,
  );
  assert.match(
    await readFile(join(dir, 'src/components/devvy/components/Dialog.tsx'), 'utf8'),
    /showModal/,
  );
  await run(['add', 'chart', 'navbar', 'sidebar', 'breadcrumbs'], dir);
  for (const name of ['Chart', 'Navbar', 'Sidebar', 'Breadcrumbs']) {
    assert.match(
      await readFile(join(dir, 'src/components/devvy/components/' + name + '.tsx'), 'utf8'),
      new RegExp('export const ' + name),
    );
  }
  await run(['add', 'select', 'alert', 'progress', 'skeleton'], dir);
  for (const name of ['Select', 'Alert', 'Progress', 'Skeleton']) {
    assert.equal(
      await readFile(join(dir, 'src/components/devvy/components/' + name + '.tsx'), 'utf8'),
      await readFile(
        new URL('../../react/src/components/' + name + '.tsx', import.meta.url),
        'utf8',
      ),
    );
  }
  await assert.rejects(run(['init'], dir), /already exists/);
  await assert.rejects(run(['add', 'missing-widget'], dir), /Unknown component/);
  await writeFile(join(dir, 'src/components/devvy/components/Button.tsx'), '// my edits');
  await assert.rejects(run(['add', 'button'], dir), /Refusing to overwrite/);
});

test('source dependency closure deduplicates shared dependencies and rejects invalid graphs', () => {
  assert.throws(
    () => componentSources([{ name: 'Panel', helpers: ['../escape.ts'] }], 'Panel'),
    /Invalid React helper path/,
  );
  const inventory = [
    { name: 'Panel', dependencies: ['Action', 'Button'] },
    { name: 'Action', dependencies: ['Button'] },
    { name: 'Button' },
  ];
  assert.deepEqual(componentSources(inventory, 'Panel'), ['Panel', 'Action', 'Button']);
  assert.throws(
    () => componentSources([{ name: 'Panel', dependencies: ['Missing'] }], 'Panel'),
    /Unknown component/,
  );
  assert.throws(
    () =>
      componentSources(
        [
          { name: 'Panel', dependencies: ['Action'] },
          { name: 'Action', dependencies: ['Panel'] },
        ],
        'Panel',
      ),
    /Circular component/,
  );
});
test('rejects path traversal and missing configuration', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'devvy-cli-'));
  await assert.rejects(run(['add', 'button'], dir), /Run init/);
  await mkdir(join(dir, 'src'));
  await writeFile(
    join(dir, 'devvy.json'),
    JSON.stringify({ schemaVersion: 1, components: '../escape', styles: 'src/devvy.css' }),
  );
  await assert.rejects(run(['add', 'button'], dir), /escapes project/);
});

test('installs the full canonical inventory and standalone composed dependencies', async () => {
  const inventory = JSON.parse(
    await readFile(new URL('../../react/components.json', import.meta.url), 'utf8'),
  );
  const dir = await mkdtemp(join(tmpdir(), 'devvy-midpoint-'));
  await writeFile(
    join(dir, 'package.json'),
    JSON.stringify({ dependencies: { react: '^18.3.1' } }),
  );
  await run(['init'], dir);
  await run(
    [
      'add',
      'segmented-control',
      'copy-button',
      'icon-button',
      'gallery',
      'command-palette',
      'hover-card',
      'rich-text-editor',
    ],
    dir,
  );
  for (const name of ['RadioGroup', 'Button', 'Lightbox', 'Dialog', 'Popover', 'MarkdownViewer'])
    assert.match(
      await readFile(join(dir, 'src/components/devvy/components/' + name + '.tsx'), 'utf8'),
      new RegExp('export const ' + name),
    );
  assert.equal(
    await readFile(join(dir, 'src/components/devvy/lib/widgets.tsx'), 'utf8'),
    await readFile(new URL('../../react/src/lib/widgets.tsx', import.meta.url), 'utf8'),
  );
  await run(['add', ...inventory.map((item) => item.slug)], dir);
  for (const { name } of inventory) {
    const canonical = await readFile(
      new URL('../../react/src/components/' + name + '.tsx', import.meta.url),
      'utf8',
    );
    assert.equal(
      await readFile(join(dir, 'src/components/devvy/components/' + name + '.tsx'), 'utf8'),
      canonical.replaceAll("'@devvy-ui/core'", "'../lib/core'"),
    );
  }
  assert.match(await run(['doctor'], dir), /stylesheet found/);
});
