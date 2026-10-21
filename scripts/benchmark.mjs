import { build, version as esbuildVersion } from 'esbuild';
import { gzipSync, brotliCompressSync } from 'node:zlib';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import assert from 'node:assert/strict';
import { TextDecoder } from 'node:util';
import { cpus } from 'node:os';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(resolve(root, 'packages/react/package.json'));
process.env.NODE_ENV = 'production';
const React = require('react');
const { renderToString } = require('react-dom/server');
const devvy = await import('../packages/react/dist/index.js');
const radix = await import('@radix-ui/react-tabs');
const sizes = (buffer) => ({
  minified: buffer.length,
  gzip: gzipSync(buffer).length,
  brotli: brotliCompressSync(buffer).length,
});
const results = {
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: `${process.platform}/${process.arch}`,
  react: React.version,
  esbuild: esbuildVersion,
  comparator: '@radix-ui/react-tabs@1.2.1',
  cpu: cpus()[0]?.model,
  mode: 'production',
  method:
    'esbuild browser ESM/es2020; React external; minify; compression defaults; SSR median of 5 runs after 100 warmups. Lower bytes does not prove faster interaction.',
  bundles: {},
  css: {},
  ssr: {},
};
const fixtures = {
  button: 'import { Button } from "./packages/react/dist/button.js"; console.log(Button);',
  tabs: 'import { Tabs } from "./packages/react/dist/tabs.js"; console.log(Tabs);',
  glass: 'import { Glass } from "./packages/react/dist/glass.js"; console.log(Glass);',
  dialog: 'import { Dialog } from "./packages/react/dist/dialog.js"; console.log(Dialog);',
  dock: 'import { Dock } from "./packages/react/dist/dock.js"; console.log(Dock);',
  chart: 'import { Chart } from "./packages/react/dist/chart.js"; console.log(Chart);',
  navbar: 'import { Navbar } from "./packages/react/dist/navbar.js"; console.log(Navbar);',
  sidebar: 'import { Sidebar } from "./packages/react/dist/sidebar.js"; console.log(Sidebar);',
  breadcrumbs:
    'import { Breadcrumbs } from "./packages/react/dist/breadcrumbs.js"; console.log(Breadcrumbs);',
  foundation:
    'import { Button, Input, Textarea, Label, Badge, Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription, Separator, Checkbox, Switch, Tabs, Glass, Dialog, Dock } from "./packages/react/dist/index.js"; console.log(Button, Input, Textarea, Label, Badge, Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription, Separator, Checkbox, Switch, Tabs, Glass, Dialog, Dock);',
  all: 'import * as UI from "./packages/react/dist/index.js"; console.log(UI);',
  radixTabs:
    'import { Root, List, Trigger, Content } from "@radix-ui/react-tabs"; console.log(Root, List, Trigger, Content);',
};
for (const [name, contents] of Object.entries(fixtures)) {
  const result = await build({
    stdin: { contents, resolveDir: root, loader: 'js' },
    bundle: true,
    minify: true,
    platform: 'browser',
    format: 'esm',
    target: 'es2020',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    write: false,
    logLevel: 'silent',
  });
  const bytes = result.outputFiles[0].contents;
  results.bundles[name] = sizes(bytes);
  if (name === 'button')
    for (const unused of ['dvy-tab-list', 'showModal', 'data-devvy-material'])
      assert.ok(!new TextDecoder().decode(bytes).includes(unused), `Button pulled in ${unused}`);
}
for (const name of ['tokens', 'styles', 'glass', 'foundation']) {
  const path =
    name === 'tokens'
      ? 'packages/tokens/src/theme.css'
      : name === 'glass'
        ? 'packages/styles/glass.css'
        : 'packages/styles/components.css';
  const result = await build({
    ...(name === 'foundation'
      ? {
          stdin: {
            contents: (await readFile(resolve(root, path), 'utf8')).split('/* Data display */')[0],
            loader: 'css',
          },
        }
      : { entryPoints: [resolve(root, path)] }),
    minify: true,
    write: false,
    logLevel: 'silent',
  });
  results.css[name] = sizes(result.outputFiles[0].contents);
}
const h = React.createElement;
const views = ['Overview', 'Settings'];
const trees = {
  devvyTabs: h(devvy.Tabs, {
    label: 'Benchmark',
    items: views.map((value) => ({ value, label: value, content: h('p', null, value) })),
  }),
  radixTabs: h(
    radix.Root,
    { defaultValue: views[0] },
    h(
      radix.List,
      { 'aria-label': 'Benchmark' },
      views.map((value) => h(radix.Trigger, { key: value, value }, value)),
    ),
    views.map((value) =>
      h(
        radix.Content,
        { key: value, value, forceMount: true, hidden: value !== views[0] },
        h('p', null, value),
      ),
    ),
  ),
};
for (const [name, tree] of Object.entries(trees)) {
  for (let i = 0; i < 100; i++) renderToString(tree);
  const samples = [];
  for (let sample = 0; sample < 5; sample++) {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) renderToString(tree);
    samples.push((performance.now() - start) / 1000);
  }
  results.ssr[name] = {
    millisecondsPerRenderMedian: [...samples].sort((a, b) => a - b)[2],
    samples,
  };
}
await writeFile(resolve(root, 'benchmarks/results.json'), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
const budgets = JSON.parse(await readFile(resolve(root, 'benchmarks/budgets.json'), 'utf8'));
for (const [name, limit] of Object.entries(budgets.gzip))
  assert.ok(results.bundles[name].gzip <= limit, `${name} exceeds ${limit} gzip bytes`);
for (const [name, limit] of Object.entries(budgets.cssGzip))
  assert.ok(results.css[name].gzip <= limit, `${name} CSS exceeds ${limit} gzip bytes`);
