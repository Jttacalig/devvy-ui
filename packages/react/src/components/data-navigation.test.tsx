import { describe, it, expect, vi } from 'vitest';
import { act, createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { Chart, Navbar, Sidebar, Breadcrumbs } from '../index';

describe('data and navigation', () => {
  it.each(['bar', 'line', 'area', 'donut'] as const)(
    '%s provides the full data independently of color',
    async (type) => {
      render(
        <Chart
          title="Visitors"
          type={type}
          data={[
            { label: 'Search', value: 32 },
            { label: 'Direct', value: 18 },
          ]}
        />,
      );
      expect(screen.getByRole('img', { name: 'Visitors' })).toBeTruthy();
      await userEvent.click(screen.getByText('View data'));
      expect(screen.getByRole('table', { name: 'Visitors' }).textContent).toContain(
        'Search32Direct18',
      );
    },
  );
  it('handles negative, zero, single, invalid and extreme finite values without invalid geometry', () => {
    for (const type of ['bar', 'line', 'area'] as const) {
      for (const values of [[0], [-3, 5], [Number.MAX_VALUE, -Number.MAX_VALUE], [4, 4]]) {
        const { container, unmount } = render(
          <Chart
            title="Scale"
            type={type}
            data={values.map((value, i) => ({ label: String(i), value }))}
          />,
        );
        const geometry = [...container.querySelectorAll('rect, circle, line, polyline, polygon')]
          .map((element) => element.outerHTML)
          .join('');
        expect(geometry).not.toMatch(/NaN|Infinity/);
        unmount();
      }
    }
    const { container } = render(<Chart title="Empty" data={[{ label: 'bad', value: NaN }]} />);
    expect(container.textContent).toContain('No data to display.');
  });
  it.each([
    { data: [] },
    { data: [{ label: 'Zero', value: 0 }] },
    { data: [{ label: 'Negative', value: -2 }] },
  ])('explains unsupported donut data', ({ data }) => {
    render(<Chart title="Sources" type="donut" data={data} emptyLabel="Nothing yet" />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('Nothing yet')).toBeTruthy();
  });
  it('toggles navigation, closes on Escape and preserves native attributes', async () => {
    const ref = createRef<HTMLElement>();
    const keydown = vi.fn();
    render(
      <Navbar ref={ref} label="Workspace" brand="Orbit" onKeyDown={keydown} data-owner="test">
        <a href="/projects">Projects</a>
      </Navbar>,
    );
    expect(ref.current?.dataset.owner).toBe('test');
    const toggle = screen.getByRole('button', { name: 'Menu' });
    await userEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    screen.getByRole('link', { name: 'Projects' }).focus();
    await userEvent.keyboard('{Escape}');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
    expect(keydown).toHaveBeenCalled();
  });
  it('marks only the current breadcrumb and retains native link properties', () => {
    render(
      <Breadcrumbs
        items={[{ label: 'Home', href: '/', target: '_self' }, { label: 'Projects' }]}
      />,
    );
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('target')).toBe('_self');
    expect(screen.getByText('Projects').getAttribute('aria-current')).toBe('page');
    expect(screen.getByRole('list')).toBeTruthy();
  });
  it('hydrates all new entries without ID drift or recoverable errors', async () => {
    const tree = (
      <main>
        <Chart title="Activity" data={[{ label: 'Mon', value: 2 }]} />
        <Navbar label="Header" brand="Orbit">
          <a href="/">Home</a>
        </Navbar>
        <Sidebar label="Routes">
          <a href="/projects">Projects</a>
        </Sidebar>
        <Breadcrumbs items={[{ label: 'Current' }]} />
      </main>
    );
    const container = document.createElement('div');
    document.body.append(container);
    container.innerHTML = renderToString(tree);
    const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, tree, { onRecoverableError: (error) => errors.push(error) });
    });
    expect(errors).toEqual([]);
    expect([...container.querySelectorAll('[id]')].map((node) => node.id)).toEqual(ids);
    await act(async () => root?.unmount());
    container.remove();
  });
});
