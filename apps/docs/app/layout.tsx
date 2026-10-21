import type { Metadata } from 'next';
import '@devvy-ui/tokens/theme.css';
import '@devvy-ui/styles';
import './site.css';
import './controls.css';
import './editors.css';
import './paper.css';

export const metadata: Metadata = {
  title: { default: 'DEVVY UI — Build once. Style freely.', template: '%s · DEVVY UI' },
  description:
    'A small, accessible React foundation by DEV STATION. Open source. Ordinary CSS. Every detail yours.',
  icons: { icon: '/devvy-logo.png', apple: '/devvy-logo.png' },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-devvy-theme="light">
      <body>{children}</body>
    </html>
  );
}
