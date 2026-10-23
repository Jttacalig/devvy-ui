import Link from 'next/link';
import { Badge } from '@devvy-ui/react';
import { FontCollection } from '../../../components/FontCollection';
import { CopyCode } from '../../../components/CopyCode';
import { docsMetadata } from '../../../lib/metadata';

export const metadata = docsMetadata(
  'Font collection',
  'Explore optional self-hosted Geist, Manrope and Geist Mono fonts. Live specimens, variable weights and your own typography with DEVVY UI.',
  '/fonts',
);

export default function FontsPage() {
  return (
    <article className="article">
      <div className="breadcrumb">
        Foundations / <span>Typography</span>
      </div>
      <Badge tone="neutral">v0.3.0 source · optional</Badge>
      <h1>A different voice for your interface.</h1>
      <p className="page-lead">
        Three modern, open-source typefaces. Preview your words, find your weight, and keep complete
        control over how your product feels.
      </p>
      <p>
        These new font entries are available in this checkout and are not included in npm 0.2.0 yet.
        Base DEVVY styles continue to use system fonts. Nothing is fetched from a third-party font
        service at runtime.
      </p>
      <FontCollection />
      <h2>Choose only what you use</h2>
      <p>
        Import one family after the theme tokens, then set its attribute on your theme container.
        The optional <code>@devvy-ui/styles/fonts.css</code> entry declares all three. Browsers
        request a font only when it is used; no preload or JavaScript loader is added.
      </p>
      <h2>Your font, your choice</h2>
      <p>
        You can already use any licensed font with published DEVVY UI 0.2.0. Load it using your
        application’s normal font setup and override the tokens on your theme container:
      </p>
      <CopyCode
        label="Use your own font with DEVVY UI"
        code={
          '.my-app[data-devvy-theme] {\n  --dvy-font: "Your Font", system-ui, sans-serif;\n  --dvy-font-mono: "Your Mono", ui-monospace, monospace;\n}'
        }
      />
      <h2>Coverage and licensing</h2>
      <p>
        The collection contains normal-style variable WOFF2 Latin subsets. Other scripts and italic
        text use the fallback stack. Geist and Geist Mono are by the Geist Project Authors; Manrope
        is by the Manrope Project Authors. The fonts retain their SIL Open Font License 1.1 and
        included copyright notices independently of DEVVY UI’s MIT code. Keep those notices when
        copying assets.
      </p>
      <p>
        The <Link href="/ui/playground">HTML/CSS playground</Link> deliberately blocks external
        assets, including font files, inside its isolated preview. Test bundled fonts here or in
        your application. Changing the site font does not silently change your exported design.
      </p>
      <p>
        <Link href="/ui/themes">Continue to colors, density and theme tokens →</Link>
      </p>
    </article>
  );
}
