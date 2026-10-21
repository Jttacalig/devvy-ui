import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Badge, Button, Card, CardTitle, Input, Separator } from '../index';

describe('Devvy UI primitives', () => {
  it('uses safe native button defaults and handles events', () => {
    let count = 0;
    render(<Button onClick={() => count++}>Create</Button>);
    const button = screen.getByRole('button', { name: 'Create' });
    expect(button.getAttribute('type')).toBe('button');
    fireEvent.click(button);
    expect(count).toBe(1);
  });

  it('does not trigger a disabled button', () => {
    let count = 0;
    render(
      <Button disabled onClick={() => count++}>
        Disabled
      </Button>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(count).toBe(0);
  });

  it('preserves input labeling and accepts typing', () => {
    render(
      <>
        <label htmlFor="project">Project</label>
        <Input id="project" />
      </>,
    );
    const input = screen.getByRole('textbox', { name: 'Project' }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Devvy' } });
    expect(input.value).toBe('Devvy');
  });

  it('renders a heading and badge in a card', () => {
    render(
      <Card>
        <CardTitle>Library</CardTitle>
        <Badge tone="brand">Alpha</Badge>
      </Card>,
    );
    expect(screen.getByRole('heading', { name: 'Library' })).toBeTruthy();
    expect(screen.getByText('Alpha').getAttribute('data-tone')).toBe('brand');
  });

  it('keeps decorative separators out of the accessibility tree', () => {
    const { container } = render(<Separator />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('exposes semantic separators when requested', () => {
    render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole('separator').getAttribute('aria-orientation')).toBe('vertical');
  });
});
