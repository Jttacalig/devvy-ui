const packages = ['react', 'core', 'tokens', 'styles', 'registry', 'cli'];
const stableVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

// Only fixed, public npm endpoints are read. No tokens or caller-supplied URLs.
export async function readNpmRelease(fetcher = globalThis.fetch) {
  const versions = await Promise.all(
    packages.map(async (name) => {
      const response = await fetcher(
        `https://registry.npmjs.org/-/package/@devvy-ui%2f${name}/dist-tags`,
        { cache: 'no-store', signal: globalThis.AbortSignal.timeout(2500) },
      );
      if (!response.ok) throw new Error('npm release metadata unavailable');
      const reader = response.body?.getReader();
      if (!reader) throw new Error('npm release metadata missing');
      const chunks = [];
      let size = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          size += value.byteLength;
          if (size > 8192) throw new Error('npm release metadata exceeds limit');
          chunks.push(value);
        }
      } finally {
        await reader.cancel();
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
      const data = JSON.parse(new globalThis.TextDecoder().decode(bytes));
      if (
        typeof data?.latest !== 'string' ||
        data.latest.length > 64 ||
        !stableVersion.test(data.latest)
      ) {
        throw new Error('npm latest must be a stable version');
      }
      return data.latest;
    }),
  );
  if (!versions.every((version) => version === versions[0])) {
    throw new Error('npm release is incomplete across the six packages');
  }
  return versions[0];
}

export async function resolveNpmVersion(readVersion, fallback) {
  try {
    return await readVersion();
  } catch {
    return fallback;
  }
}
