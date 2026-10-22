import Link from 'next/link';
import {
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Separator,
} from '@devvy-ui/react';
import { Workbench } from '../../components/Workbench';
import { ComponentCollection } from '../../components/ComponentCollection';
import { LandingHeroBar } from '../../components/LandingHeroBar';
import { LandingInstall } from '../../components/LandingInstall';
import { LandingShowcase } from '../../components/LandingShowcase';
import { CopyCode } from '../../components/CopyCode';
import { catalog } from '../../lib/catalog';
import { releaseVersion, publishedNpmVersion, publishedNpmTag } from '../../lib/release';

export default function Home() {
  return (
    <>
      <div className="breadcrumb">
        The foundation / <span>Introduction</span>
      </div>

      <section className="home-intro" aria-labelledby="hero-title">
        <div className="release-note">
          <span className="status-dot" aria-hidden="true" />
          <span className="release-note-label">NOW AVAILABLE ON NPM</span>
          <Badge tone="brand">v{releaseVersion}</Badge>
          <Badge tone="neutral">{catalog.length} components</Badge>
          <a
            href="https://www.npmjs.com/package/@devvy-ui/react"
            target="_blank"
            rel="noreferrer"
            className="hero-npm-status-link"
          >
            <Badge tone="brand" className="npm-pill-badge">
              npm: @devvy-ui/react@{publishedNpmTag}
            </Badge>
          </a>
        </div>

        <h1 id="hero-title">
          <span>Small components.</span>
          <span>Complete ownership.</span>
        </h1>

        <p className="intro-copy">
          An independent React library for considered interfaces—now publicly available on npm. 50
          platform-first controls, original charts and navigation, customizable design tokens, and
          source you can make your own. Zero runtime CSS engine.
        </p>

        <LandingHeroBar />

        <div className="hero-actions">
          <Link
            className="dvy-button hero-primary-btn"
            data-variant="solid"
            data-tone="brand"
            data-size="lg"
            href="/ui/getting-started"
          >
            Start building <span aria-hidden="true">→</span>
          </Link>
          <Link
            className="dvy-button hero-secondary-btn"
            data-variant="outline"
            data-tone="neutral"
            data-size="lg"
            href="/ui/components"
          >
            Explore 50 components <span aria-hidden="true">→</span>
          </Link>
          <a
            className="dvy-button hero-ghost-btn"
            data-variant="ghost"
            data-tone="neutral"
            data-size="lg"
            href="https://www.npmjs.com/package/@devvy-ui/react"
            target="_blank"
            rel="noreferrer"
          >
            View on npm ↗
          </a>
          <a
            className="dvy-button hero-ghost-btn"
            data-variant="ghost"
            data-tone="neutral"
            data-size="lg"
            href="https://github.com/Jttacalig/devvy-ui"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>

        <div className="hero-facts">
          <Badge tone="neutral">React 18 + 19</Badge>
          <Badge tone="neutral">50 Components</Badge>
          <Badge tone="neutral">Zero Runtime CSS</Badge>
          <Badge tone="neutral">Platform Controls First</Badge>
          <Badge tone="neutral">Axe-core Verified</Badge>
          <Badge tone="neutral">DEVVY GLASS Material</Badge>
          <Badge tone="neutral">MIT Licensed</Badge>
        </div>
      </section>

      <Separator className="section-divider" />

      <LandingInstall />

      <Separator className="section-divider" />

      <LandingShowcase />

      <Separator className="section-divider" />

      <section className="home-preview-section" aria-labelledby="preview-heading">
        <div className="section-label">
          <div>
            <h2 id="preview-heading">Small parts. Real possibilities.</h2>
            <p className="section-subtext">
              Interact with native state management, tabs, inputs, and responsive layout.
            </p>
          </div>
          <Badge tone="brand">01 / INTERACTIVE WORKBENCH</Badge>
        </div>
        <Workbench />
      </section>

      <Separator className="section-divider" />

      <ComponentCollection />

      <Separator className="section-divider" />

      <section className="home-pillars-section" aria-labelledby="pillars-heading">
        <div className="section-label">
          <div>
            <h2 id="pillars-heading">Built on the basics.</h2>
            <p className="section-subtext">A small library that fits the way you already build.</p>
          </div>
          <Badge tone="neutral">CORE PRINCIPLES</Badge>
        </div>
        <div className="principles principles-cards principles-cards-grid">
          <Card className="principle-card">
            <CardHeader>
              <div className="principle-card-top">
                <span className="principle-number">01</span>
                <Badge tone="brand">Standards</Badge>
              </div>
              <CardTitle>Keep your stack.</CardTitle>
              <CardDescription>
                No styling engine. No CSS framework requirement. Just components and custom
                properties.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Style with standard CSS variables. Themes switch instantly without React re-renders
                or runtime CSS generation penalties.
              </p>
            </CardContent>
          </Card>

          <Card className="principle-card">
            <CardHeader>
              <div className="principle-card-top">
                <span className="principle-number">02</span>
                <Badge tone="brand">Platform</Badge>
              </div>
              <CardTitle>Start with the platform.</CardTitle>
              <CardDescription>
                Native controls, clear semantics, and keyboard behavior designed into the
                foundation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Full keyboard navigation (Arrows, Home, End), accessible names, form integration,
                and automated axe audits with zero violations.
              </p>
            </CardContent>
          </Card>

          <Card className="principle-card">
            <CardHeader>
              <div className="principle-card-top">
                <span className="principle-number">03</span>
                <Badge tone="brand">Ownership</Badge>
              </div>
              <CardTitle>Make it yours.</CardTitle>
              <CardDescription>
                Use the package, or own the source. Adjust a token. Take the whole thing apart.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Install tree-shakable packages from @devvy-ui/react or copy audited component
                implementations directly via the built-in CLI.
              </p>
            </CardContent>
          </Card>

          <Card className="principle-card">
            <CardHeader>
              <div className="principle-card-top">
                <span className="principle-number">04</span>
                <Badge tone="brand">Velocity</Badge>
              </div>
              <CardTitle>50 Production Components.</CardTitle>
              <CardDescription>
                From form controls to SVG charts, breadcrumbs, and floating docks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                A comprehensive component inventory covering inputs, selection, disclosure, dialogs,
                tables, and data visualizations without heavy 3rd-party dependencies.
              </p>
            </CardContent>
          </Card>

          <Card className="principle-card">
            <CardHeader>
              <div className="principle-card-top">
                <span className="principle-number">05</span>
                <Badge tone="brand">Material</Badge>
              </div>
              <CardTitle>Optional DEVVY GLASS.</CardTitle>
              <CardDescription>
                Sophisticated frosted glass aesthetics with built-in accessibility safeguards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Opt-in frosted glass material with automatic fallbacks for reduced-motion,
                reduced-transparency, and Windows High Contrast / Forced Colors mode.
              </p>
            </CardContent>
          </Card>

          <Card className="principle-card">
            <CardHeader>
              <div className="principle-card-top">
                <span className="principle-number">06</span>
                <Badge tone="brand">Assurance</Badge>
              </div>
              <CardTitle>TypeScript & Tested Peers.</CardTitle>
              <CardDescription>
                Strict typing, SSR compatibility, and dual verification in React 18 and 19.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Fully typed prop definitions, exported type declarations, and extensive Playwright
                browser tests across Chromium, Firefox, and WebKit.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="section-divider" />

      <Card className="local-start local-start-card">
        <CardHeader>
          <div className="quickstart-header-top">
            <span className="eyebrow">READY WHEN YOU ARE</span>
            <Badge tone="brand">npm: @devvy-ui/react@{publishedNpmTag}</Badge>
          </div>
          <CardTitle>Your next idea starts here.</CardTitle>
          <CardDescription>
            Install v{publishedNpmVersion} directly from npm, or explore this repository with Node
            22.12+ and pnpm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CopyCode
            label="Quick install command"
            code={`npm install @devvy-ui/react@${publishedNpmTag}`}
          />
        </CardContent>
        <CardFooter className="local-start-footer">
          <Link
            className="dvy-button"
            data-variant="solid"
            data-tone="brand"
            data-size="sm"
            href="/ui/getting-started"
          >
            Getting Started Guide →
          </Link>
          <Link
            className="dvy-button"
            data-variant="ghost"
            data-tone="neutral"
            data-size="sm"
            href="/ui/components"
          >
            50 Component Directory
          </Link>
          <a
            className="dvy-button"
            data-variant="ghost"
            data-tone="neutral"
            data-size="sm"
            href="https://www.npmjs.com/package/@devvy-ui/react"
            target="_blank"
            rel="noreferrer"
          >
            View on npm ↗
          </a>
        </CardFooter>
      </Card>

      <div className="alpha-disclosure-box npm-release-callout">
        <span className="status-dot" aria-hidden="true" />
        <p className="alpha-disclosure">
          <strong>DEVVY UI is now on npm:</strong> <code>@devvy-ui/react@{publishedNpmTag}</code> (v
          {publishedNpmVersion}). Enjoy 50 accessible, tree-shakable components with ordinary CSS
          and optional Glass. Crafted with care by DEV STATION under the MIT license.
        </p>
      </div>
    </>
  );
}
