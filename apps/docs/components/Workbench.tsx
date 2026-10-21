'use client';
import { useState } from 'react';
import { Badge, Button } from '@devvy-ui/react';
import { Showcase } from '../../../examples/vite-react/src/Showcase';
import { CopyCode } from './CopyCode';
export function Workbench() {
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [width, setWidth] = useState<'full' | 'mobile'>('full');
  return (
    <section className="workbench" aria-label="Interactive component example">
      <div className="workbench-toolbar">
        <div className="view-buttons">
          <Button
            size="sm"
            variant="ghost"
            aria-pressed={view === 'preview'}
            onClick={() => setView('preview')}
          >
            Preview
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-pressed={view === 'code'}
            onClick={() => setView('code')}
          >
            Code
          </Button>
        </div>
        <div className="preview-options">
          <Button
            size="sm"
            variant="ghost"
            aria-label="Toggle preview width"
            aria-pressed={width === 'mobile'}
            onClick={() => setWidth(width === 'full' ? 'mobile' : 'full')}
          >
            ↔
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Preview: {theme}
          </Button>
        </div>
      </div>
      {view === 'preview' ? (
        <div className={`preview-canvas preview-${width}`} data-devvy-theme={theme}>
          <Showcase />
        </div>
      ) : (
        <div className="workbench-code">
          <CopyCode
            label="Project form example"
            code={
              'import { Button, Input, Label } from "@devvy-ui/react";\nimport "@devvy-ui/tokens/theme.css";\nimport "@devvy-ui/styles";\n\n<Label htmlFor="project">Project name</Label>\n<Input id="project" defaultValue="Orbit workspace" />\n<Button type="submit">Save changes</Button>'
            }
          />
          <p>Explore each component for its complete source and API.</p>
        </div>
      )}
      <div className="workbench-footer">
        <span>
          <span className="status-dot" /> Real components. Try them.
        </span>
        <Badge>React 19</Badge>
      </div>
    </section>
  );
}
