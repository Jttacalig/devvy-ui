#!/usr/bin/env node
import { readFile, writeFile, mkdir, lstat, realpath } from 'node:fs/promises';
import { resolve, relative, dirname, isAbsolute, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

async function exists(path) {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

/** Reject traversal and symlink ancestors before touching a project file. */
async function safePath(root, path) {
  if (typeof path !== 'string' || !path || isAbsolute(path))
    throw new Error('Paths must be relative to the project.');
  const target = resolve(root, path);
  const rel = relative(root, target);
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel))
    throw new Error('Path escapes project directory.');
  let current = target;
  while (current !== root) {
    if ((await exists(current)) && (await lstat(current)).isSymbolicLink())
      throw new Error(`Symlink paths are not supported: ${path}`);
    current = dirname(current);
  }
  return target;
}

export async function run(args, directory = process.cwd()) {
  const root = await realpath(directory);
  const [command, ...names] = args;
  if (!command || command === '--help')
    return 'Usage: devvy-ui init | add <component...> | doctor\nAlpha: local bundled registry; packages are not published.';
  const configPath = await safePath(root, 'devvy.json');
  const registry = JSON.parse(
    await readFile(
      import.meta.resolve('@devvy-ui/registry/registry.json').startsWith('file:')
        ? fileURLToPath(import.meta.resolve('@devvy-ui/registry/registry.json'))
        : import.meta.resolve('@devvy-ui/registry/registry.json'),
      'utf8',
    ),
  );
  if (command === 'init') {
    if (await exists(configPath))
      throw new Error('devvy.json already exists. Review it before changing configuration.');
    const config = {
      schemaVersion: 1,
      components: 'src/components/devvy',
      styles: 'src/devvy.css',
    };
    const styles = await safePath(root, config.styles);
    if (await exists(styles))
      throw new Error('src/devvy.css already exists; no files were changed.');
    await mkdir(dirname(styles), { recursive: true });
    await writeFile(styles, registry.styles, { flag: 'wx' });
    await writeFile(configPath, JSON.stringify(config, null, 2) + '\n', { flag: 'wx' });
    return 'Created devvy.json and src/devvy.css. Import the CSS once in your app entry, then run add button.';
  }
  if (!(await exists(configPath))) throw new Error('Run init first.');
  const config = JSON.parse(await readFile(configPath, 'utf8'));
  if (config.schemaVersion !== 1) throw new Error('Unsupported configuration schema.');
  const components = await safePath(root, config.components);
  const styles = await safePath(root, config.styles);
  if (command === 'doctor') {
    const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
    if (!pkg.dependencies?.react && !pkg.devDependencies?.react)
      throw new Error(
        'React is missing from package.json. Install a supported React 18/19 version.',
      );
    if (!(await exists(styles))) throw new Error(`Missing stylesheet: ${config.styles}`);
    return 'Configuration, React declaration and stylesheet found. Run your app build and accessibility checks to verify integration.';
  }
  if (command !== 'add') throw new Error(`Unknown command: ${command}`);
  if (!names.length) throw new Error('Specify at least one component.');
  const pending = new Map();
  for (const name of names) {
    const item = registry.items.find((item) => item.name === name);
    if (!item)
      throw new Error(
        `Unknown component: ${name}. Available: ${registry.items.map((item) => item.name).join(', ')}`,
      );
    for (const file of item.files) {
      const target = await safePath(root, relative(root, resolve(components, file.path)));
      if ((await exists(target)) && (await readFile(target, 'utf8')) !== file.content)
        throw new Error(`Refusing to overwrite edited file: ${relative(root, target)}`);
      pending.set(target, file.content);
    }
  }
  for (const [target, content] of pending) {
    if (await exists(target)) continue;
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, content, { flag: 'wx' });
  }
  return `Installed ${names.join(', ')} in ${config.components}. Import components from their individual files. ${names.includes('glass') ? `Import ${config.components}/glass.css after your base stylesheet to enable the optional material. ` : ''}Styles are a snapshot from init; review upstream changes manually.`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run(process.argv.slice(2))
    .then((message) => console.log(message))
    .catch((error) => {
      console.error(`DEVVY UI: ${error.message}`);
      process.exitCode = 1;
    });
}
