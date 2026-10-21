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
import { CopyCode } from '../../components/CopyCode';
import { catalog } from '../../lib/catalog';
import { version } from '../../../../package.json';

export default function Home() {
  return (
    <>
      <div className="breadcrumb">
        The foundation / <span>Introduction</span>
      </div>
      <section className="home-intro" aria-labelledby="hero-title">
        <div className="release-note">
          <span className="status-dot" />
          <span className="release-note-label">THE REACT FOUNDATION</span>
          <Badge tone="brand">v{version}</Badge>
        </div>
        <h1 id="hero-title">
          <span>Small components.</span>
          <span>Complete ownership.</span>
        </h1>
        <p className="intro-copy">
          An independent React library for considered interfaces. Native controls, original charts
          and navigation, ordinary CSS—and source you can make your own.
        </p>
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
            Explore the components <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="hero-facts">
          <Badge tone="neutral">React 18 + 19</Badge>
          <Badge tone="neutral">Zero Runtime CSS</Badge>
          <Badge tone="neutral">Platform Controls First</Badge>
          <Badge tone="neutral">Axe-core Verified</Badge>
          <Badge tone="neutral">MIT Licensed</Badge>
        </div>
      </section>

      <Separator className="section-divider" />

      <section className="home-preview-section" aria-labelledby="preview-heading">
        <div className="section-label">
          <div>
            <h2 id="preview-heading">Small parts. Real possibilities.</h2>
            <p className="section-subtext">
              Interact with native state management, tabs, inputs, and responsive layout.
            </p>
          </div>
          <Badge tone="brand">01 / INTERACTIVE PREVIEW</Badge>
        </div>
        <Workbench />
      </section>

      <Separator className="section-divider" />

      <ComponentCollection />

      <section className="home-pillars-section" aria-labelledby="pillars-heading">
        <div className="section-label">
          <div>
            <h2 id="pillars-heading">Built on the basics.</h2>
            <p className="section-subtext">A small library that fits the way you already build.</p>
          </div>
          <Badge tone="neutral">CORE PRINCIPLES</Badge>
        </div>
        <div className="principles principles-cards">
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
        </div>
      </section>

      <Separator className="section-divider" />

      <Card className="local-start local-start-card">
        <CardHeader>
          <div className="quickstart-header-top">
            <span className="eyebrow">READY WHEN YOU ARE</span>
            <Badge tone="brand">Local Workspace</Badge>
          </div>
          <CardTitle>Your next idea starts here.</CardTitle>
          <CardDescription>
            Explore the unpublished beta from this workspace with Node 22+ and pnpm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CopyCode code={'pnpm install --frozen-lockfile\npnpm build\npnpm dev:docs'} />
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
            Component Directory
          </Link>
        </CardFooter>
      </Card>

      <div className="alpha-disclosure-box">
        <span className="status-dot" />
        <p className="alpha-disclosure">
          An unpublished beta: {catalog.length} components, including charts, navigation and
          optional Glass. More framework adapters and public npm releases are still ahead.
        </p>
      </div>
    </>
  );
}
