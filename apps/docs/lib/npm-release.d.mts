export function readNpmRelease(fetcher?: typeof fetch): Promise<string>;
export function resolveNpmVersion(
  readVersion: () => Promise<string>,
  fallback: string,
): Promise<string>;
