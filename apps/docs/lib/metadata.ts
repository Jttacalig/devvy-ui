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
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', siteName: 'DEVVY UI', title: socialTitle, description, url },
    twitter: { card: 'summary', title: socialTitle, description },
  };
}
