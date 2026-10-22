import Link from 'next/link';
import { Badge, Separator } from '@devvy-ui/react';
import { LandingStudio, LandingDetails } from '../../components/LandingStudio';
import { LandingInstall } from '../../components/LandingInstall';
import { LandingHeroBar } from '../../components/LandingHeroBar';
import { catalog } from '../../lib/catalog';
import { docsMetadata } from '../../lib/metadata';
import {
  docsUrl,
  releaseLabel,
  releaseVersion,
  githubRepoUrl,
  npmPackageUrl,
} from '../../lib/release';

export const metadata = docsMetadata(
  '100 React components. Every detail yours.',
  'DEVVY UI v0.2.0 Stable is released. Build with 100 TypeScript React components, keyboard accessibility, custom themes, optional Glass and source you own.',
);

export default function Home() {
  return (
    <div className="landing-next">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: 'DEVVY UI',
            version: releaseVersion,
            description:
              '100 typed React components with customizable themes and optional DEVVY GLASS.',
            url: docsUrl,
            codeRepository: githubRepoUrl,
            downloadUrl: npmPackageUrl,
            license: 'https://opensource.org/license/mit',
            programmingLanguage: ['TypeScript', 'CSS'],
            author: {
              '@type': 'Organization',
              name: 'DEV STATION',
              url: 'https://www.dev-station.dev',
            },
          }),
        }}
      />
      <section className="landing-intro" aria-labelledby="hero-title">
        <div className="release-note">
          <span className="status-dot" aria-hidden="true" />
          <Link className="release-note-label" href="/ui/changelog">
            OFFICIALLY RELEASED ↗
          </Link>
          <Badge tone="neutral">{releaseLabel}</Badge>
          <Badge tone="neutral">{catalog.length} components</Badge>
        </div>
        <div className="landing-hero-grid">
          <div>
            <h1 id="hero-title">
              Build the interface.
              <br />
              <span>Own every detail.</span>
            </h1>
            <p className="landing-lead">
              100 TypeScript React components, now stable. Keyboard-friendly interactions,
              customizable themes, and source you can shape into something your own.
            </p>
            <div className="hero-actions">
              <Link
                className="dvy-button"
                data-variant="solid"
                data-size="lg"
                href="/ui/getting-started"
              >
                Get started <span aria-hidden="true">↗</span>
              </Link>
              <Link className="landing-text-link" href="/ui/components">
                Explore all {catalog.length} components <span aria-hidden="true">→</span>
              </Link>
            </div>
            <LandingHeroBar />
            <div className="landing-quiet-facts">
              <span>React 18 &amp; 19</span>
              <span>MIT licensed</span>
              <span>Source included</span>
            </div>
            <nav className="landing-resource-links" aria-label="Release resources">
              <Link href="/ui/playground#code-playground">Playground ↗</Link>
              <a href={githubRepoUrl} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href={npmPackageUrl} target="_blank" rel="noreferrer">
                npm ↗
              </a>
            </nav>
          </div>
          <aside className="landing-margin-note">
            <span className="landing-index">01 — 100</span>
            <p>
              A coherent foundation.
              <br />
              An open-ended canvas.
            </p>
            <Link href="/ui/glass">Meet DEVVY GLASS ↗</Link>
            <small>
              Depth when you want it.
              <br />
              Optional, always.
            </small>
          </aside>
        </div>
      </section>
      <section className="landing-workspace-section" aria-labelledby="workspace-heading">
        <div className="landing-section-heading">
          <div>
            <span className="landing-kicker">LESS SETUP. MORE POSSIBILITY.</span>
            <h2 id="workspace-heading">Small pieces. A complete picture.</h2>
          </div>
          <p>
            A working interface, assembled from the same components you get. Go ahead—make yourself
            at home.
          </p>
        </div>
        <LandingStudio />
      </section>
      <section className="landing-foundation-section" aria-labelledby="foundation-heading">
        <div className="landing-section-heading">
          <div>
            <span className="landing-kicker">BUILT TO BE YOURS</span>
            <h2 id="foundation-heading">A foundation, without the friction.</h2>
          </div>
          <p>
            Use a package. Own the source. Bring your existing stack and your own point of view.
          </p>
        </div>
        <LandingDetails />
        <div className="landing-library-index">
          {[
            ['Inputs & forms', 'combobox', 'Familiar controls. Clear validation.'],
            ['Navigation & overlays', 'command-palette', 'Predictable movement and focus.'],
            ['Data & media', 'data-table', 'Give information a useful shape.'],
            ['Application patterns', 'kanban-board', 'Build the workflow you need.'],
          ].map(([title, slug, description]) => (
            <Link key={slug} href={'/ui/components/' + slug}>
              <span>{title}</span>
              <small>{description}</small>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </section>
      <Separator className="landing-rule" />
      <LandingInstall />
      <p className="landing-release-context">
        {releaseLabel} is available on npm. All six packages share version {releaseVersion}, with{' '}
        {catalog.length} React components in the library. Read the{' '}
        <Link href="/ui/changelog">release notes</Link>.
      </p>
      <section className="landing-closing">
        <span className="landing-kicker">YOUR NEXT IDEA IS A GOOD PLACE TO START.</span>
        <h2>
          Make something
          <br />
          <span>only you could make.</span>
        </h2>
        <Link
          className="dvy-button"
          data-variant="solid"
          data-size="lg"
          href="/ui/playground#code-playground"
        >
          Open the playground <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </div>
  );
}
