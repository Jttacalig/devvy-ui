import { useMemo, useState, type ReactNode } from 'react';
import { Table } from './Table';
import { Pagination } from './Pagination';
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
}: DataTableProps<T>) {
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
      <Table caption={label}>
        <thead>
          <tr>
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
          {filtered.slice((current - 1) * size, current * size).map((row) => (
            <tr key={getRowId(row)}>
              {columns.map((column) => (
                <td key={column.key}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
          {!filtered.length && (
            <tr>
              <td colSpan={Math.max(1, columns.length)}>{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </Table>
      <p role="status">{filtered.length} records</p>
      <Pagination label={label + ' pages'} count={count} page={current} onPageChange={setPage} />
    </div>
  );
}
