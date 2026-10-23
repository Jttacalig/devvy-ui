'use client';
import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  Input,
} from '@devvy-ui/react';
import { SelectControl } from './SelectControl';

const families: Record<string, readonly string[]> = {
  'Layout and identity': [
    'avatar',
    'avatar-group',
    'aspect-ratio',
    'container',
    'stack',
    'grid',
    'typography',
    'card',
    'separator',
    'glass',
  ],
  'Forms and selection': [
    'button',
    'icon-button',
    'input',
    'textarea',
    'label',
    'checkbox',
    'switch',
    'select',
    'radio-group',
    'slider',
    'form',
    'form-field',
    'fieldset',
    'number-input',
    'password-input',
    'search-field',
    'segmented-control',
    'color-picker',
    'combobox',
    'autocomplete',
    'multi-select',
    'range-slider',
    'otp-input',
    'rating',
    'tag-input',
    'toggle-group',
    'file-upload',
    'dropzone',
    'calendar',
    'date-picker',
    'date-range-picker',
    'time-picker',
    'mentions-input',
  ],
  Navigation: [
    'navbar',
    'sidebar',
    'breadcrumbs',
    'dock',
    'tabs',
    'accordion',
    'collapsible',
    'pagination',
    'stepper',
    'menubar',
    'navigation-menu',
    'tree-view',
    'table-of-contents',
    'scroll-area',
    'resizable-panels',
  ],
  'Overlays and actions': [
    'dialog',
    'tooltip',
    'popover',
    'dropdown-menu',
    'context-menu',
    'command-palette',
    'hover-card',
    'alert-dialog',
    'drawer',
    'floating-action-button',
    'onboarding-tour',
  ],
  Feedback: [
    'badge',
    'alert',
    'progress',
    'skeleton',
    'circular-progress',
    'spinner',
    'empty-state',
    'status-indicator',
    'meter',
    'toast',
    'loading-overlay',
  ],
  'Data and content': [
    'chart',
    'table',
    'description-list',
    'copy-button',
    'data-table',
    'timeline',
    'stat',
    'code-block',
    'markdown-viewer',
    'rich-text-editor',
    'virtual-list',
    'infinite-scroll',
    'kanban-board',
    'sortable-list',
  ],
  Media: ['carousel', 'gallery', 'image-cropper', 'video-player', 'audio-player', 'lightbox'],
};
interface DirectoryItem {
  name: string;
  slug: string;
  description: string;
}
const familyOf = (slug: string) =>
  Object.keys(families).find((name) => families[name].includes(slug)) ?? 'Other';
export function ComponentDirectory({ items }: { items: readonly DirectoryItem[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [query, setQuery] = useState(''),
    [family, setFamily] = useState('all');
  const id = useId();
  const filtered = items.filter(
    (item) =>
      (family === 'all' || familyOf(item.slug) === family) &&
      (item.name + ' ' + item.slug + ' ' + item.description + ' ' + familyOf(item.slug))
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <>
      <div className="directory-controls" data-ready={ready}>
        <label htmlFor={id + '-search'}>
          Find your next building block
          <Input
            id={id + '-search'}
            type="search"
            disabled={!ready}
            placeholder="Search components, behavior, or a task…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <SelectControl
          label="Category"
          disabled={!ready}
          id={id + '-category'}
          value={family}
          onChange={(event) => setFamily(event.target.value)}
        >
          <option value="all">All components ({items.length})</option>
          {Object.keys(families).map((name) => (
            <option key={name} value={name}>
              {name} ({items.filter((item) => familyOf(item.slug) === name).length})
            </option>
          ))}
        </SelectControl>
        <Button
          variant="outline"
          disabled={!ready || (!query && family === 'all')}
          onClick={() => {
            setQuery('');
            setFamily('all');
          }}
        >
          Reset filters
        </Button>
      </div>
      <p className="directory-result-count" role="status">
        {filtered.length} of {items.length} components
      </p>
      <h2 className="sr-only">Component results</h2>
      <div className="component-directory component-grid">
        {filtered.map((item) => (
          <Link
            href={'/ui/components/' + item.slug}
            key={item.slug}
            className="component-card-link"
          >
            <Card className="component-catalog-card">
              <CardHeader>
                <div className="component-card-top">
                  <span className="component-index">
                    {String(items.indexOf(item) + 1).padStart(2, '0')}
                  </span>
                  <Badge tone="neutral">{familyOf(item.slug)}</Badge>
                </div>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardFooter className="component-card-footer">
                <span>Preview, API &amp; source</span>
                <span aria-hidden="true">↗</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
      {!filtered.length && (
        <div className="directory-empty">
          <h3>No components found.</h3>
          <p>Try a shorter name or choose another category.</p>
          <Button
            variant="outline"
            onClick={() => {
              setQuery('');
              setFamily('all');
            }}
          >
            Show all components
          </Button>
        </div>
      )}
    </>
  );
}
