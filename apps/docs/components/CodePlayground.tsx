'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import { Button } from '@devvy-ui/react/button';
import { ResizablePanels } from '@devvy-ui/react/resizable-panels';
import { Switch } from '@devvy-ui/react/switch';
import { SelectControl } from './SelectControl';
import { downloadText } from '../lib/download';
import Link from 'next/link';

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
  const [automatic, setAutomatic] = useState(true);
  const [viewport, setViewport] = useState('responsive');
  const [view, setView] = useState('split');
  const changed = css !== preview.css || html !== preview.html;
  const licensedStyles = useMemo(() => `/*!\n${license}*/\n${baseStyles}`, [baseStyles, license]);
  const previewDocument = useMemo(
    () => documentFor(preview.html, preview.css, licensedStyles, true),
    [preview.html, preview.css, licensedStyles],
  );
  useEffect(() => {
    if (!ready || !automatic || !changed) return;
    const timer = window.setTimeout(() => setPreview({ css, html }), 350);
    return () => window.clearTimeout(timer);
  }, [ready, automatic, changed, css, html]);
  return (
    <section
      id="code-playground"
      className="code-playground"
      data-panel-view={view}
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`} className="sr-only">
        Code editor and live preview
      </h2>
      <div className="playground-toolbar">
        <div className="playground-view-controls" role="group" aria-label="Workspace layout">
          {['editor', 'split', 'preview'].map((mode) => (
            <Button
              key={mode}
              size="sm"
              variant="ghost"
              disabled={!ready}
              aria-pressed={view === mode}
              onClick={() => setView(mode)}
            >
              {mode === 'editor' ? 'Code' : mode === 'split' ? 'Split view' : 'Preview'}
            </Button>
          ))}
        </div>
        <label className="playground-auto" htmlFor={`${id}-auto`}>
          <Switch
            id={`${id}-auto`}
            disabled={!ready}
            checked={automatic}
            onChange={(event) => setAutomatic(event.target.checked)}
          />
          Auto preview
        </label>
        <div className="playground-size">
          <SelectControl
            label="Preview size"
            layout="inline"
            id={`${id}-size`}
            controlSize="sm"
            disabled={!ready}
            value={viewport}
            onChange={(event) => setViewport(event.target.value)}
          >
            <option value="responsive">Fit canvas</option>
            <option value="tablet">Tablet · 768px</option>
            <option value="mobile">Mobile · 375px</option>
          </SelectControl>
        </div>
      </div>
      <ResizablePanels
        className="code-playground-grid"
        label="Resize code and preview"
        defaultValue={50}
        min={25}
        max={75}
      >
        {[
          <div key="editor" className="code-playground-editor">
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
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                  event.preventDefault();
                  setPreview({ css, html });
                  setStatus('Your changes are now in the preview.');
                }
              }}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
            />
            <div className="editor-run">
              <span>
                {changed
                  ? automatic
                    ? 'Updating preview…'
                    : 'Unapplied changes'
                  : 'Preview is up to date'}
              </span>
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
          </div>,
          <div key="preview" className="code-playground-preview" data-viewport={viewport}>
            <div className="editor-heading">
              <span>
                <span className="status-dot" /> Live preview
              </span>
              <span className="editor-language">ISOLATED CANVAS</span>
            </div>
            <div className="playground-viewport">
              <iframe
                title="Your customized DEVVY UI preview"
                sandbox=""
                referrerPolicy="no-referrer"
                srcDoc={previewDocument}
              />
            </div>
          </div>,
        ]}
      </ResizablePanels>
      <p id={`${id}-help`} className="editor-help">
        Uses real DEVVY styles. HTML and CSS run in an isolated preview; scripts, form submissions
        and external assets are blocked. For React logic, edit and download the TSX source on any
        component page. Auto preview waits briefly after typing; pause it for larger edits, or use
        Ctrl/⌘ + Enter to apply immediately. Drag the divider or use its arrow keys to resize. For
        self-hosted typefaces, explore the <Link href="/ui/fonts">font collection</Link>.
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
