import { describe, expect, it } from 'vitest';
import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardTitle,
  Checkbox,
  Input,
  Label,
  Separator,
  Switch,
  Tabs,
  Textarea,
} from '../index';

function Foundation() {
  return (
    <main>
      <h1>Foundation</h1>
      <h2>Components</h2>
      <Card>
        <CardContent>
          <CardTitle>Project settings</CardTitle>
          <Badge>Alpha</Badge>
          <Label htmlFor="name">Name</Label>
          <Input id="name" />
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" />
          <Label>
            <Checkbox />
            Accept terms
          </Label>
          <Label>
            <Switch />
            Email updates
          </Label>
          <Separator decorative={false} />
          <Button>Save</Button>
          <Tabs
            label="Settings"
            items={[
              { value: 'account', label: 'Account', content: 'Account details' },
              { value: 'billing', label: 'Billing', content: 'Billing details' },
            ]}
          />
        </CardContent>
      </Card>
    </main>
  );
}

describe('SSR and accessibility', () => {
  it('hydrates the entire foundation without recoverable errors or ID changes', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(<Foundation />);
    document.body.append(container);
    const ids = [...container.querySelectorAll('[id]')].map((element) => element.id);
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, <Foundation />, {
        onRecoverableError: (error) => errors.push(error),
      });
    });
    expect(errors).toEqual([]);
    expect([...container.querySelectorAll('[id]')].map((element) => element.id)).toEqual(ids);
    await act(async () => root?.unmount());
    container.remove();
  });
  it('passes axe structural rules for all ten components', async () => {
    const { container } = render(<Foundation />);
    // Contrast requires browser layout; Playwright covers it with the real styles loaded.
    const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
    expect(
      results.violations.map((result) => ({
        id: result.id,
        nodes: result.nodes.map((node) => node.html),
      })),
    ).toEqual([]);
  });
});
