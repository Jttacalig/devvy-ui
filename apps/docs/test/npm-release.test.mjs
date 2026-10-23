import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { readNpmRelease, resolveNpmVersion } from '../lib/npm-release.mjs';
const { Response } = globalThis;

test('resolves future stable releases from all six fixed public npm endpoints', async () => {
  const urls = [];
  const version = await readNpmRelease(async (url, options) => {
    urls.push(url);
    assert.equal(options.cache, 'no-store');
    assert.ok(options.signal);
    return new Response(JSON.stringify({ latest: '0.4.0', beta: '0.5.0-beta.1' }));
  });
  assert.equal(version, '0.4.0');
  assert.equal(new Set(urls).size, 6);
  assert.ok(
    urls.every((url) =>
      /^https:\/\/registry\.npmjs\.org\/-\/package\/@devvy-ui%2f(react|core|tokens|styles|registry|cli)\/dist-tags$/.test(
        url,
      ),
    ),
  );
});

test('rejects a partially completed publication instead of claiming a six-package release', async () => {
  await assert.rejects(
    readNpmRelease(
      async (url) =>
        new Response(JSON.stringify({ latest: url.includes('react/') ? '0.4.0' : '0.3.0' })),
    ),
    /incomplete/,
  );
});

test('rejects malformed tags, prereleases, registry errors and oversized responses', async () => {
  for (const latest of [
    null,
    3,
    '',
    '0.4.0-beta.1',
    '01.2.3',
    'v0.4.0',
    '0.4.0+build',
    '<script>',
  ]) {
    await assert.rejects(
      readNpmRelease(async () => new Response(JSON.stringify({ latest }))),
      /stable/,
    );
  }
  await assert.rejects(
    readNpmRelease(async () => new Response('unavailable', { status: 503 })),
    /unavailable/,
  );
  await assert.rejects(
    readNpmRelease(async () => new Response('{bad json')),
    SyntaxError,
  );
  await assert.rejects(
    readNpmRelease(async () => new Response('x'.repeat(8193))),
    /limit/,
  );
  await assert.rejects(
    readNpmRelease(async () => {
      throw new Error('offline');
    }),
    /offline/,
  );
});

test('cold registry failures preserve a verified fallback and later reads can recover', async () => {
  const offline = () =>
    readNpmRelease(async () => {
      throw new Error('offline');
    });
  assert.equal(await resolveNpmVersion(offline, '0.3.0'), '0.3.0');
  assert.equal(
    await resolveNpmVersion(
      () => readNpmRelease(async () => new Response('{"latest":"0.4.0"}')),
      '0.3.0',
    ),
    '0.4.0',
  );
});

test('a stalled registry request is bounded by the server timeout', async () => {
  const stalled = (_url, { signal }) => delay(10000, undefined, { signal });
  await assert.rejects(readNpmRelease(stalled), { name: 'AbortError' });
});
