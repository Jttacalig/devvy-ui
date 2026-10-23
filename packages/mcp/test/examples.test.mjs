import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile, mkdtemp } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const snapshot = JSON.parse(
  await readFile(new URL('../dist/snapshot.json', import.meta.url), 'utf8'),
);
const artifactRoot = fileURLToPath(new URL('../../../.artifacts/', import.meta.url));
const typesRoot = fileURLToPath(new URL('../node_modules/@types/react/', import.meta.url));

async function compile(examples, registry) {
  await mkdir(artifactRoot, { recursive: true });
  const directory = await mkdtemp(join(artifactRoot, 'mcp-types-'));
  const files = new Map();
  for (const example of examples) {
    for (const entry of example.imports) {
      for (const file of registry.items.find((item) => item.name === entry.slug).files)
        files.set(file.path, file.content);
    }
    files.set(
      `${example.id}.tsx`,
      example.code.replace(/(['"])@devvy-ui\/react\/([^'"]+)\1/g, (_, quote, slug) => {
        const name = snapshot.catalog.find((item) => item.slug === slug).name;
        return `${quote}./components/${name}${quote}`;
      }),
    );
  }
  for (const [path, content] of files) {
    const target = join(directory, path);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content);
  }
  const program = ts.createProgram(
    examples.map((entry) => join(directory, `${entry.id}.tsx`)),
    {
      noEmit: true,
      strict: true,
      skipLibCheck: true,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      lib: ['lib.es2020.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
      baseUrl: directory,
      paths: {
        react: [join(typesRoot, 'index.d.ts')],
        'react/jsx-runtime': [join(typesRoot, 'jsx-runtime.d.ts')],
      },
      types: [],
    },
  );
  return ts.getPreEmitDiagnostics(program);
}

test('all six recipe variants type-check against their own canonical registry closure', async () => {
  for (const version of ['0.2.0', 'workspace']) {
    const diagnostics = await compile(
      snapshot.versionData[version].examples,
      version === '0.2.0' ? snapshot.stable : snapshot.workspace,
    );
    assert.equal(
      diagnostics.length,
      0,
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCurrentDirectory: () => artifactRoot,
        getCanonicalFileName: (path) => path,
        getNewLine: () => '\n',
      }),
    );
  }
});

test('workspace-only selection deliberately fails compilation against published 0.2.0', async () => {
  const example = snapshot.versionData.workspace.examples.find(
    (entry) => entry.id === 'project-dashboard',
  );
  const diagnostics = await compile([example], snapshot.stable);
  assert.ok(
    diagnostics.some((entry) =>
      ts.flattenDiagnosticMessageText(entry.messageText, '\n').includes('rowSelection'),
    ),
  );
});
