'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { Badge, Button, ChartInspector, Input, Label, Textarea } from '@devvy-ui/react';
import { useSiteTheme, type FontChoice } from './SiteTheme';
import { SelectControl } from './SelectControl';
import { LandingCard } from './LandingCard';

export function LandingComponents() {
  const id = useId();
  const [name, setName] = useState('A new perspective');
  const [saved, setSaved] = useState('');
  const { style, setStyle, font, setFont } = useSiteTheme();
  return (
    <div className="landing-component-grid" aria-label="DEVVY component examples">
      <LandingCard
        className="component-note"
        category="Forms"
        title="Capture a new idea."
        description="Familiar controls. Room to make them yours."
        footer={
          <>
            <Button type="submit" form={`${id}-form`}>
              Save an idea <span aria-hidden="true">↗</span>
            </Button>
            <Link href="/ui/components/input" className="component-example-link">
              Input docs <span aria-hidden="true">→</span>
            </Link>
          </>
        }
      >
        <form
          id={`${id}-form`}
          onSubmit={(event) => {
            event.preventDefault();
            setSaved(`Saved “${name}” in this demo.`);
          }}
        >
          <div>
            <Label htmlFor={`${id}-title`}>Project title</Label>
            <Input
              id={`${id}-title`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              maxLength={80}
            />
          </div>
          <div>
            <Label htmlFor={`${id}-note`}>A note to your future self</Label>
            <Textarea
              id={`${id}-note`}
              rows={2}
              placeholder="What would you like to make?"
              maxLength={240}
            />
          </div>
          <p className="component-demo-status" role="status">
            {saved || 'A local demo. Start with the basics, make them yours.'}
          </p>
        </form>
      </LandingCard>
      <LandingCard
        className="component-activity"
        category="Data"
        title="Progress, at a glance."
        description="A sample week, down to the smallest detail."
        footer={
          <Link className="component-example-link" href="/ui/components/chart">
            Explore the charts <span aria-hidden="true">→</span>
          </Link>
        }
      >
        <div className="component-chart-summary">
          <span>
            <strong>202</strong>
            <small>completed tasks · demo</small>
          </span>
          <Badge tone="neutral">7 days</Badge>
        </div>
        <ChartInspector
          className="gallery-chart"
          title="Completed tasks"
          description="Illustrative activity · seven days"
          type="area"
          curve="smooth"
          inspectionLabel="Inspect sample activity"
          data={[
            { label: 'Mon', value: 14 },
            { label: 'Tue', value: 24 },
            { label: 'Wed', value: 20 },
            { label: 'Thu', value: 32 },
            { label: 'Fri', value: 28 },
            { label: 'Sat', value: 38 },
            { label: 'Sun', value: 46 },
          ]}
        />
      </LandingCard>
      <LandingCard
        className="component-signature"
        category="Themes"
        title="Find your signature."
        description="One foundation. A feeling of your own."
        footer={
          <Link className="component-example-link" href="/ui/fonts">
            Explore typography <span aria-hidden="true">→</span>
          </Link>
        }
      >
        <div className="signature-specimen" aria-hidden="true">
          <span>Aa</span>
          <span>
            Same foundation.
            <br />A different feeling.
          </span>
        </div>
        <div className="component-style-buttons" role="group" aria-label="Try a signature style">
          {(['minimal', 'modern', 'glass'] as const).map((value) => (
            <Button
              key={value}
              size="sm"
              variant={style === value ? 'solid' : 'outline'}
              aria-pressed={style === value}
              onClick={() => setStyle(value)}
            >
              {value === 'minimal' ? 'Minimal' : value === 'modern' ? 'Modern' : 'Glass'}
            </Button>
          ))}
        </div>
        <SelectControl
          label="Showcase font"
          value={font}
          onChange={(event) => setFont(event.target.value as FontChoice)}
        >
          <option value="system">System · no download</option>
          <option value="geist">Geist</option>
          <option value="manrope">Manrope</option>
          <option value="geist-mono">Geist Mono</option>
        </SelectControl>
      </LandingCard>
    </div>
  );
}
