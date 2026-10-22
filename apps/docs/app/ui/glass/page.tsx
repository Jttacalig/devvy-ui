import type { Metadata } from 'next';
import { GlassPreview } from '../../../components/GlassPreview';
import { CopyCode } from '../../../components/CopyCode';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'DEVVY GLASS',
  description:
    'An optional liquid glass material for DEVVY UI. Adaptive frost, quiet lighting and native interactions.',
};
export default function Page() {
  return (
    <article className="glass-page">
      <div className="breadcrumb">
        Design system / <span>DEVVY GLASS</span>
      </div>
      <header className="glass-page-intro">
        <div className="glass-edition">
          <span className="glass-material-tag">
            <span className="status-dot" /> DEVVY GLASS
          </span>
          <span>THE MATERIAL COLLECTION / 01</span>
        </div>
        <h1>
          Clarity.
          <br />
          With a little <em>depth.</em>
        </h1>
        <div className="glass-intro-bottom">
          <p>
            An expressive glass layer for DEVVY UI. Soft frost, considered light, and familiar
            interactions. Your components, seen a little differently.
          </p>
          <a className="glass-guide-link" href="#glass-api">
            Use the theme <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="glass-intro-meta">
          <span>Optional by design</span>
          <span>CSS first</span>
          <span>Built to adapt</span>
        </div>
        <Link className="glass-customize-link" href="/ui/playground#code-playground">
          Want to go further? Customize the code <span aria-hidden="true">→</span>
        </Link>
      </header>
      <div className="section-label">
        <h2>Find your atmosphere.</h2>
        <span>LIVE MATERIAL LAB / 01</span>
      </div>
      <GlassPreview />
      <div className="glass-principles">
        <section>
          <span>01 / MATERIAL</span>
          <h2>Light, without the weight.</h2>
          <p>
            Bounded backdrop blur and a quiet specular edge. No canvas, refraction shader, or
            animation library. Frost stays still while opacity and transforms handle feedback.
          </p>
        </section>
        <section>
          <span>02 / ADAPTATION</span>
          <h2>Beauty that knows its limits.</h2>
          <p>
            Automatic mode starts opaque, then reads browser and device hints. Low-resource signals
            select solid surfaces. Reduced transparency and high-contrast preferences always take
            priority.
          </p>
        </section>
        <section>
          <span>03 / OWNERSHIP</span>
          <h2>Still unmistakably yours.</h2>
          <p>
            A material for your existing Button and Card. Adjust frost, surface opacity, lighting,
            radius and palette with custom properties. The ordinary DEVVY theme stays available.
          </p>
        </section>
      </div>
      <section id="glass-api" className="glass-doc-section">
        <span className="eyebrow">MAKE IT PART OF YOUR SYSTEM</span>
        <h2>One optional import.</h2>
        <p>
          Import the glass layer after the base styles. Scope it around the part of your interface
          that needs depth. DEVVY UI is published on npm as <code>@devvy-ui/react@beta</code>; these
          imports work across Next.js, Vite, and standard React applications.
        </p>
        <CopyCode
          label="Glass setup and usage"
          code={
            'import "@devvy-ui/tokens/theme.css";\nimport "@devvy-ui/styles";\nimport "@devvy-ui/styles/glass.css";\nimport { Glass, Card, CardContent, Button } from "@devvy-ui/react";\n\n<Glass theme="dark" quality="auto">\n  <Card>\n    <CardContent>\n      <h2>A little room for your idea.</h2>\n      <Button variant="outline">Start building</Button>\n    </CardContent>\n  </Card>\n</Glass>'
          }
        />
        <h3>Set your own material.</h3>
        <CopyCode
          label="Glass customization tokens"
          code={
            '.my-material {\n  --dvy-glass-blur: 12px;\n  --dvy-glass-opacity: .9;\n  --dvy-glass-saturation: 1.15;\n  --dvy-glass-light-angle: 135deg;\n  --dvy-glass-radius: 1.25rem;\n}\n\n/* Apply className="my-material" to Glass. */'
          }
        />
        <h3>Glass scope API</h3>
        <div className="table-scroll" role="region" aria-label="Glass scope API" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Default</th>
                <th>Behavior</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>enabled</td>
                <td>true</td>
                <td>Disable the material without unmounting children.</td>
              </tr>
              <tr>
                <td>theme</td>
                <td>inherited</td>
                <td>light, dark or system; works with scoped theme tokens.</td>
              </tr>
              <tr>
                <td>quality</td>
                <td>auto</td>
                <td>auto, full or reduced. Full cannot override CSS accessibility preferences.</td>
              </tr>
              <tr>
                <td>className / style / ref</td>
                <td>native</td>
                <td>Customize a regular div with CSS and custom properties.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3>Reusable dialogs and docks</h3>
        <p>
          Dialog and Dock are theme-independent React primitives. They work with the ordinary theme;
          the glass scope supplies their material.
        </p>
        <CopyCode
          label="Controlled dialog example"
          code={
            'const [open, setOpen] = useState(false);\nconst trigger = useRef<HTMLButtonElement>(null);\n\n<Button ref={trigger} onClick={() => setOpen(true)}>Settings</Button>\n<Glass theme="dark">\n  <Dialog open={open} onOpenChange={setOpen}\n    returnFocusRef={trigger}\n    title="Workspace settings"\n    description="Make this space your own.">\n    <Button onClick={() => setOpen(false)}>Done</Button>\n  </Dialog>\n</Glass>'
          }
        />
        <p>
          Dialog requires open, onOpenChange and title. Optional description labels supporting text,
          initialFocusRef chooses the initial focus target, and closeLabel localizes the close
          button. Set returnFocusRef to the opening button so pointer activation also restores focus
          in Safari. Keep modal interactions inside the dialog and use the controlled callback for
          form actions.
        </p>
        <CopyCode
          label="Dock navigation example"
          code={
            '<Dock label="Workspace navigation">\n  <a href="/workspace" aria-current="page">Workspace</a>\n  <a href="/activity">Activity</a>\n  <a href="/library">Library</a>\n</Dock>\n\n// Add floating for a viewport dock. Reserve space in your layout\n// so the dock never covers content or keyboard focus.'
          }
        />
      </section>
      <section id="glass-a11y" className="glass-doc-section">
        <h2>Designed to adapt. Built to include.</h2>
        <ul>
          <li>
            Native buttons, named navigation and a real HTML dialog. The browser manages modal
            focus, inert background, Escape and focus return.
          </li>
          <li>
            Systems without backdrop-filter receive opaque surfaces. The React wrapper also reduces
            effects for save-data, four or fewer reported CPU threads, or four or fewer reported GB
            of memory.
          </li>
          <li>
            Device hints are conservative signals, not a measured GPU capability score. Use reduced
            mode explicitly where appropriate. CSS-only consumers can set
            data-devvy-quality="reduced".
          </li>
          <li>
            Reduced-transparency and higher-contrast media preferences remove blur. Reduced motion
            removes entrance and hover motion. Forced colors restore system surfaces and borders.
          </li>
          <li>
            Transparency is not a substitute for contrast. Keep text on a sufficiently opaque
            surface and test your own colors, images and token overrides.
          </li>
        </ul>
        <h3>Compatibility, honestly.</h3>
        <p>
          React 18/19 use the same adapter; the material itself is plain CSS and needs no React.
          Native modal behavior requires HTMLDialogElement.showModal support. An older browser
          without it receives an explicitly nonmodal inline panel. It does not receive an imitation
          focus trap. Unsupported CSS degrades to solid DEVVY surfaces.
        </p>
        <p>
          Vue, Svelte and Web Components adapters are still future work. Their markup can use the
          same CSS, but this release does not claim tested framework integrations. See docs/glass.md
          for the complete fallback, testing and deployment policy.
        </p>
        <p>
          DEVVY GLASS is an original material study by DEV STATION. It uses platform glass
          conventions while keeping DEVVY’s typography, palette and component language. No
          proprietary Apple artwork, shaders or component assets are used.
        </p>
      </section>
    </article>
  );
}
