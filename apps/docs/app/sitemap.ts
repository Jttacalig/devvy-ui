import type { MetadataRoute } from 'next';
import { catalog } from '../lib/catalog';
import { docsUrl } from '../lib/release';

export default function sitemap(): MetadataRoute.Sitemap {
  const sections = [
    '',
    '/docs',
    '/getting-started',
    '/components',
    '/themes',
    '/playground',
    '/changelog',
    '/contributing',
    '/fonts',
    '/glass',
    '/mcp',
  ];
  // Omit lastModified rather than invent a fresh date on every regeneration.
  return [
    ...sections.map((path) => ({ url: `${docsUrl}${path}` })),
    ...catalog.map(({ slug }) => ({ url: `${docsUrl}/components/${slug}` })),
  ];
}
