// This file is copied into an isolated installed-tarball consumer before execution.
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import * as UI from '@devvy-ui/react';
import { Button } from '@devvy-ui/react/button';

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
  `Installed package consumer passed: React ${React.version}; foundation plus Glass/Dialog/Dock, public exports, SSR, hydration, mixed state, dialog fallback and keyboard interaction.`,
);
