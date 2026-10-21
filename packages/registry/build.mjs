import { readFile, mkdir, writeFile } from 'node:fs/promises';
const root = new URL('../../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const license = await read('LICENSE');
const pkg = JSON.parse(await read('packages/registry/package.json'));
const common = [
  { path: 'lib/core.ts', content: await read('packages/core/src/index.ts') },
  { path: 'lib/glass.ts', content: await read('packages/core/src/glass.ts') },
  { path: 'lib/cx.ts', content: "export { cx } from './core';\n" },
  { path: 'LICENSE', content: license },
];
const components = JSON.parse(await read('packages/react/components.json'));
const items = await Promise.all(
  components.map(async ({ name, slug }) => ({
    name: slug,
    files: [
      ...common,
      {
        path: `components/${name}.tsx`,
        content: (await read(`packages/react/src/components/${name}.tsx`)).replaceAll(
          "'@devvy-ui/core'",
          "'../lib/core'",
        ),
      },
      ...(name === 'Dialog'
        ? [
            {
              path: 'components/Button.tsx',
              content: await read('packages/react/src/components/Button.tsx'),
            },
          ]
        : []),
      ...(name === 'Glass'
        ? [
            {
              path: 'glass.css',
              content: '/*!\n' + license + '*/\n' + (await read('packages/styles/glass.css')),
            },
          ]
        : []),
    ],
  })),
);
await mkdir(new URL('./dist/', import.meta.url), { recursive: true });
await writeFile(
  new URL('./dist/registry.json', import.meta.url),
  JSON.stringify(
    {
      schemaVersion: 1,
      version: pkg.version,
      license: 'MIT',
      items,
      styles:
        '/*!\n' +
        license +
        '*/\n' +
        (await read('packages/tokens/src/theme.css')) +
        '\n' +
        (await read('packages/styles/components.css')),
    },
    null,
    2,
  ) + '\n',
);
await writeFile(new URL('./LICENSE', import.meta.url), await read('LICENSE'));
console.log(`Generated registry from ${items.length} canonical implementations.`);
