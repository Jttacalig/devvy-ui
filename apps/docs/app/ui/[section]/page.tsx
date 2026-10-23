import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Separator } from '@devvy-ui/react';
import { Workbench } from '../../../components/Workbench';
import { CopyCode } from '../../../components/CopyCode';
import { catalog } from '../../../lib/catalog';
import { publishedNpmVersion, releaseLabel } from '../../../lib/release';
import { docsMetadata } from '../../../lib/metadata';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ComponentDirectory } from '../../../components/ComponentDirectory';
import { CodePlayground } from '../../../components/CodePlayground';

const sections = [
  'docs',
  'getting-started',
  'components',
  'themes',
  'playground',
  'changelog',
  'contributing',
];
export function generateStaticParams() {
  return sections.map((section) => ({ section }));
}
export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!sections.includes(section)) notFound();
  const titles: Record<string, string> = {
    docs: 'Documentation',
    'getting-started': 'Getting started',
    components: '100 React components',
    themes: 'Themes and customization',
    playground: 'Interactive playground',
    changelog: 'Release notes',
    contributing: 'Contributing',
  };
  return docsMetadata(
    titles[section],
    `${titles[section]} for DEVVY UI ${releaseLabel}. Explore 100 typed React components, stable installation, customizable themes and source ownership.`,
    `/${section}`,
  );
}
export default async function Section({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!sections.includes(section)) notFound();
  const playgroundFiles =
    section === 'playground'
      ? await Promise.all([
          readFile(resolve(process.cwd(), '../../packages/tokens/src/theme.css'), 'utf8'),
          readFile(resolve(process.cwd(), '../../packages/styles/components.css'), 'utf8'),
          readFile(resolve(process.cwd(), '../../packages/styles/glass.css'), 'utf8'),
          readFile(resolve(process.cwd(), '../../LICENSE'), 'utf8'),
        ])
      : null;
  return (
    <article className={section === 'playground' ? 'article playground-page' : 'article'}>
      <div className="breadcrumb">
        The foundation / <span>{section.split('-').join(' ')}</span>
      </div>
      <p className="docs-release-label">{releaseLabel}</p>
      {section === 'components' ? (
        <>
          <div className="section-intro">
            <span className="eyebrow">CATALOG</span>
            <h1>Small by design.</h1>
            <p className="page-lead">
              {catalog.length} components, including native controls, feedback, charts, navigation
              and Glass. Accessible markup, strict types, and ordinary CSS.
            </p>
          </div>
          <Separator className="section-divider" />
          <ComponentDirectory
            items={catalog.map(({ name, slug, description }) => ({ name, slug, description }))}
          />
        </>
      ) : section === 'playground' ? (
        <>
          <h1>Your code. Your canvas.</h1>
          <p className="page-lead">
            A full-size workspace for your next interface. Edit HTML and CSS and watch the preview
            update as you type. Use DEVVY styles, or make them completely your own.
          </p>
          {playgroundFiles ? (
            <CodePlayground
              baseStyles={playgroundFiles.slice(0, 3).join('\n')}
              license={playgroundFiles[3]}
            />
          ) : null}
          <section className="playground-component-lab" aria-labelledby="component-lab-title">
            <h2 id="component-lab-title">Explore the component behavior.</h2>
            <p>
              Try native form controls, theme switching and keyboard navigation in this React
              example.
            </p>
            <Workbench />
          </section>
          <h2>Keep exploring</h2>
          <p>Each component page has a focused live example, prop reference and complete source.</p>
          <Link href="/ui/components">Browse the component foundation →</Link>
        </>
      ) : section === 'getting-started' ? (
        <>
          <h1>Start with a solid foundation.</h1>
          <p className="page-lead">
            DEVVY UI v{publishedNpmVersion} is published on npm. Install{' '}
            <code>@devvy-ui/react</code> for all {catalog.length} typed components with your
            preferred package manager.
          </p>
          <h2>1. Install the package</h2>
          <p>
            Add the package to an existing React project. React and React DOM (^18.2.0 or ^19.0.0)
            are peer dependencies. Core, styles and tokens are installed transitively.
          </p>
          <CopyCode label="npm installation command" code={'npm install @devvy-ui/react'} />
          <p>Or using pnpm, yarn, or bun:</p>
          <CopyCode
            label="Package manager alternatives"
            code={
              'pnpm add @devvy-ui/react\n# or: yarn add @devvy-ui/react\n# or: bun add @devvy-ui/react'
            }
          />
          <p>
            These commands resolve npm&apos;s <code>latest</code> tag, currently{' '}
            {publishedNpmVersion}. To pin this release, use{' '}
            <code>@devvy-ui/react@{publishedNpmVersion}</code>. The {releaseLabel} source release on
            GitHub also includes optional fonts and table selection; these additions are not
            published on npm yet.
          </p>
          <h2>2. Import stylesheets</h2>
          <p>
            DEVVY UI uses ordinary CSS custom properties and namespaced classes with zero runtime
            overhead. Import the token variables and component styles in your application root:
          </p>
          <CopyCode
            label="CSS and component imports"
            code={
              'import "@devvy-ui/tokens/theme.css";\nimport "@devvy-ui/styles";\n// Optional: import "@devvy-ui/styles/glass.css";\n\nimport { Button, Input, Label } from "@devvy-ui/react";\n\nexport function ContactForm() {\n  return (\n    <form>\n      <Label htmlFor="email">Email</Label>\n      <Input id="email" type="email" required />\n      <Button type="submit">Submit</Button>\n    </form>\n  );\n}'
            }
          />
          <h2>3. Framework integration</h2>
          <h3>Next.js App Router</h3>
          <p>
            Add stylesheet imports at the top of <code>app/layout.tsx</code>. Interactive components
            retain standard React client boundaries (<code>&apos;use client&apos;</code>). Package
            entries preserve client boundaries and stable IDs for server rendering and hydration.
            Keep application event handlers in client components.
          </p>
          <h3>Vite + React</h3>
          <p>
            Add stylesheet imports to <code>src/main.tsx</code> or <code>src/App.tsx</code>. ESM
            tree shaking ensures you only bundle the components you import.
          </p>
          <h2>4. Or own the source code</h2>
          <p>
            Prefer owning the implementation? Use the published scoped CLI in your React project to
            copy canonical components, their dependencies and shared styles:
          </p>
          <CopyCode
            label="Source ownership commands"
            code={
              'npx @devvy-ui/cli init\nnpx @devvy-ui/cli add button tabs card\nnpx @devvy-ui/cli doctor'
            }
          />
          <p>
            Import <code>src/devvy.css</code> in your application entry. The installer copies the
            exact canonical source used by the published package and refuses to overwrite edited
            files.
          </p>
          <h2>Make it your own</h2>
          <p>
            Every component accepts standard native HTML attributes, <code>className</code>, and
            <code>style</code>. Override theme tokens for your brand colors, typography, and
            spacing.
          </p>
          <Link href="/ui/playground#code-playground">Open the live CSS and HTML editor →</Link>
        </>
      ) : section === 'themes' ? (
        <>
          <h1>Your visual language.</h1>
          <p className="page-lead">
            Custom properties keep the styling system small and the decisions in your hands.
          </p>
          <h2>Light, dark or system</h2>
          <CopyCode
            label="Scoped theme example"
            code={
              '<html data-devvy-theme="system">\n\n<section data-devvy-theme="dark">\n  <!-- Scoped theme preview -->\n</section>'
            }
          />
          <h2>Change the essentials</h2>
          <CopyCode
            label="Custom token example"
            code={
              ':root {\n  --dvy-brand: #087565;\n  --dvy-on-brand: #ffffff;\n  --dvy-radius-md: .5rem;\n  --dvy-font: system-ui, sans-serif;\n}'
            }
          />
          <p>
            Override tokens after importing the theme stylesheet. Always check foreground and
            background contrast together.
          </p>
          <h2>Density and typography</h2>
          <CopyCode
            label="Density and typography example"
            code={
              '<section data-devvy-density="compact"\n  data-devvy-typography="mono"\n  data-devvy-contrast="high">\n  <!-- Your components -->\n</section>'
            }
          />
          <p>
            Density accepts compact or comfortable; omit it for the default. Typography supports
            mono or your own font token. High contrast strengthens borders. System forced colors and
            reduced motion have dedicated CSS rules.
          </p>
          <h2>Right-to-left layouts</h2>
          <p>
            Set dir="rtl" on the document or container. Tabs requires its explicit dir="rtl" prop
            for keyboard direction. Logical CSS properties handle spacing and switch travel.
          </p>
          <Workbench />
        </>
      ) : section === 'changelog' ? (
        <>
          <h1>One hundred ways to start.</h1>
          <p className="page-lead">
            {releaseLabel} · 23 October 2026. The GitHub source release improves the landing page,
            search, dropdowns and playground, adds optional fonts and table selection, and extends
            the separate MCP preview. npm <code>latest</code> remains v{publishedNpmVersion}.
          </p>
          <h2>The complete component inventory</h2>
          <p>
            The inventory now includes {catalog.length} implemented components with focused imports,
            typed APIs, source installation and working previews. New overlays, selection controls,
            date and file inputs, data tables, media and application widgets complete the roadmap.
          </p>
          <h2>Native controls and feedback</h2>
          <p>
            Select, Alert, Progress and Skeleton add native form selection, composed messages, task
            progress and reduced-motion loading shapes. A shared component inventory keeps focused
            builds, source installation and documentation checks aligned.
          </p>
          <h2>Charts, navigation and a paper website</h2>
          <p>
            Bar, line, area and donut charts with accessible data tables. Responsive Navbar, Sidebar
            and Breadcrumbs. A warm paper-and-ink website theme, built from DEVVY UI.
          </p>
          <h2>The React foundation</h2>
          <ul>
            <li>
              {catalog.length} React components with individual entry points, including four chart
              views.
            </li>
            <li>Optional DEVVY GLASS material, native Dialog and floating Dock.</li>
            <li>Shared core, namespaced CSS, scoped light/dark/system tokens.</li>
            <li>Next.js documentation, interactive examples and Vite playground.</li>
            <li>Source registry and local init, add and doctor commands.</li>
            <li>Build, type, unit, SSR, hydration, axe and browser verification tools.</li>
          </ul>
          <p>
            Install with <code>npm install @devvy-ui/react</code>. The historical <code>beta</code>
            tag remains at 0.1.0-beta.2. See the repository verification record for checks actually
            run and the remaining manual accessibility and device review.
          </p>
        </>
      ) : section === 'contributing' ? (
        <>
          <h1>Build something that lasts.</h1>
          <p className="page-lead">
            DEVVY UI is an independent MIT project maintained by DEV STATION. Thoughtful, focused
            contributions are welcome.
          </p>
          <h2>Before proposing a change</h2>
          <p>
            Read CONTRIBUTING.md, CODE_OF_CONDUCT.md and GOVERNANCE.md in the source checkout.
            Discuss API changes before implementation. Keep shared logic framework independent.
          </p>
          <h2>Verify your work</h2>
          <CopyCode
            label="Verification commands"
            code={
              'pnpm build\npnpm typecheck\npnpm lint\npnpm test\npnpm check:packages\npnpm test:browser\npnpm bench'
            }
          />
          <h2>Release and recognition</h2>
          <p>
            Add a Changeset for public package changes. Document compatibility and accessibility
            implications. Contributors are credited through release notes and version history. The
            maintainers review release proposals before publication.
          </p>
          <h2>Security</h2>
          <p>
            Read SECURITY.md. Do not include secrets or report exploitable vulnerabilities in public
            issues. Enable private GitHub reporting in the independent public repository.
          </p>
        </>
      ) : (
        <>
          <h1>Build once. Style freely.</h1>
          <p className="page-lead">
            DEVVY UI is a React-first component foundation by DEV STATION. Small parts, native
            behavior and an open design system.
          </p>
          <h2>What ships today</h2>
          <p>
            Core keyboard utilities, charts, route navigation, optional Glass, Dialog and Dock, CSS
            tokens and styles, a generated source registry, and a local installer. The package has
            no runtime styling engine. Tailwind is optional.
          </p>
          <h2>Compatibility with evidence</h2>
          <table>
            <thead>
              <tr>
                <th>Environment</th>
                <th>Tested scope</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>React 18.3 / 19.3</td>
                <td>Installed-package SSR and hydration matrix; React 19 unit suite</td>
              </tr>
              <tr>
                <td>Vite + React</td>
                <td>Production build; shared preview covered by browser tests</td>
              </tr>
              <tr>
                <td>Next.js App Router</td>
                <td>This docs app; production build check</td>
              </tr>
              <tr>
                <td>Modern browsers</td>
                <td>
                  498 cases have passing latest local results across the full run and targeted
                  reruns
                </td>
              </tr>
              <tr>
                <td>React 16/17, Vue, Svelte, Elements</td>
                <td>Future investigation; no adapters shipped</td>
              </tr>
            </tbody>
          </table>
          <h2>Accessibility is a process</h2>
          <p>
            Native controls, visible focus and keyboard patterns are included. Automated axe checks
            supplement a manual procedure in docs/accessibility.md. They are not a certification of
            WCAG conformance.
          </p>
          <h2>Measured, never invented</h2>
          <p>
            The benchmark harness records minified, gzip and Brotli sizes, shared CSS footprint and
            server-render timings. Results depend on versions and environment. Browser interaction
            timings and memory need separate controlled experiments before comparison claims.
          </p>
          <Link className="primary-link" href="/ui/getting-started">
            Get started ↗
          </Link>
        </>
      )}
    </article>
  );
}
