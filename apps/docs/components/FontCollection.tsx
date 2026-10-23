'use client';

import { useEffect, useId, useState } from 'react';
import { Badge, Button, Card, CardContent, Input, Slider } from '@devvy-ui/react';
import { CopyCode } from './CopyCode';
import { useSiteTheme } from './SiteTheme';

const fonts = [
  {
    id: 'geist',
    name: 'Geist',
    description: 'Precise, quiet and versatile. A natural fit for product interfaces.',
    weight: '100–900',
    size: '28.7 KiB',
    source: 'geist',
  },
  {
    id: 'manrope',
    name: 'Manrope',
    description: 'Open, geometric forms with a warmer editorial character.',
    weight: '200–800',
    size: '24.3 KiB',
    source: 'manrope',
  },
  {
    id: 'geist-mono',
    name: 'Geist Mono',
    description: 'Aligned characters for code, dashboards and technical details.',
    weight: '100–900',
    size: '22.6 KiB',
    source: 'geistmono',
  },
] as const;

export function FontCollection() {
  const id = useId();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [text, setText] = useState('Make something yours.');
  const [weight, setWeight] = useState(400);
  const { font, setFont } = useSiteTheme();
  return (
    <section
      aria-label="Interactive font collection"
      aria-busy={!ready}
      className="font-collection"
    >
      <div className="font-controls">
        <label htmlFor={`${id}-sample`}>
          Your preview text
          <Input
            id={`${id}-sample`}
            value={text}
            maxLength={160}
            disabled={!ready}
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <label htmlFor={`${id}-weight`}>
          Weight · {weight}
          <Slider
            label={`Weight · ${weight}`}
            id={`${id}-weight`}
            min={200}
            max={800}
            step={100}
            disabled={!ready}
            value={weight}
            onChange={(event) => setWeight(Number(event.target.value))}
          />
        </label>
      </div>
      {fonts.map((item) => (
        <Card key={item.id} className="font-specimen">
          <CardContent>
            <div className="font-specimen-heading">
              <div>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
              </div>
              <Badge tone="neutral">Variable · {item.weight}</Badge>
            </div>
            <p className="font-sample" data-devvy-font={item.id} style={{ fontWeight: weight }}>
              {text || 'Make something yours.'}
            </p>
            <p className="font-alphabet" data-devvy-font={item.id}>
              Aa Bb Cc Dd Ee Ff Gg · 0123456789
            </p>
            <div className="font-specimen-actions">
              <Button
                variant={font === item.id ? 'solid' : 'outline'}
                size="sm"
                aria-pressed={font === item.id}
                disabled={!ready}
                onClick={() => setFont(item.id)}
              >
                {font === item.id ? `Using ${item.name}` : `Try ${item.name} on this site`}
              </Button>
              <span>{item.size} · Latin · SIL OFL 1.1</span>
              <a href={`https://github.com/google/fonts/tree/main/ofl/${item.source}`}>
                Source & license ↗
              </a>
            </div>
            <CopyCode
              label={`Import ${item.name} (unreleased workspace entry)`}
              code={`import '@devvy-ui/styles/fonts/${item.id}.css';\n\n// Apply to the same container as your theme:\n<div data-devvy-theme="light" data-devvy-font="${item.id}">\n  {/* Your DEVVY UI components */}\n</div>`}
            />
          </CardContent>
        </Card>
      ))}
      <Button variant="ghost" disabled={!ready} onClick={() => setFont('system')}>
        Restore system font
      </Button>
    </section>
  );
}
