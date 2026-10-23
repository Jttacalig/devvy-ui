import Link from 'next/link';
import Image from 'next/image';
import { Badge, Separator } from '@devvy-ui/react';
import { DocsShell } from '../../components/DocsShell';
import { SiteSearch } from '../../components/SiteSearch';
import { ThemeControl } from '../../components/ThemeControl';
import { HeaderNavigation } from '../../components/HeaderNavigation';
import { catalog } from '../../lib/catalog';
import { releaseLabel } from '../../lib/release';

export default function UILayout({ children }: { children: React.ReactNode }) {
  const navigationItems = catalog.map(({ name, slug, description }) => ({
    name,
    slug,
    description,
  }));
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>
      <header className="site-header dvy-glass-surface">
        <Link className="wordmark" href="/ui">
          <span className="brand-symbol">
            <Image src="/devvy-logo.png" alt="DEVVY UI" width={32} height={32} priority />
          </span>
          <span className="wordmark-title">
            devvy<span className="wordmark-ui">ui</span>
          </span>
          <Badge tone="neutral" className="release-tag">
            {releaseLabel}
          </Badge>
          <span className="sr-only"> home</span>
        </Link>
        <HeaderNavigation />
        <div className="header-actions">
          <SiteSearch items={navigationItems} />
          <a
            className="header-icon-link"
            href="https://www.npmjs.com/package/@devvy-ui/react"
            target="_blank"
            rel="noreferrer"
            aria-label="npm package @devvy-ui/react"
            title="View @devvy-ui/react on npm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464V8.784h-3.454v10.394H5.13z" />
            </svg>
          </a>
          <a
            className="header-icon-link"
            href="https://github.com/Jttacalig/devvy-ui"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          </a>
          <ThemeControl />
        </div>
      </header>
      <DocsShell items={navigationItems}>
        {children}
        <Separator className="footer-separator" />
        <footer className="site-footer">
          <div className="footer-meta">
            <span>
              Made with intention by{' '}
              <a href="https://www.dev-station.dev" target="_blank" rel="noreferrer">
                DEV STATION ↗
              </a>
            </span>
            <span className="footer-sep">·</span>
            <a href="https://github.com/Jttacalig" target="_blank" rel="noreferrer">
              Built by @Jttacalig ↗
            </a>
            <span className="footer-sep">·</span>
            <a href="https://github.com/Jttacalig/devvy-ui" target="_blank" rel="noreferrer">
              Source on GitHub ↗
            </a>
            <span className="footer-sep">·</span>
            <a
              href="https://www.npmjs.com/package/@devvy-ui/react"
              target="_blank"
              rel="noreferrer"
            >
              npm package ↗
            </a>
            <span className="footer-sep">·</span>
            <span>Open source under MIT license</span>
          </div>
          <div className="footer-badge">
            <Badge tone="neutral">{releaseLabel}</Badge>
          </div>
        </footer>
      </DocsShell>
    </>
  );
}
