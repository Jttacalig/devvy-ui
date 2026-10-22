'use client';

import { CopyButton, Badge } from '@devvy-ui/react';
import { installCommand } from '../lib/release';

export function LandingHeroBar() {
  const installCmd = installCommand;

  return (
    <div className="hero-install-bar" role="region" aria-label="Quick installation">
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
          variant="outline"
          aria-label="Copy npm install command"
          className="hero-install-copy-btn"
        >
          Copy
        </CopyButton>
        <a
          href="https://www.npmjs.com/package/@devvy-ui/react"
          target="_blank"
          rel="noreferrer"
          className="hero-install-npm-link"
        >
          <Badge tone="brand" className="hero-npm-badge">
            <span className="hero-npm-status-dot" aria-hidden="true" />
            npm registry ↗
          </Badge>
        </a>
      </div>
    </div>
  );
}
