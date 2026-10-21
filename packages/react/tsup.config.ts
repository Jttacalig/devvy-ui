import { defineConfig } from 'tsup';
import components from './components.json';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    ...Object.fromEntries(components.map(({ name, slug }) => [slug, `src/components/${name}.tsx`])),
  },
  format: ['esm'],
  dts: true,
  target: 'es2020',
  clean: true,
  sourcemap: true,
  splitting: true,
  external: ['react', 'react-dom', 'react/jsx-runtime', '@devvy-ui/core'],
  banner: { js: '"use client";' },
});
