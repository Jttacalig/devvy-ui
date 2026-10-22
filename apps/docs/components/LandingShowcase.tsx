'use client';

import { useState } from 'react';
import inventory from '../../../packages/react/components.json';
const componentCount = inventory.length;
import {
  Tabs,
  Button,
  Input,
  Label,
  SearchField,
  Select,
  Switch,
  Checkbox,
  Slider,
  SegmentedControl,
  Alert,
  StatusIndicator,
  Badge,
  Progress,
  CircularProgress,
  Spinner,
  Skeleton,
  Meter,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Avatar,
  AvatarGroup,
  Accordion,
  DescriptionList,
  Glass,
} from '@devvy-ui/react';

export function LandingShowcase() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [sliderVal, setSliderVal] = useState(65);
  const [selectedSegment, setSelectedSegment] = useState('react');
  const [searchQuery, setSearchQuery] = useState('');
  const [glassQuality, setGlassQuality] = useState<'auto' | 'reduced'>('auto');

  const showcaseTabs = [
    {
      value: 'forms',
      label: 'Forms & Controls',
      content: (
        <div className="showcase-panel showcase-forms-grid">
          <div className="showcase-group">
            <span className="showcase-group-title">Buttons & Actions</span>
            <div className="showcase-row">
              <Button variant="solid" tone="brand">
                Solid Brand
              </Button>
              <Button variant="outline" tone="neutral">
                Outline
              </Button>
              <Button variant="ghost" tone="neutral">
                Ghost
              </Button>
              <Button
                variant="solid"
                tone="brand"
                loading={btnLoading}
                onClick={() => {
                  setBtnLoading(true);
                  setTimeout(() => setBtnLoading(false), 1500);
                }}
              >
                {btnLoading ? 'Saving…' : 'Click to Load'}
              </Button>
            </div>
          </div>

          <div className="showcase-group">
            <span className="showcase-group-title">Text & Search Fields</span>
            <div className="showcase-stack">
              <div>
                <Label htmlFor="showcase-email">Email address</Label>
                <Input
                  id="showcase-email"
                  type="email"
                  placeholder="name@domain.com"
                  defaultValue="developer@dev-station.dev"
                />
              </div>
              <div>
                <Label htmlFor="showcase-search">Search components</Label>
                <SearchField
                  id="showcase-search"
                  label={'Filter ' + componentCount + ' components'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={'Filter ' + componentCount + ' components…'}
                />
              </div>
            </div>
          </div>

          <div className="showcase-group">
            <span className="showcase-group-title">Selection & Sliders</span>
            <div className="showcase-stack">
              <div>
                <Label htmlFor="showcase-select">Framework target</Label>
                <Select id="showcase-select" defaultValue="nextjs">
                  <option value="nextjs">Next.js App Router</option>
                  <option value="vite">Vite + React</option>
                  <option value="remix">Remix / React Router</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="showcase-slider">Intensity ({sliderVal}%)</Label>
                <Slider
                  id="showcase-slider"
                  label="Component intensity percentage"
                  min={0}
                  max={100}
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="showcase-group">
            <span className="showcase-group-title">Toggles & Segmented Controls</span>
            <div className="showcase-stack">
              <div className="showcase-row" style={{ alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Switch
                    id="showcase-switch"
                    checked={switchChecked}
                    onChange={(e) => setSwitchChecked(e.target.checked)}
                  />
                  <Label htmlFor="showcase-switch">Notifications</Label>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Checkbox
                    id="showcase-check"
                    checked={checkboxChecked}
                    onChange={(e) => setCheckboxChecked(e.target.checked)}
                  />
                  <Label htmlFor="showcase-check">TypeScript Strict</Label>
                </div>
              </div>
              <div>
                <SegmentedControl
                  name="showcase-segment"
                  label="Framework stack choice"
                  value={selectedSegment}
                  onValueChange={setSelectedSegment}
                  items={[
                    { value: 'react', label: 'React 19' },
                    { value: 'next', label: 'Next.js' },
                    { value: 'vite', label: 'Vite' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: 'feedback',
      label: 'Feedback & Indicators',
      content: (
        <div className="showcase-panel showcase-feedback-grid">
          <div className="showcase-group">
            <span className="showcase-group-title">Status Alerts</span>
            <div className="showcase-stack">
              <Alert tone="brand">
                A published beta is available on npm. This checkout contains {componentCount}{' '}
                components with focused imports.
              </Alert>
              <Alert tone="neutral">
                Ordinary CSS avoids runtime style injection. Measure the entries you ship in your
                own application.
              </Alert>
            </div>
          </div>

          <div className="showcase-group">
            <span className="showcase-group-title">Progress & Circular Meters</span>
            <div className="showcase-stack">
              <div>
                <span className="showcase-sublabel">Linear task progress (75%)</span>
                <Progress value={75} max={100} label="Task completion" />
              </div>
              <div className="showcase-row" style={{ alignItems: 'center', gap: '1.5rem' }}>
                <CircularProgress value={68} max={100} label="Verification status" />
                <Spinner label="Loading packages" />
                <Meter value={82} min={0} max={100} label="Test coverage" />
              </div>
            </div>
          </div>

          <div className="showcase-group">
            <span className="showcase-group-title">Badges & Status Indicators</span>
            <div className="showcase-row">
              <Badge tone="brand">Brand Badge</Badge>
              <Badge tone="neutral">Neutral Badge</Badge>
              <Badge tone="danger">Danger Badge</Badge>
              <StatusIndicator label="Ready on npm" tone="brand" />
              <StatusIndicator label="Axe Verified" tone="neutral" />
            </div>
          </div>

          <div className="showcase-group">
            <span className="showcase-group-title">Skeleton Loading</span>
            <div className="showcase-stack">
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rect" height={36} />
            </div>
          </div>
        </div>
      ),
    },
    {
      value: 'layout',
      label: 'Layout & Structure',
      content: (
        <div className="showcase-panel showcase-layout-grid">
          <div className="showcase-group">
            <span className="showcase-group-title">Team & Avatars</span>
            <div className="showcase-row" style={{ alignItems: 'center' }}>
              <AvatarGroup label="GitHub team members" max={4}>
                <Avatar name="Alex Rivera" />
                <Avatar name="Taylor Chen" />
                <Avatar name="Jordan Smith" />
                <Avatar name="Dev Station" />
              </AvatarGroup>
              <span className="showcase-sublabel">Collaborators on GitHub</span>
            </div>
          </div>

          <div className="showcase-group">
            <span className="showcase-group-title">Accordion Disclosure</span>
            <Accordion
              items={[
                {
                  value: 'tokens',
                  title: 'How do design tokens work?',
                  content:
                    'Tokens are CSS custom properties (--dvy-*) scoped to light, dark, and system themes. Overriding a token changes your application style instantly without React re-renders.',
                },
                {
                  value: 'a11y',
                  title: 'What accessibility checks are included?',
                  content:
                    'Every component is verified using automated Axe-core test suites across light and dark themes with zero violations, full keyboard navigation, and native semantic markup.',
                },
              ]}
            />
          </div>

          <div className="showcase-group">
            <span className="showcase-group-title">Description List</span>
            <DescriptionList
              items={[
                { term: 'License', description: 'MIT Open Source' },
                { term: 'Runtime Overhead', description: 'Zero CSS-in-JS injection' },
                { term: 'Component Count', description: '50 verified implementations' },
              ]}
            />
          </div>
        </div>
      ),
    },
    {
      value: 'glass',
      label: 'DEVVY GLASS',
      content: (
        <div className="showcase-panel showcase-glass-preview">
          <div className="glass-showcase-controls">
            <SegmentedControl
              name="glass-quality-select"
              label="Glass material quality"
              value={glassQuality}
              onValueChange={(val) => setGlassQuality(val as 'auto' | 'reduced')}
              items={[
                { value: 'auto', label: 'Auto (Blur & Frost)' },
                { value: 'reduced', label: 'Reduced (Opaque Fallback)' },
              ]}
            />
          </div>
          <div className="glass-showcase-canvas">
            <Glass quality={glassQuality} className="glass-showcase-card">
              <Card>
                <CardHeader>
                  <div className="glass-card-header-top">
                    <Badge tone="brand">DEVVY GLASS</Badge>
                    <span className="glass-card-status">Optional Material</span>
                  </div>
                  <CardTitle>Depth without the penalty.</CardTitle>
                  <CardDescription>
                    Soft frost, adaptive lighting, and zero external dependencies. Respects
                    reduced-motion and forced-colors automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="glass-card-inner-actions">
                    <Button variant="solid" tone="brand" size="sm">
                      Experience Glass
                    </Button>
                    <a
                      href="/ui/glass"
                      className="dvy-button"
                      data-variant="outline"
                      data-tone="neutral"
                      data-size="sm"
                    >
                      Open Glass Lab →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </Glass>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="home-showcase-section" aria-labelledby="showcase-heading">
      <div className="section-label">
        <div>
          <span className="eyebrow">LIVE COMPONENT EXPLORER</span>
          <h2 id="showcase-heading">{componentCount} components. Ready to shape.</h2>
          <p className="section-subtext">
            Test real interactive components below. Platform controls, rich feedback, layout
            primitives, and optional Glass—all powered by DEVVY UI.
          </p>
        </div>
        <Badge tone="neutral">{componentCount} CANONICAL COMPONENTS</Badge>
      </div>

      <Card className="showcase-card">
        <Tabs items={showcaseTabs} label="Component showcase tabs" defaultValue="forms" />
      </Card>
    </section>
  );
}
