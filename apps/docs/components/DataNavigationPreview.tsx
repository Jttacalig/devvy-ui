'use client';
import { useState } from 'react';
import { Chart, Navbar, Sidebar, Breadcrumbs, Button } from '@devvy-ui/react';
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
  const [type, setType] = useState<'bar' | 'line' | 'area' | 'donut'>('bar');
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
      <Chart
        title={type === 'donut' ? 'Where visitors arrive from' : 'A week in your workspace'}
        description="Sample data · built with DEVVY UI"
        data={type === 'donut' ? sources : activity}
        type={type}
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
