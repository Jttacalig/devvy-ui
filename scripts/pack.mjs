import { mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
if (!process.env.npm_execpath) throw new Error('Run this using pnpm pack:all.');
await mkdir(new URL('../.artifacts/', import.meta.url), { recursive: true });
for (const name of ['tokens', 'styles', 'core', 'react', 'registry', 'cli']) {
  execFileSync(
    process.execPath,
    [
      process.env.npm_execpath,
      '--dir',
      `packages/${name}`,
      'pack',
      '--pack-destination',
      '../../.artifacts',
    ],
    { cwd: root, stdio: 'inherit' },
  );
}
