import { readFile, access } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = fileURLToPath(new URL('../', import.meta.url));
for (const name of ['core', 'react', 'styles', 'tokens', 'registry', 'cli']) {
  const dir = resolve(root, 'packages', name);
  const pkg = JSON.parse(await readFile(resolve(dir, 'package.json'), 'utf8'));
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
assert.equal(registry.items.length, 17);
for (const item of registry.items) {
  const file = item.files.find((file) => file.path.startsWith('components/'));
  assert.ok(file, `Missing source for ${item.name}`);
  const name = file.path.split('/').pop();
  const canonical = await readFile(resolve(root, 'packages/react/src/components', name), 'utf8');
  assert.equal(file.content, canonical.replaceAll("'@devvy-ui/core'", "'../lib/core'"));
}
console.log('Verified source registry parity for all 17 entries.');
