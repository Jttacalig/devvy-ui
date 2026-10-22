import { createCompletionFixture } from './completion-fixture.mjs';
// This file is copied into an isolated installed-tarball consumer before execution.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import * as UI from '@devvy-ui/react';
import { Button } from '@devvy-ui/react/button';
import { Select } from '@devvy-ui/react/select';
import { Alert } from '@devvy-ui/react/alert';
import { Progress } from '@devvy-ui/react/progress';
import { Skeleton } from '@devvy-ui/react/skeleton';

for (const [name, entry] of Object.entries({ Select, Alert, Progress, Skeleton }))
  assert.equal(entry, UI[name]);
const inventory = JSON.parse(await readFile(new URL('./inventory.json', import.meta.url), 'utf8'));
for (const { name, slug } of inventory)
  assert.equal((await import('@devvy-ui/react/' + slug))[name], UI[name], 'Focused entry: ' + slug);

const dom = new JSDOM('<!doctype html><html lang="en"><body><div id="root"></div></body></html>', {
  url: 'http://localhost',
});
for (const [key, value] of Object.entries({
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  navigator: dom.window.navigator,
  IS_REACT_ACT_ENVIRONMENT: true,
})) {
  Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
}
const h = React.createElement;
const checkbox = React.createRef();
function Material() {
  const [open, setOpen] = React.useState(false);
  return h(
    UI.Glass,
    { quality: 'reduced' },
    h(UI.Dock, { label: 'Consumer dock' }, h('a', { href: '/workspace' }, 'Workspace')),
    h(Button, { onClick: () => setOpen(true) }, 'Open consumer dialog'),
    h(UI.Dialog, { open, onOpenChange: setOpen, title: 'Consumer settings' }, 'Settings content'),
  );
}
const tree = h(
  'main',
  null,
  h('h1', null, 'Consumer'),
  h('h2', null, 'Foundation'),
  h(Material),
  h(UI.Chart, { title: 'Activity', data: [{ label: 'Mon', value: 2 }] }),
  h(UI.ChartInspector, {
    title: 'Inspected activity',
    type: 'area',
    data: [
      { label: 'Mon', value: 2 },
      { label: 'Tue', value: 4 },
    ],
  }),
  h(UI.Navbar, { label: 'Product', brand: 'Orbit' }, h('a', { href: '/' }, 'Home')),
  h(UI.Sidebar, { label: 'Routes' }, h('a', { href: '/projects' }, 'Projects')),
  h(UI.Breadcrumbs, { items: [{ label: 'Home', href: '/' }, { label: 'Projects' }] }),
  h(
    UI.Card,
    null,
    h(UI.CardContent, null, h(UI.CardTitle, null, 'Settings'), h(UI.Badge, null, 'Alpha')),
  ),
  h(UI.Label, { htmlFor: 'name' }, 'Name'),
  h(UI.Input, { id: 'name' }),
  h(UI.Textarea, { 'aria-label': 'Notes' }),
  h(UI.Checkbox, { 'aria-label': 'Mixed', indeterminate: true, ref: checkbox }),
  h(UI.Switch, { 'aria-label': 'Updates', defaultChecked: true }),
  h(UI.Separator),
  h(Select, { 'aria-label': 'Plan', defaultValue: 'team' }, h('option', { value: 'team' }, 'Team')),
  h(Alert, null, 'Saved successfully'),
  h(Progress, { label: 'Upload', value: 42 }),
  h(Progress, { label: 'Connecting' }),
  h(Skeleton, { animated: false }),
  h(
    UI.Container,
    null,
    h(
      UI.Stack,
      null,
      h(
        UI.Grid,
        null,
        h(UI.Avatar, { name: 'Ada Rivera' }),
        h(
          UI.AvatarGroup,
          { label: 'Contributors', max: 1 },
          h(UI.Avatar, { name: 'Bea Cruz' }),
          h(UI.Avatar, { name: 'Cal Lee' }),
        ),
        h(UI.AspectRatio, null, h('span', null, 'Media')),
      ),
      h(UI.Typography, { as: 'h3', variant: 'heading' }, 'Workspace'),
      h(UI.IconButton, { label: 'Star' }, '★'),
    ),
  ),
  h(UI.Accordion, { items: [{ value: 'ownership', title: 'Ownership', content: 'Your code.' }] }),
  h(UI.Pagination, { page: 1, count: 3, getHref: (page) => '?page=' + page }),
  h(
    UI.Form,
    null,
    h(
      UI.Fieldset,
      { legend: 'Profile' },
      h(UI.FormField, {
        label: 'Workspace email',
        description: 'Used for updates',
        children: (props) => h(UI.Input, { ...props, type: 'email' }),
      }),
      h(UI.RadioGroup, {
        label: 'Plan',
        name: 'plan',
        defaultValue: 'team',
        items: [
          { value: 'solo', label: 'Solo' },
          { value: 'team', label: 'Team' },
        ],
      }),
      h(UI.SegmentedControl, {
        label: 'Billing',
        name: 'billing',
        defaultValue: 'monthly',
        items: [
          { value: 'monthly', label: 'Monthly' },
          { value: 'yearly', label: 'Yearly' },
        ],
      }),
      h(UI.Slider, { label: 'Volume', defaultValue: 35 }),
      h(UI.NumberInput, { 'aria-label': 'Seats', defaultValue: 3 }),
      h(UI.PasswordInput, { 'aria-label': 'Password', defaultValue: 'demo' }),
      h(UI.SearchField, { label: 'Projects' }),
      h(UI.ColorPicker, { label: 'Accent' }),
    ),
  ),
  h(
    UI.Table,
    { caption: 'Activity' },
    h('tbody', null, h('tr', null, h('th', { scope: 'row' }, 'Orbit'), h('td', null, 'Ready'))),
  ),
  h(UI.CircularProgress, { label: 'Export', value: 35 }),
  h(UI.Spinner, { label: 'Loading profile' }),
  h(UI.EmptyState, { title: 'No projects' }),
  h(UI.StatusIndicator, { label: 'Connected' }),
  h(UI.Collapsible, { summary: 'Advanced settings' }, 'Settings'),
  h(UI.DescriptionList, { items: [{ term: 'Plan', description: 'Team' }] }),
  h(UI.Meter, { label: 'Storage', value: 0.4 }),
  h(UI.CopyButton, { text: 'theme token' }),
  createCompletionFixture(UI, h),
  h(Button, null, 'Save'),
  h(UI.Tabs, {
    label: 'Views',
    items: [
      { value: 'first', label: 'First', content: 'One' },
      { value: 'disabled', label: 'Disabled', disabled: true, content: 'Never' },
      { value: 'last', label: 'Last', content: 'Two' },
    ],
  }),
);
const root = document.getElementById('root');
root.innerHTML = renderToString(tree);
const initialIds = [...root.querySelectorAll('[id]')].map((node) => node.id);
const errors = [];
let hydrated;
await act(async () => {
  hydrated = hydrateRoot(root, tree, { onRecoverableError: (error) => errors.push(error) });
});
assert.deepEqual(errors, []);
assert.deepEqual(
  [...root.querySelectorAll('[id]')].map((node) => node.id),
  initialIds,
);
assert.equal(checkbox.current.indeterminate, true);
assert.equal(root.querySelector('select').value, 'team');
assert.equal(root.querySelector('progress').position, 0.42);
assert.equal(root.querySelectorAll('progress')[1].position, -1);
assert.equal(root.querySelector('.dvy-skeleton').getAttribute('aria-hidden'), 'true');
await act(async () => root.querySelector('.dvy-accordion summary').click());
assert.equal(root.querySelector('.dvy-accordion details').open, true);
await act(async () => root.querySelector('.dvy-collapsible summary').click());
assert.equal(root.querySelector('.dvy-collapsible').open, true);
await act(async () => root.querySelector('.dvy-password-toggle').click());
assert.equal(root.querySelector('.dvy-password-input').type, 'text');
assert.equal(root.querySelector('input[name="plan"]:checked').value, 'team');
const materialTrigger = [...root.querySelectorAll('button')].find(
  (button) => button.textContent === 'Open consumer dialog',
);
assert.ok(materialTrigger);
await act(async () => materialTrigger.click());
const inlinePanel = root.querySelector('.dvy-dialog-inline');
assert.ok(inlinePanel?.textContent.includes('Consumer settings'));
await act(async () => inlinePanel.querySelector('button').click());
assert.equal(root.querySelector('.dvy-dialog-inline'), null);
const tabs = root.querySelectorAll('[role="tab"]');
await act(async () => {
  tabs[0].focus();
  tabs[0].dispatchEvent(
    new dom.window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
  );
});
assert.equal(document.activeElement, tabs[2]);
assert.equal(tabs[2].getAttribute('aria-selected'), 'true');
assert.equal(root.querySelector('[role="tabpanel"]:not([hidden])').textContent, 'Two');
await act(async () => hydrated.unmount());
dom.window.close();
console.log(
  `Installed package consumer passed: React ${React.version}; all 100 primary exports and optional chart inspection, public exports, SSR, hydration, mixed state, dialog fallback and keyboard interaction.`,
);
