import Link from 'next/link';
import { Badge, Separator } from '@devvy-ui/react';
import { LandingDetails } from '../../components/LandingStudio';
import { LandingExamples } from '../../components/LandingExamples';
import { LandingInstall } from '../../components/LandingInstall';
import { LandingHeroBar } from '../../components/LandingHeroBar';
import { SupportWidget } from '../../components/SupportWidget';
import { catalog } from '../../lib/catalog';
import { docsMetadata } from '../../lib/metadata';
import { docsUrl, githubRepoUrl, npmPackageUrl } from '../../lib/release';
import { getPublishedRelease } from '../../lib/published-release';
import { supportUrl } from '../../lib/support';

export async function generateMetadata() {
  const { label } = await getPublishedRelease();
  return docsMetadata(
    '100 React components. Every detail yours.',
    `DEVVY UI ${label}: 100 TypeScript React components, keyboard accessibility, custom themes, optional Glass and source you own.`,
    '',
    label,
  );
}

export default async function Home() {
  const { version: releaseVersion, label: releaseLabel } = await getPublishedRelease();
  return (
    <div className="landing-next">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            '@id': `${docsUrl}#library`,
            name: 'DEVVY UI',
            version: releaseVersion,
            description:
              '100 typed React components with customizable themes and optional DEVVY GLASS.',
            url: docsUrl,
            codeRepository: githubRepoUrl,
            downloadUrl: npmPackageUrl,
            license: 'https://opensource.org/license/mit',
            programmingLanguage: ['TypeScript', 'CSS'],
            runtimePlatform: 'React 18.2+ or React 19',
            isAccessibleForFree: true,
            mainEntityOfPage: docsUrl,
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
          <div className="landing-hero-main">
            <h1 id="hero-title">
              Build the interface. <span>Make it your own.</span>
            </h1>
            <p className="landing-lead">
              100 TypeScript React components. Thoughtful defaults, native behavior, and source you
              own. Build a product that feels like you.
            </p>
            <div className="hero-actions">
              <Link
                className="dvy-button hero-primary-btn"
                data-variant="solid"
                data-tone="brand"
                data-size="lg"
                href="/ui/getting-started"
              >
                Get started <span aria-hidden="true">↗</span>
              </Link>
              <Link
                className="dvy-button"
                data-variant="outline"
                data-size="lg"
                href="/ui/components"
              >
                Explore all {catalog.length} components <span aria-hidden="true">→</span>
              </Link>
            </div>
            <LandingHeroBar version={releaseVersion} />
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
        </div>
      </section>
      <section className="landing-workspace-section" aria-labelledby="workspace-heading">
        <div className="landing-section-heading">
          <div>
            <h2 id="workspace-heading">The components. In their element.</h2>
          </div>
          <p>Real components you can try, adapt, and take with you.</p>
        </div>
        <LandingExamples />
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
      <LandingInstall version={releaseVersion} />
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
      <section className="dvy-support-section" aria-labelledby="support-heading" id="support">
        <div>
          <span className="landing-kicker">INDEPENDENTLY BUILT. OPEN TO EVERYONE.</span>
          <h2 id="support-heading">Help keep good tools open.</h2>
          <p>
            DEVVY UI is free and open source. If it helps you build, a coffee supports the time
            behind the components, documentation, and everything that comes next.
          </p>
        </div>
        <div className="dvy-support-actions">
          <a
            className="dvy-button"
            data-variant="solid"
            data-tone="brand"
            data-size="lg"
            href={supportUrl}
            target="_blank"
            rel="noreferrer"
          >
            Buy me a coffee <span aria-hidden="true">↗</span>
          </a>
          <small>Always optional. Always appreciated.</small>
        </div>
      </section>
      <SupportWidget />
    </div>
  );
}
