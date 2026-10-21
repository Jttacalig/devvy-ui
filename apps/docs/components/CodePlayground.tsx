'use client';

import { useEffect, useId, useState } from 'react';
import { Button } from '@devvy-ui/react/button';
import { downloadText } from '../lib/download';

const initialHTML = `<main class="my-workspace" data-devvy-theme="light" data-devvy-material="glass" data-devvy-quality="full">
  <section class="dvy-card custom-card">
    <div class="dvy-card-content">
      <span class="dvy-badge" data-tone="brand">Made by you</span>
      <h1>Your next idea starts here.</h1>
      <p>Change the markup, colors, spacing or material. This is your canvas.</p>
      <label class="dvy-label" for="project">Project name</label>
      <input class="dvy-input" id="project" value="My new workspace" />
      <button class="dvy-button" data-variant="solid" data-tone="brand" data-size="md" type="button">Make it yours</button>
    </div>
  </section>
</main>`;
const initialCSS = `.my-workspace {
  --dvy-brand: #087565;
  --dvy-on-brand: #ffffff;
  --dvy-radius-md: .75rem;
  --dvy-glass-radius: 1.5rem;
  --dvy-glass-blur: 12px;
  --dvy-glass-opacity: .88;
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: radial-gradient(ellipse at top right, #a4dfcc, transparent 70%), #edf3ee;
}
.custom-card { width: min(100%, 25rem); }
.custom-card .dvy-card-content { padding: 2rem; }
.custom-card h1 { font-size: 2rem; line-height: 1.1; letter-spacing: -.05em; margin: 1.25rem 0 1rem; }
.custom-card p { color: var(--dvy-muted); line-height: 1.7; }
.custom-card .dvy-label { display: block; margin-top: 1.5rem; }
.custom-card .dvy-input { margin: .5rem 0 1rem; }
`;

const framePolicy =
  "default-src 'none'; style-src 'unsafe-inline'; img-src data:; form-action 'none'; base-uri 'none';";
function documentFor(html: string, css: string, baseStyles: string, preview: boolean) {
  const styles =
    `${baseStyles}\n* { box-sizing: border-box; } body { margin: 0; font-family: var(--dvy-font); }\n${css}`.replace(
      /<\/style/gi,
      '<\\/style',
    );
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">${preview ? `<meta http-equiv="Content-Security-Policy" content="${framePolicy}">` : ''}<meta name="viewport" content="width=device-width, initial-scale=1"><title>My DEVVY UI design</title><style>${styles}</style></head><body>${html}</body></html>`;
}

export function CodePlayground({ baseStyles, license }: { baseStyles: string; license: string }) {
  const id = useId();
  // Protect the first edit while Next.js hydrates the controlled fields.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [file, setFile] = useState<'css' | 'html'>('css');
  const [css, setCSS] = useState(initialCSS);
  const [html, setHTML] = useState(initialHTML);
  const [preview, setPreview] = useState(() => ({ css: initialCSS, html: initialHTML }));
  const [status, setStatus] = useState('');
  const changed = css !== preview.css || html !== preview.html;
  const licensedStyles = `/*!\n${license}*/\n${baseStyles}`;
  return (
    <section id="code-playground" className="code-playground" aria-labelledby={`${id}-title`}>
      <div className="customize-heading">
        <div>
          <span className="eyebrow">YOUR CODE. YOUR DESIGN.</span>
          <h2 id={`${id}-title`}>Take it beyond the defaults.</h2>
          <p>Edit the CSS and HTML, apply your changes, then take the result into your project.</p>
        </div>
      </div>
      <div className="code-playground-grid">
        <div className="code-playground-editor">
          <div className="editor-heading">
            <div className="editor-files">
              <button
                type="button"
                disabled={!ready}
                aria-pressed={file === 'css'}
                onClick={() => setFile('css')}
              >
                theme.css
              </button>
              <button
                type="button"
                disabled={!ready}
                aria-pressed={file === 'html'}
                onClick={() => setFile('html')}
              >
                index.html
              </button>
            </div>
            <span className="editor-language">{file.toUpperCase()}</span>
          </div>
          <label className="sr-only" htmlFor={`${id}-code`}>
            {file === 'css' ? 'Edit theme CSS' : 'Edit preview HTML'}
          </label>
          <textarea
            id={`${id}-code`}
            key={file}
            aria-describedby={`${id}-help`}
            className="code-input"
            disabled={!ready}
            value={file === 'css' ? css : html}
            onChange={(event) =>
              file === 'css' ? setCSS(event.target.value) : setHTML(event.target.value)
            }
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          <div className="editor-run">
            <span>{changed ? 'Unapplied changes' : 'Preview is up to date'}</span>
            <Button
              size="sm"
              disabled={!ready}
              onClick={() => {
                setPreview({ css, html });
                setStatus('Your changes are now in the preview.');
              }}
            >
              Apply changes
            </Button>
          </div>
        </div>
        <div className="code-playground-preview">
          <div className="editor-heading">
            <span>
              <span className="status-dot" /> Live preview
            </span>
            <span className="editor-language">ISOLATED CANVAS</span>
          </div>
          <iframe
            title="Your customized DEVVY UI preview"
            sandbox=""
            referrerPolicy="no-referrer"
            srcDoc={documentFor(preview.html, preview.css, licensedStyles, true)}
          />
        </div>
      </div>
      <p id={`${id}-help`} className="editor-help">
        Uses real DEVVY styles. HTML and CSS run in an isolated preview; scripts, form submissions
        and external assets are blocked. For React logic, edit and download the TSX source on any
        component page.
      </p>
      <div className="editor-actions">
        <Button
          size="sm"
          disabled={!ready}
          variant="outline"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(css);
              setStatus('Your theme CSS is copied.');
            } catch {
              setStatus('Select the CSS and copy it manually.');
            }
          }}
        >
          Copy theme CSS
        </Button>
        <Button
          size="sm"
          disabled={!ready}
          variant="outline"
          onClick={() => downloadText('devvy-theme.css', css, 'text/css')}
        >
          Download CSS
        </Button>
        <Button
          size="sm"
          disabled={!ready}
          variant="outline"
          onClick={() =>
            downloadText(
              'my-devvy-design.html',
              documentFor(html, css, licensedStyles, false),
              'text/html',
            )
          }
        >
          Download HTML
        </Button>
        <Button
          size="sm"
          disabled={!ready}
          variant="ghost"
          onClick={() => {
            setCSS(initialCSS);
            setHTML(initialHTML);
            setPreview({ css: initialCSS, html: initialHTML });
            setStatus('Starter design restored.');
          }}
        >
          Restore starter
        </Button>
        <span role="status">{status}</span>
      </div>
    </section>
  );
}
