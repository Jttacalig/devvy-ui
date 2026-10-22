import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
export interface KanbanItem {
  id: string;
  title: string;
  columnId: string;
  description?: string;
}
export interface KanbanBoardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  columns: readonly { id: string; label: string }[];
  items: readonly KanbanItem[];
  onItemsChange: (items: KanbanItem[]) => void;
  disabled?: boolean;
}
export const KanbanBoard = forwardRef<HTMLDivElement, KanbanBoardProps>(function KanbanBoard(
  { label, columns, items, onItemsChange, disabled, className, ...props },
  ref,
) {
  const [message, setMessage] = useState(''),
    focusTarget = useRef(''),
    controls = useRef(new Map<string, HTMLSelectElement>());
  useEffect(() => {
    if (focusTarget.current) {
      controls.current.get(focusTarget.current)?.focus();
      focusTarget.current = '';
    }
  }, [items]);
  return (
    <div
      {...props}
      ref={ref}
      role="region"
      aria-label={label}
      className={['dvy-kanban', className].filter(Boolean).join(' ')}
    >
      {columns.map((column) => (
        <section key={column.id} aria-label={column.label}>
          <h3>
            {column.label}
            <span> · {items.filter((item) => item.columnId === column.id).length}</span>
          </h3>
          <ul>
            {items
              .filter((item) => item.columnId === column.id)
              .map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  {item.description && <p>{item.description}</p>}
                  <label>
                    Move to
                    <select
                      disabled={disabled}
                      ref={(node) => {
                        if (node) controls.current.set(item.id, node);
                        else controls.current.delete(item.id);
                      }}
                      aria-label={'Move ' + item.title + ' to column'}
                      value={item.columnId}
                      onChange={(event) => {
                        const next = event.target.value;
                        focusTarget.current = item.id;
                        onItemsChange(
                          items.map((v) => (v.id === item.id ? { ...v, columnId: next } : v)),
                        );
                        setMessage(
                          item.title +
                            ' moved to ' +
                            columns.find((c) => c.id === next)?.label +
                            '.',
                        );
                      }}
                    >
                      {columns.map((choice) => (
                        <option key={choice.id} value={choice.id}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </li>
              ))}
          </ul>
          {!items.some((item) => item.columnId === column.id) && <p>No cards yet.</p>}
        </section>
      ))}
      <p role="status" className="dvy-sr-only">
        {message}
      </p>
    </div>
  );
});
