'use client';

import {
  Tabs,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  CopyButton,
} from '@devvy-ui/react';
import { publishedNpmTag, publishedNpmVersion } from '../lib/release';

export function LandingInstall() {
  const pkgManagers = [
    { name: 'npm', cmd: `npm install @devvy-ui/react@${publishedNpmTag}` },
    { name: 'pnpm', cmd: `pnpm add @devvy-ui/react@${publishedNpmTag}` },
    { name: 'yarn', cmd: `yarn add @devvy-ui/react@${publishedNpmTag}` },
    { name: 'bun', cmd: `bun add @devvy-ui/react@${publishedNpmTag}` },
  ] as const;

  const pkgTabs = pkgManagers.map(({ name, cmd }) => ({
    value: name,
    label: name,
    content: (
      <div className="install-terminal-box">
        <div className="install-terminal-content">
          <span className="install-terminal-prompt" aria-hidden="true">
            $
          </span>
          <code className="install-terminal-code">{cmd}</code>
        </div>
        <CopyButton
          text={cmd}
          size="sm"
          variant="outline"
          aria-label={`Copy ${name} installation command`}
          className="install-terminal-copy-btn"
        >
          Copy
        </CopyButton>
      </div>
    ),
  }));

  const cssSnippet = `// 1. Scoped light/dark design tokens
import "@devvy-ui/tokens/theme.css";

// 2. Component styles (namespaced dvy-* classes)
import "@devvy-ui/styles";

// 3. Optional: DEVVY GLASS frosted material
import "@devvy-ui/styles/glass.css";`;

  const frameworkTabs = [
    {
      value: 'nextjs',
      label: 'Next.js (App Router)',
      content: (
        <div className="framework-guide-content">
          <p>
            Add stylesheet imports to <code>app/layout.tsx</code>. Interactive components retain
            standard React client boundaries (<code>&apos;use client&apos;</code>). Server-side
            rendering is fully supported with stable hydration IDs and zero layout shift.
          </p>
          <div className="install-terminal-box">
            <pre tabIndex={0} role="region" aria-label="Next.js layout snippet">
              <code>{`// app/layout.tsx
import "@devvy-ui/tokens/theme.css";
import "@devvy-ui/styles";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-devvy-theme="system">
      <body>{children}</body>
    </html>
  );
}`}</code>
            </pre>
            <CopyButton
              text={`import "@devvy-ui/tokens/theme.css";\nimport "@devvy-ui/styles";\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en" data-devvy-theme="system">\n      <body>{children}</body>\n    </html>\n  );\n}`}
              size="sm"
              variant="outline"
              aria-label="Copy Next.js setup code"
            >
              Copy
            </CopyButton>
          </div>
        </div>
      ),
    },
    {
      value: 'vite',
      label: 'Vite + React',
      content: (
        <div className="framework-guide-content">
          <p>
            Add stylesheet imports to <code>src/main.tsx</code> or <code>src/App.tsx</code>. ESM
            tree shaking ensures you only bundle the exact components you import into your build.
          </p>
          <div className="install-terminal-box">
            <pre tabIndex={0} role="region" aria-label="Vite setup snippet">
              <code>{`// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import "@devvy-ui/tokens/theme.css";
import "@devvy-ui/styles";
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`}</code>
            </pre>
            <CopyButton
              text={`import "@devvy-ui/tokens/theme.css";\nimport "@devvy-ui/styles";`}
              size="sm"
              variant="outline"
              aria-label="Copy Vite setup code"
            >
              Copy
            </CopyButton>
          </div>
        </div>
      ),
    },
    {
      value: 'cli',
      label: 'Source Ownership (CLI)',
      content: (
        <div className="framework-guide-content">
          <p>
            Want complete source control with zero runtime dependencies? Use the DEVVY UI CLI to
            copy audited canonical implementations directly into your project:
          </p>
          <div className="install-terminal-box">
            <pre tabIndex={0} role="region" aria-label="CLI vendor commands">
              <code>{`npx @devvy-ui/cli init
npx @devvy-ui/cli add button tabs card
npx @devvy-ui/cli doctor`}</code>
            </pre>
            <CopyButton
              text="npx @devvy-ui/cli init && npx @devvy-ui/cli add button tabs card"
              size="sm"
              variant="outline"
              aria-label="Copy CLI vendor command"
            >
              Copy
            </CopyButton>
          </div>
        </div>
      ),
    },
  ];

  const packages = [
    {
      name: '@devvy-ui/react',
      desc: '50 production React components with individual entry points',
      role: 'Core Component Library',
      url: 'https://www.npmjs.com/package/@devvy-ui/react',
    },
    {
      name: '@devvy-ui/tokens',
      desc: 'Scoped light, dark, and system design tokens and custom properties',
      role: 'Design Tokens',
      url: 'https://www.npmjs.com/package/@devvy-ui/tokens',
    },
    {
      name: '@devvy-ui/styles',
      desc: 'Namespaced CSS classes, focus styles, RTL, and optional glass.css',
      role: 'Pure CSS Stylesheets',
      url: 'https://www.npmjs.com/package/@devvy-ui/styles',
    },
    {
      name: '@devvy-ui/core',
      desc: 'DOM-free keyboard navigation, roving index, and state utilities',
      role: 'DOM-Free Logic',
      url: 'https://www.npmjs.com/package/@devvy-ui/core',
    },
  ];

  return (
    <section className="home-install-section" aria-labelledby="install-heading">
      <div className="section-label">
        <div>
          <span className="eyebrow">QUICKSTART</span>
          <h2 id="install-heading">Install DEVVY UI in seconds.</h2>
          <p className="section-subtext">
            Published to the npm registry. Install the React package, import two CSS files, and
            start building considered interfaces.
          </p>
        </div>
        <Badge tone="brand">NPM BETA RELEASE</Badge>
      </div>

      <div className="install-grid">
        <Card className="install-card install-pkg-card">
          <CardHeader>
            <div className="install-card-top">
              <span className="install-step-badge">STEP 1</span>
              <Badge tone="brand">v{publishedNpmVersion}</Badge>
            </div>
            <CardTitle>Choose your package manager</CardTitle>
            <CardDescription>
              Install <code>@devvy-ui/react</code> with peer dependencies React 18 or 19.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs items={pkgTabs} label="Package manager selection" defaultValue="npm" />
          </CardContent>
        </Card>

        <Card className="install-card install-css-card">
          <CardHeader>
            <div className="install-card-top">
              <span className="install-step-badge">STEP 2</span>
              <Badge tone="neutral">Zero-Runtime CSS</Badge>
            </div>
            <CardTitle>Import stylesheets</CardTitle>
            <CardDescription>
              Ordinary CSS custom properties and namespaced classes. Zero styling runtime overhead.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="install-terminal-box">
              <pre tabIndex={0} role="region" aria-label="Required CSS imports">
                <code>{cssSnippet}</code>
              </pre>
              <CopyButton
                text={cssSnippet}
                size="sm"
                variant="outline"
                aria-label="Copy CSS imports"
                className="install-terminal-copy-btn"
              >
                Copy
              </CopyButton>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="framework-integration-box">
        <Card className="framework-card">
          <CardHeader>
            <div className="install-card-top">
              <span className="eyebrow">INTEGRATION GUIDES</span>
              <Badge tone="neutral">Next.js · Vite · CLI</Badge>
            </div>
            <CardTitle>Framework integration</CardTitle>
            <CardDescription>
              Follow simple integration patterns for your stack, or vendor the source directly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              items={frameworkTabs}
              label="Framework integration guides"
              defaultValue="nextjs"
            />
          </CardContent>
        </Card>
      </div>

      <div className="published-packages-section">
        <div className="packages-header">
          <h3>Published npm packages</h3>
          <p className="packages-subtext">
            All packages are published under the <code>@devvy-ui</code> npm scope by DEV STATION.
          </p>
        </div>
        <div className="packages-grid">
          {packages.map((pkg) => (
            <a
              key={pkg.name}
              href={pkg.url}
              target="_blank"
              rel="noreferrer"
              className="package-card-link"
            >
              <Card className="package-card">
                <CardHeader>
                  <div className="package-card-top">
                    <span className="package-role">{pkg.role}</span>
                    <Badge tone="brand">npm ↗</Badge>
                  </div>
                  <CardTitle className="package-name">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.desc}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
