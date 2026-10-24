import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const pkg = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
assert.equal(
  pkg.private,
  true,
  'Keep private until a separate publishing review approves release.',
);
for (const dependency of Object.values(pkg.dependencies))
  assert.doesNotMatch(dependency, /workspace:|file:|link:/);
const snapshot = JSON.parse(await readFile(new URL('dist/snapshot.json', root), 'utf8'));
assert.equal(snapshot.stable.version, '0.3.1');
assert.equal(snapshot.stable.items.length, 100);
assert.equal(snapshot.workspace.items.length, 100);
assert.ok(snapshot.versionData['0.3.1'].examples.length >= 3);
assert.match(await readFile(new URL('dist/server.mjs', root), 'utf8'), /^#!\/usr\/bin\/env node/);
assert.match(await readFile(new URL('LICENSE', root), 'utf8'), /MIT License/);
assert.ok((await readFile(new URL('README.md', root), 'utf8')).length);
console.log(
  'Standalone artifact is packable with external SDK/Zod runtime dependencies; publishing remains disabled by private:true.',
);
