import type { Metadata } from 'next';
import { docsUrl, releaseLabel } from './release';

export function docsMetadata(
  title: string,
  description: string,
  path = '',
  label = releaseLabel,
): Metadata {
  const url = `${docsUrl}${path}`;
  const socialTitle = `${title} · DEVVY UI ${label}`;
  const image = {
    url: `${new URL(docsUrl).origin}/ui/social-card`,
    width: 1200,
    height: 630,
    alt: 'DEVVY UI — 100 TypeScript React components by DEV STATION',
  };
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'DEVVY UI',
      title: socialTitle,
      description,
      url,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: socialTitle, description, images: [image] },
  };
}
