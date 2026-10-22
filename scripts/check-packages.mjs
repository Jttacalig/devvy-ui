import { readFile, access } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { componentSources } from '../packages/registry/dependencies.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const workspacePackage = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
for (const name of ['core', 'react', 'styles', 'tokens', 'registry', 'cli']) {
  const dir = resolve(root, 'packages', name);
  const pkg = JSON.parse(await readFile(resolve(dir, 'package.json'), 'utf8'));
  assert.equal(
    pkg.version,
    workspacePackage.version,
    `${pkg.name} differs from fixed workspace version`,
  );
  await access(resolve(dir, 'LICENSE'));
  for (const [key, target] of Object.entries(pkg.exports ?? {})) {
    if (typeof target === 'string') await access(resolve(dir, target));
    else {
      for (const file of Object.values(target)) await access(resolve(dir, file));
      if (target.import) {
        const entry = await import(pathToFileURL(resolve(dir, target.import)).href);
        assert.ok(Object.keys(entry).length, `${pkg.name}${key} has no exports`);
        if (name === 'react')
          assert.match(await readFile(resolve(dir, target.import), 'utf8'), /["']use client["']/);
      }
    }
  }
  for (const bin of Object.values(pkg.bin ?? {})) await access(resolve(dir, bin));
  assert.ok(pkg.files?.includes('LICENSE'), `${name} must ship its license`);
  console.log(`Verified ${pkg.name}: public entries, declarations, metadata and license.`);
}
const registry = JSON.parse(
  await readFile(resolve(root, 'packages/registry/dist/registry.json'), 'utf8'),
);
const components = JSON.parse(
  await readFile(resolve(root, 'packages/react/components.json'), 'utf8'),
);
const reactPackage = JSON.parse(
  await readFile(resolve(root, 'packages/react/package.json'), 'utf8'),
);
const barrel = await import(pathToFileURL(resolve(root, 'packages/react/dist/index.js')).href);
assert.equal(
  new Set(components.map((item) => item.name)).size,
  components.length,
  'Duplicate component names',
);
assert.equal(
  new Set(components.map((item) => item.slug)).size,
  components.length,
  'Duplicate component slugs',
);
assert.deepEqual(
  registry.items.map((item) => item.name).sort(),
  components.map((item) => item.slug).sort(),
);
assert.deepEqual(
  Object.keys(reactPackage.exports)
    .filter((key) => key !== '.' && key !== './styles.css')
    .sort(),
  components.map((item) => `./${item.slug}`).sort(),
);
for (const { name, slug } of components) {
  assert.match(name, /^[A-Z][A-Za-z0-9]*$/);
  assert.match(slug, /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/);
  assert.ok(barrel[name], `Missing barrel export: ${name}`);
  const focused = await import(
    pathToFileURL(resolve(root, 'packages/react', reactPackage.exports[`./${slug}`].import)).href
  );
  assert.equal(focused[name], barrel[name], `Focused entry differs: ${slug}`);
}
const license = await readFile(resolve(root, 'LICENSE'), 'utf8');
assert.equal(
  registry.styles,
  '/*!\n' +
    license +
    '*/\n' +
    (await readFile(resolve(root, 'packages/tokens/src/theme.css'), 'utf8')) +
    '\n' +
    (await readFile(resolve(root, 'packages/styles/components.css'), 'utf8')),
);
for (const item of registry.items) {
  const { name, dependencies = [] } = components.find((component) => component.slug === item.name);
  assert.equal(new Set(dependencies).size, dependencies.length, `Duplicate dependencies: ${name}`);
  for (const dependency of dependencies)
    assert.ok(
      components.some((component) => component.name === dependency),
      `Unknown dependency: ${name}/${dependency}`,
    );
  const expectedPaths = [
    'LICENSE',
    'lib/core.ts',
    'lib/glass.ts',
    'lib/cx.ts',
    ...componentSources(components, name).map((dependency) => `components/${dependency}.tsx`),
    ...new Set(
      componentSources(components, name)
        .flatMap(
          (dependency) =>
            components.find((component) => component.name === dependency).helpers ?? [],
        )
        .map((helper) => 'lib/' + helper),
    ),
    ...(name === 'Glass' ? ['glass.css'] : []),
  ];
  assert.deepEqual(
    item.files.map((file) => file.path).sort(),
    expectedPaths.sort(),
    `Unexpected files: ${item.name}`,
  );
  for (const file of item.files) {
    let expected;
    if (file.path.startsWith('components/')) {
      expected = (
        await readFile(resolve(root, 'packages/react/src', file.path), 'utf8')
      ).replaceAll("'@devvy-ui/core'", "'../lib/core'");
    } else if (file.path === 'LICENSE') expected = license;
    else if (
      components.some((component) => component.helpers?.includes(file.path.slice(4))) &&
      file.path.startsWith('lib/')
    )
      expected = await readFile(resolve(root, 'packages/react/src', file.path), 'utf8');
    else if (file.path === 'lib/cx.ts') expected = "export { cx } from './core';\n";
    else if (file.path === 'glass.css')
      expected =
        '/*!\n' +
        license +
        '*/\n' +
        (await readFile(resolve(root, 'packages/styles/glass.css'), 'utf8'));
    else
      expected = await readFile(
        resolve(
          root,
          file.path === 'lib/core.ts' ? 'packages/core/src/index.ts' : 'packages/core/src/glass.ts',
        ),
        'utf8',
      );
    assert.equal(file.content, expected, `Registry drift: ${item.name}/${file.path}`);
  }
}
console.log(
  `Verified all ${components.length} component entries, helpers, styles and source registry parity.`,
);
