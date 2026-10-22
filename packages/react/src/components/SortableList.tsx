import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { moveItem } from '../lib/widgets';
export interface SortableItem {
  id: string;
  label: string;
  content?: ReactNode;
  disabled?: boolean;
}
export interface SortableListProps extends HTMLAttributes<HTMLOListElement> {
  label: string;
  items: readonly SortableItem[];
  onItemsChange: (items: SortableItem[]) => void;
  disabled?: boolean;
}
export const SortableList = forwardRef<HTMLOListElement, SortableListProps>(function SortableList(
  { label, items, onItemsChange, disabled, className, ...props },
  ref,
) {
  const [dragging, setDragging] = useState(''),
    [message, setMessage] = useState(''),
    id = useId();
  const move = (from: number, to: number) => {
    if (
      disabled ||
      from < 0 ||
      from >= items.length ||
      items[from]?.disabled ||
      to < 0 ||
      to >= items.length
    )
      return;
    onItemsChange(moveItem(items, from, to));
    setMessage(items[from].label + ' moved to position ' + (to + 1) + '.');
  };
  return (
    <>
      <ol
        {...props}
        ref={ref}
        aria-label={label}
        className={['dvy-sortable-list', className].filter(Boolean).join(' ')}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            draggable={!disabled && !item.disabled}
            data-dragging={dragging === item.id}
            onDragStart={(event) => {
              setDragging(item.id);
              event.dataTransfer.setData(
                'application/x-devvy-item',
                JSON.stringify({ source: id, item: item.id }),
              );
              event.dataTransfer.effectAllowed = 'move';
            }}
            onDragEnd={() => setDragging('')}
            onDragOver={(event) => {
              if (dragging && !disabled) event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              try {
                const data = JSON.parse(event.dataTransfer.getData('application/x-devvy-item'));
                if (data.source === id)
                  move(
                    items.findIndex((v) => v.id === data.item),
                    index,
                  );
              } catch {
                /* Ignore foreign drag data. */
              }
              setDragging('');
            }}
          >
            <span>{item.content ?? item.label}</span>
            <div>
              <button
                type="button"
                disabled={disabled || item.disabled || index === 0}
                aria-label={'Move ' + item.label + ' up'}
                onClick={() => move(index, index - 1)}
              >
                ↑
              </button>
              <button
                type="button"
                disabled={disabled || item.disabled || index === items.length - 1}
                aria-label={'Move ' + item.label + ' down'}
                onClick={() => move(index, index + 1)}
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ol>
      <p role="status" className="dvy-sr-only">
        {message}
      </p>
    </>
  );
});
