export const MAX_RESPONSE_BYTES = 384 * 1024;
export const attribution = {
  author: 'Dev Station / DEVVY UI contributors',
  license: 'MIT',
  copyright: 'Copyright (c) 2026 Dev Station contributors',
  licenseUrl: 'https://github.com/Jttacalig/devvy-ui/blob/main/LICENSE',
  repository: 'https://github.com/Jttacalig/devvy-ui',
  notice: 'Preserve the included MIT copyright and license notices when copying source.',
};

export function boundedResult(value) {
  const response = {
    content: [{ type: 'text', text: JSON.stringify(value) }],
    structuredContent: value,
  };
  if (Buffer.byteLength(JSON.stringify(response), 'utf8') <= MAX_RESPONSE_BYTES) return response;
  const error = {
    error: {
      code: 'RESPONSE_TOO_LARGE',
      message:
        'Response exceeds the 384 KiB encoded limit. Request source without styles, a smaller result page or one component at a time.',
    },
    ...(value.provenance ? { provenance: value.provenance } : {}),
  };
  return {
    isError: true,
    content: [{ type: 'text', text: JSON.stringify(error) }],
    structuredContent: error,
  };
}

export function tokenEntries(styles) {
  const marker = '/* Devvy UI base component styles.';
  if (!styles.includes(marker)) throw new Error('Canonical token boundary is missing.');
  const css = styles.slice(0, styles.indexOf(marker)).replace(/\/\*[\s\S]*?\*\//g, '');
  const stack = [],
    entries = [];
  for (const match of css.matchAll(/([^{}]*)([{}])/g)) {
    if (match[2] === '{') stack.push(match[1].trim());
    else {
      const selector = stack.pop();
      for (const declaration of match[1].matchAll(/(--dvy-[\w-]+)\s*:\s*([^;]+);/g)) {
        const name = declaration[1];
        const category = /font/.test(name)
          ? 'typography'
          : /space|control-height/.test(name)
            ? 'spacing'
            : /radius/.test(name)
              ? 'radius'
              : /shadow|glass/.test(name)
                ? 'effects'
                : 'color';
        entries.push({
          name,
          value: declaration[2].trim(),
          selector,
          conditions: [...stack],
          category,
        });
      }
    }
  }
  if (!entries.length || stack.length) throw new Error('Invalid canonical token stylesheet.');
  return entries;
}

export function importsFor(code, registry, catalog) {
  return [
    ...code.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](@devvy-ui\/react\/([^'"]+))['"]/g),
  ].map((match) => {
    const item = registry.items.find((entry) => entry.name === match[3]);
    const component = catalog.find((entry) => entry.slug === match[3]);
    if (!item || !component) throw new Error(`Unsupported recipe component: ${match[3]}`);
    return {
      from: match[2],
      symbols: match[1].split(',').map((name) => name.trim()),
      component: component.name,
      slug: component.slug,
    };
  });
}

export function stylingFor(imports) {
  return {
    requiredImports: [
      '@devvy-ui/tokens/theme.css',
      '@devvy-ui/styles',
      ...(imports.some((entry) => entry.slug === 'glass') ? ['@devvy-ui/styles/glass.css'] : []),
    ],
    themeAttribute: 'data-devvy-theme="light", "dark" or "system" on your application container',
    customization:
      'Override --dvy- variables, native props and dvy- classes; keep focus and reduced-effects behavior.',
    fonts:
      'System fonts by default. Optional self-hosted font CSS entries are published since 0.3.0; import the chosen family explicitly and keep its OFL notices. Recipes do not require a font download.',
  };
}

export function describeExample(example, registry, catalog) {
  const imports = importsFor(example.code, registry, catalog);
  const files = new Map();
  for (const entry of imports) {
    for (const file of registry.items.find((item) => item.name === entry.slug).files)
      files.set(file.path, file);
  }
  return {
    ...example,
    imports,
    dependencies: {
      packages: ['@devvy-ui/react', '@devvy-ui/core', '@devvy-ui/styles', '@devvy-ui/tokens'],
      peers: { react: '^18.2.0 || ^19.0.0', 'react-dom': '^18.2.0 || ^19.0.0' },
      sourceFiles: [...files.keys()].sort(),
    },
    styling: stylingFor(imports),
    attribution,
    clientBoundary:
      'Use a client component boundary for interactive examples in React Server Component applications.',
  };
}
