import { describe, it, expect, vi } from 'vitest';
import { act, createRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { Chart, ChartInspector, Navbar, Sidebar, Breadcrumbs } from '../index';

describe('data and navigation', () => {
  it('supports smooth/step paths, unique gradient ids and separate axis formatting', () => {
    const data = [
      { label: 'Monday', value: 1234.56 },
      { label: 'Tuesday', value: -35 },
    ];
    const { container } = render(
      <>
        <ChartInspector
          title="Smooth"
          type="area"
          curve="smooth"
          data={data}
          axisFormatter={() => 'compact'}
        />
        <ChartInspector title="Steps" type="line" curve="step" data={data} />
      </>,
    );
    const gradients = [...container.querySelectorAll('linearGradient')].map((node) => node.id);
    expect(new Set(gradients).size).toBe(2);
    expect(container.querySelector('.dvy-chart-area')?.getAttribute('d')).toContain('C');
    expect(container.querySelectorAll('.dvy-chart-line')[1].getAttribute('d')).toContain('H');
    expect(container.querySelector('.dvy-chart-grid text')?.textContent).toBe('compact');
    expect(container.querySelector('.dvy-chart-table')?.textContent).toContain('1234.56');
  });
  it('inspects exact values with one native keyboard control and clamps changing data', async () => {
    const data = [
      { label: 'Monday', value: 12 },
      { label: 'Tuesday', value: 19 },
    ];
    const { rerender } = render(
      <ChartInspector title="Activity" type="area" data={data} defaultIndex={40} />,
    );
    const slider = screen.getByRole('slider', { name: 'Inspect data' });
    expect(slider.getAttribute('aria-valuetext')).toBe('Tuesday: 19');
    fireEvent.change(slider, { target: { value: '0' } });
    expect(slider.getAttribute('aria-valuetext')).toBe('Monday: 12');
    rerender(<ChartInspector title="Activity" data={[]} />);
    expect(screen.queryByRole('slider')).toBeNull();
  });
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
        const geometry = [
          ...container.querySelectorAll('rect, circle, line, polyline, polygon, path'),
        ]
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
