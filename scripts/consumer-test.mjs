import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const version = process.argv[2] ?? '18.3.1';
if (!['18.3.1', '19.3.1'].includes(version))
  throw new Error('Tested fixture versions: 18.3.1 and 19.3.1.');
if (!process.env.npm_execpath) throw new Error('Run with pnpm test:consumer <version>.');
const dir = fileURLToPath(new URL(`../.artifacts/consumer-${version}/`, import.meta.url));
const root = fileURLToPath(new URL('../', import.meta.url));
const pkg = JSON.parse(await readFile(resolve(root, 'packages/react/package.json'), 'utf8'));
const currentVersion = pkg.version;
await mkdir(dir, { recursive: true });
await writeFile(
  resolve(dir, 'pnpm-workspace.yaml'),
  'packages:\n  - "."\noverrides:\n' +
    ['tokens', 'styles', 'core', 'react']
      .map((name) => `  "@devvy-ui/${name}": "file:../devvy-ui-${name}-${currentVersion}.tgz"`)
      .join('\n') +
    '\n',
);
await writeFile(
  resolve(dir, 'package.json'),
  JSON.stringify(
    {
      name: `devvy-consumer-${version}`,
      private: true,
      type: 'module',
      dependencies: {
        react: version,
        'react-dom': version,
        jsdom: '26.1.0',
        ...Object.fromEntries(
          ['tokens', 'styles', 'core', 'react'].map((name) => [
            `@devvy-ui/${name}`,
            `file:../devvy-ui-${name}-${currentVersion}.tgz`,
          ]),
        ),
      },
    },
    null,
    2,
  ),
);
await writeFile(
  resolve(dir, 'test.mjs'),
  await readFile(new URL('./consumer-fixture.mjs', import.meta.url), 'utf8'),
);
await writeFile(
  resolve(dir, 'inventory.json'),
  await readFile(resolve(root, 'packages/react/components.json'), 'utf8'),
);
await writeFile(
  resolve(dir, 'completion-fixture.mjs'),
  await readFile(resolve(root, 'packages/react/src/components/completion-fixture.mjs'), 'utf8'),
);
execFileSync(
  process.execPath,
  [process.env.npm_execpath, 'install', '--ignore-scripts', '--force'],
  {
    cwd: dir,
    stdio: 'inherit',
  },
);
execFileSync(process.execPath, ['test.mjs'], { cwd: dir, stdio: 'inherit' });
