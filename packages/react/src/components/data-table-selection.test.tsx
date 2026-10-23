import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DataTable } from './DataTable';

const rows = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Beta' },
  { id: 'c', name: 'Charlie' },
];
const props = {
  label: 'Projects',
  rows,
  columns: [{ key: 'name', label: 'Name', render: (row: (typeof rows)[number]) => row.name }],
  getRowId: (row: (typeof rows)[number]) => row.id,
  filterText: (row: (typeof rows)[number]) => row.name,
  pageSize: 2,
};
describe('optional data table selection', () => {
  it('retains selection across filtering and pagination; select-all only affects the current page', async () => {
    render(<DataTable {...props} rowSelection={{ getRowLabel: (row) => row.name }} />);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Alpha' }));
    expect(
      screen
        .getByRole('checkbox', { name: 'Select all rows on this page' })
        .getAttribute('aria-checked'),
    ).toBe('mixed');
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows on this page' }));
    expect(screen.getByText('2 selected')).toBeTruthy();
    await userEvent.type(screen.getByRole('searchbox'), 'Alpha');
    expect(
      (screen.getByRole('checkbox', { name: 'Select Alpha' }) as HTMLInputElement).checked,
    ).toBe(true);
    expect(screen.getByText('2 selected')).toBeTruthy();
  });
  it('honors controlled selection and excludes disabled rows', async () => {
    const change = vi.fn();
    const { rerender } = render(
      <DataTable
        {...props}
        rowSelection={{
          getRowLabel: (row) => row.name,
          selectedIds: [],
          onSelectedIdsChange: change,
          isRowSelectable: (row) => row.id !== 'b',
        }}
      />,
    );
    expect(
      (screen.getByRole('checkbox', { name: 'Select Beta' }) as HTMLInputElement).disabled,
    ).toBe(true);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select all rows on this page' }));
    expect(change).toHaveBeenLastCalledWith(['a']);
    expect(
      (screen.getByRole('checkbox', { name: 'Select Alpha' }) as HTMLInputElement).checked,
    ).toBe(false);
    rerender(
      <DataTable
        {...props}
        rowSelection={{
          getRowLabel: (row) => row.name,
          selectedIds: ['a'],
          onSelectedIdsChange: change,
        }}
      />,
    );
    expect(
      (screen.getByRole('checkbox', { name: 'Select Alpha' }) as HTMLInputElement).checked,
    ).toBe(true);
  });
  it('bulk actions receive current eligible rows and can clear uncontrolled selection', async () => {
    const action = vi.fn();
    const selection = {
      getRowLabel: (row: (typeof rows)[number]) => row.name,
      defaultSelectedIds: ['a', 'removed'],
      renderActions: (selected: ReadonlyArray<(typeof rows)[number]>, clear: () => void) => (
        <button
          onClick={() => {
            action(selected);
            clear();
          }}
        >
          Act on selected
        </button>
      ),
    };
    const { rerender } = render(<DataTable {...props} rowSelection={selection} />);
    await userEvent.click(screen.getByRole('button', { name: 'Act on selected' }));
    expect(action).toHaveBeenCalledWith([rows[0]]);
    expect(screen.getByText('0 selected')).toBeTruthy();
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Alpha' }));
    rerender(<DataTable {...props} rows={rows.slice(1)} rowSelection={selection} />);
    expect(screen.getByText('0 selected')).toBeTruthy();
  });
});
