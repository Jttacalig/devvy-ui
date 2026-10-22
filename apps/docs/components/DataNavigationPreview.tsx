'use client';
import { useId, useState } from 'react';
import {
  ChartInspector,
  Navbar,
  Sidebar,
  Breadcrumbs,
  Button,
  Select,
  Badge,
} from '@devvy-ui/react';
import type { ComponentName } from '../lib/catalog';

const activity = [
  { label: 'Mon', value: 24 },
  { label: 'Tue', value: 38 },
  { label: 'Wed', value: 31 },
  { label: 'Thu', value: 56 },
  { label: 'Fri', value: 44 },
  { label: 'Sat', value: 68 },
  { label: 'Sun', value: 61 },
];
const sources = [
  { label: 'Direct', value: 42 },
  { label: 'Search', value: 31 },
  { label: 'Community', value: 18 },
  { label: 'Other', value: 9 },
];
export function ChartPreview() {
  const id = useId();
  const [type, setType] = useState<'bar' | 'line' | 'area' | 'donut'>('area');
  const [period, setPeriod] = useState('7');
  const [curve, setCurve] = useState<'linear' | 'smooth' | 'step'>('smooth');
  const visible = activity.slice(-Number(period));
  const total = (type === 'donut' ? sources : visible).reduce((sum, point) => sum + point.value, 0);
  return (
    <div className="data-preview">
      <div className="data-preview-toolbar" role="group" aria-label="Chart type">
        {(['bar', 'line', 'area', 'donut'] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={type === value}
            onClick={() => setType(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="chart-studio-controls">
        <label htmlFor={id + '-period'}>
          Period
          <Select
            id={id + '-period'}
            aria-label="Chart period"
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            disabled={type === 'donut'}
          >
            <option value="7">Last 7 days</option>
            <option value="3">Last 3 days</option>
          </Select>
        </label>
        <label htmlFor={id + '-curve'}>
          Line style
          <Select
            id={id + '-curve'}
            aria-label="Chart line style"
            value={curve}
            onChange={(event) => setCurve(event.target.value as typeof curve)}
            disabled={type === 'bar' || type === 'donut'}
          >
            <option value="smooth">Smooth</option>
            <option value="linear">Linear</option>
            <option value="step">Step</option>
          </Select>
        </label>
      </div>
      <div className="chart-studio-summary">
        <div>
          <span>Sample workspace activity</span>
          <strong>
            {total.toLocaleString('en-US')}
            <small> events</small>
          </strong>
        </div>
        <Badge tone="neutral">Fictional data</Badge>
      </div>
      <ChartInspector
        title={type === 'donut' ? 'Where visitors arrive from' : 'Activity over time'}
        description="Inspect a point by pointer, touch, or the keyboard slider. Exact values remain in the data table."
        data={type === 'donut' ? sources : visible}
        type={type}
        curve={curve}
        inspectionLabel="Inspect activity"
      />
    </div>
  );
}
export function NavigationPreview({ name }: { name: ComponentName }) {
  const [page, setPage] = useState('Overview');
  const links = ['Overview', 'Projects', 'Activity'];
  const items = links.map((label) => (
    <a
      key={label}
      href={`#preview-${label.toLowerCase()}`}
      aria-current={page === label ? 'page' : undefined}
      onClick={(event) => {
        event.preventDefault();
        setPage(label);
      }}
    >
      {label}
    </a>
  ));
  if (name === 'breadcrumbs')
    return (
      <Breadcrumbs
        items={[
          { label: 'Workspace', href: '/ui' },
          { label: 'Components', href: '/ui/components' },
          { label: 'Breadcrumbs' },
        ]}
      />
    );
  if (name === 'sidebar')
    return (
      <div className="navigation-preview-workspace">
        <Sidebar label="Sample workspace">
          <strong className="dvy-sidebar-heading">ORBIT / WORKSPACE</strong>
          {items}
          <span className="dvy-sidebar-heading">RESOURCES</span>
          <a href="/ui/getting-started">
            Documentation <span aria-hidden="true">↗</span>
          </a>
        </Sidebar>
        <div className="navigation-preview-content" aria-live="polite">
          <span className="eyebrow">YOUR WORKSPACE</span>
          <h3>{page}</h3>
          <p>Native links. A quiet active state. Room for your work.</p>
        </div>
      </div>
    );
  return (
    <div className="navigation-preview-navbar">
      <Navbar
        label="Sample product"
        brand={
          <a href="/ui">
            orbit<span aria-hidden="true"> /</span>
          </a>
        }
        actions={
          <Button variant="outline" size="sm" onClick={() => setPage('Settings')}>
            Settings
          </Button>
        }
      >
        {items}
      </Navbar>
      <p aria-live="polite">{page} · your next idea starts here.</p>
    </div>
  );
}
