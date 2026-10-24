import type { Metadata } from 'next';
import { getPublishedRelease } from '../lib/published-release';
import { SiteTheme } from '../components/SiteTheme';
import '@devvy-ui/tokens/theme.css';
import '@devvy-ui/styles';
import '@devvy-ui/styles/fonts.css';
import './site.css';
import './controls.css';
import './editors.css';
import './paper.css';
import './landing.css';
import './landing-cards.css';
import './docs.css';
import './signature.css';
import './dropdowns.css';
import './search.css';
import './fonts.css';
import './support.css';

export async function generateMetadata(): Promise<Metadata> {
  const { label: releaseLabel } = await getPublishedRelease();
  return {
    metadataBase: new URL('https://devvy-ui.dev-station.dev'),
    title: {
      default: `DEVVY UI ${releaseLabel} — 100 React components`,
      template: `%s · DEVVY UI ${releaseLabel}`,
    },
    description: `DEVVY UI ${releaseLabel}: 100 typed React components, keyboard accessibility, customizable themes, optional DEVVY GLASS and MIT source ownership.`,
    icons: { icon: '/devvy-logo.png', apple: '/devvy-logo.png' },
    applicationName: 'DEVVY UI',
    authors: [{ name: 'DEV STATION', url: 'https://www.dev-station.dev' }],
    creator: 'DEV STATION',
    publisher: 'DEV STATION',
    robots: { index: true, follow: true },
  };
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-devvy-theme="light" data-devvy-style="minimal">
      <body>
        <SiteTheme>{children}</SiteTheme>
      </body>
    </html>
  );
}
