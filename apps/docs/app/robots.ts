import type { MetadataRoute } from 'next';
import { docsUrl } from '../lib/release';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${new URL(docsUrl).origin}/sitemap.xml`,
  };
}
