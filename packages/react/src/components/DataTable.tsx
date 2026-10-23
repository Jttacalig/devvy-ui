import { useMemo, useState, type ReactNode } from 'react';
import { Table } from './Table';
import { Pagination } from './Pagination';
export interface DataTableSelection<T> {
  selectedIds?: readonly string[];
  defaultSelectedIds?: readonly string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  getRowLabel: (row: T) => string;
  isRowSelectable?: (row: T) => boolean;
  renderActions?: (rows: readonly T[], clear: () => void) => ReactNode;
}
export interface DataColumn<T> {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
}
export interface DataTableProps<T> {
  label: string;
  rows: readonly T[];
  columns: readonly DataColumn<T>[];
  getRowId: (row: T) => string;
  filterText?: (row: T) => string;
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
  /** Optional selection; select-all affects only selectable rows on the current page. */
  rowSelection?: DataTableSelection<T>;
}
export function DataTable<T>({
  label,
  rows,
  columns,
  getRowId,
  filterText,
  pageSize = 10,
  className,
  emptyMessage = 'No matching records.',
  rowSelection,
}: DataTableProps<T>) {
  const [internalSelection, setInternalSelection] = useState<readonly string[]>(
    () => rowSelection?.defaultSelectedIds ?? [],
  );
  const [query, setQuery] = useState(''),
    [sort, setSort] = useState<{ key: string; desc: boolean }>(),
    [page, setPage] = useState(1);
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10;
  const filtered = useMemo(() => {
    const list = rows.filter(
      (row) =>
        !query ||
        !filterText ||
        filterText(row).toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );
    const column = columns.find((c) => c.key === sort?.key);
    if (column?.sortValue)
      list.sort((a, b) => {
        const x = column.sortValue!(a),
          y = column.sortValue!(b);
        return (
          (typeof x === 'number' && typeof y === 'number'
            ? x - y
            : String(x).localeCompare(String(y), 'en')) * (sort?.desc ? -1 : 1)
        );
      });
    return list;
  }, [rows, query, filterText, columns, sort]);
  const count = Math.ceil(filtered.length / size),
    current = Math.min(page, count || 1);
  const visible = filtered.slice((current - 1) * size, current * size);
  const selectable = (row: T) => rowSelection?.isRowSelectable?.(row) ?? true;
  const selected = new Set(rowSelection?.selectedIds ?? internalSelection);
  const isSelected = (row: T) => selectable(row) && selected.has(getRowId(row));
  const selectedRows = rowSelection ? rows.filter(isSelected) : [];
  const pageRows = rowSelection ? visible.filter(selectable) : [];
  const pageSelected = pageRows.filter((row) => selected.has(getRowId(row))).length;
  function changeSelection(next: Set<string>) {
    const ids = rows.filter((row) => selectable(row) && next.has(getRowId(row))).map(getRowId);
    if (rowSelection?.selectedIds === undefined) setInternalSelection(ids);
    rowSelection?.onSelectedIdsChange?.(ids);
  }
  const clearSelection = () => changeSelection(new Set());
  function toggleSelection(targets: readonly T[], checked: boolean) {
    const next = new Set(selected);
    for (const row of targets) {
      if (checked) next.add(getRowId(row));
      else next.delete(getRowId(row));
    }
    changeSelection(next);
  }
  return (
    <div className={['dvy-data-table', className].filter(Boolean).join(' ')}>
      {filterText && (
        <input
          type="search"
          className="dvy-input"
          aria-label={'Filter ' + label}
          placeholder="Filter records…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      )}
      {rowSelection && (
        <div className="dvy-data-table-selection">
          <span role="status">{selectedRows.length} selected</span>
          {selectedRows.length > 0 && rowSelection.renderActions?.(selectedRows, clearSelection)}
        </div>
      )}
      <Table caption={label}>
        <thead>
          <tr>
            {rowSelection && (
              <th scope="col" className="dvy-data-table-check">
                <input
                  type="checkbox"
                  className="dvy-checkbox"
                  aria-label="Select all rows on this page"
                  disabled={!pageRows.length}
                  checked={pageRows.length > 0 && pageSelected === pageRows.length}
                  aria-checked={
                    pageSelected > 0 && pageSelected < pageRows.length ? 'mixed' : undefined
                  }
                  ref={(node) => {
                    if (node)
                      node.indeterminate = pageSelected > 0 && pageSelected < pageRows.length;
                  }}
                  onChange={(event) => {
                    event.currentTarget.indeterminate =
                      pageSelected > 0 && pageSelected < pageRows.length;
                    toggleSelection(pageRows, event.target.checked);
                  }}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={
                  sort?.key === column.key
                    ? sort.desc
                      ? 'descending'
                      : 'ascending'
                    : column.sortValue
                      ? 'none'
                      : undefined
                }
              >
                {column.sortValue ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSort({
                        key: column.key,
                        desc: sort?.key === column.key ? !sort.desc : false,
                      })
                    }
                  >
                    {column.label}
                    <span aria-hidden="true">
                      {sort?.key === column.key ? (sort.desc ? ' ↓' : ' ↑') : ' ↕'}
                    </span>
                  </button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => (
            <tr key={getRowId(row)} data-selected={(rowSelection && isSelected(row)) || undefined}>
              {rowSelection && (
                <td className="dvy-data-table-check">
                  <input
                    type="checkbox"
                    className="dvy-checkbox"
                    aria-label={'Select ' + rowSelection.getRowLabel(row)}
                    disabled={!selectable(row)}
                    checked={isSelected(row)}
                    onChange={(event) => toggleSelection([row], event.target.checked)}
                  />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
          {!filtered.length && (
            <tr>
              <td colSpan={Math.max(1, columns.length + (rowSelection ? 1 : 0))}>{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </Table>
      <p role="status">{filtered.length} records</p>
      <Pagination label={label + ' pages'} count={count} page={current} onPageChange={setPage} />
    </div>
  );
}
