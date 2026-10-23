'use client';

import { CopyButton, Badge } from '@devvy-ui/react';
import { installCommand, npmPackageUrl } from '../lib/release';

export function LandingHeroBar({ version }: { version: string }) {
  const installCmd = installCommand;

  return (
    <div className="hero-install-container" role="region" aria-label="Quick installation">
      <span className="hero-install-label">Install with npm</span>
      <div className="hero-install-bar">
        <div className="hero-install-snippet">
          <span className="hero-install-prompt" aria-hidden="true">
            $
          </span>
          <code className="hero-install-code">{installCmd}</code>
        </div>
        <div className="hero-install-actions">
          <CopyButton
            text={installCmd}
            size="sm"
            variant="ghost"
            aria-label="Copy npm install command"
            className="hero-install-copy-btn"
          >
            Copy
          </CopyButton>
          <a
            href={npmPackageUrl}
            target="_blank"
            rel="noreferrer"
            className="hero-install-npm-link"
          >
            <Badge tone="neutral" className="hero-npm-badge">
              <span className="hero-npm-status-dot" aria-hidden="true" />
              npm ↗
            </Badge>
          </a>
        </div>
      </div>
      <p className="hero-install-version">npm latest · v{version}</p>
    </div>
  );
}
