import 'server-only';
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { readNpmRelease, resolveNpmVersion } from './npm-release.mjs';
import { publishedNpmVersion } from './release';

// Cache only a validated, complete six-package release. Failed refreshes retain the
// last successful cached result; a cold failure falls back to the verified baseline.
const cachedVersion = unstable_cache(() => readNpmRelease(), ['devvy-npm-stable-v1'], {
  revalidate: 300,
});

export const getPublishedRelease = cache(async () => {
  const version = await resolveNpmVersion(cachedVersion, publishedNpmVersion);
  return { version, label: `v${version} Stable` };
});
