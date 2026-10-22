import { useRef, useState, type ReactNode } from 'react';
export interface VirtualListProps<T> {
  label: string;
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T, index: number) => ReactNode;
  rowHeight?: number;
  height?: number;
  overscan?: number;
  className?: string;
}
export function VirtualList<T>({
  label,
  items,
  getKey,
  renderItem,
  rowHeight = 48,
  height = 320,
  overscan = 3,
  className,
}: VirtualListProps<T>) {
  const [scroll, setScroll] = useState(0),
    [all, setAll] = useState(false),
    [focused, setFocused] = useState<number>(),
    viewport = useRef<HTMLDivElement>(null);
  const row = Number.isFinite(rowHeight) ? Math.max(24, rowHeight) : 48,
    view = Number.isFinite(height) ? Math.max(48, height) : 320,
    extra = Number.isFinite(overscan) ? Math.max(0, Math.floor(overscan)) : 3;
  const start = Math.max(0, Math.floor(scroll / row) - extra),
    end = Math.min(items.length, Math.ceil((scroll + view) / row) + extra),
    indices = all
      ? items.map((_, i) => i)
      : [
          ...new Set([
            ...Array.from({ length: Math.max(0, end - start) }, (_, i) => start + i),
            ...(focused !== undefined && focused < items.length ? [focused] : []),
          ]),
        ].sort((a, b) => a - b);
  return (
    <div className={['dvy-virtual-list', className].filter(Boolean).join(' ')}>
      <button type="button" aria-pressed={all} onClick={() => setAll((v) => !v)}>
        {all ? 'Use windowed view' : 'Show all items'}
      </button>
      <div
        ref={viewport}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="dvy-virtual-viewport"
        style={{ height: all ? undefined : view }}
        onScroll={(event) => setScroll(event.currentTarget.scrollTop)}
        onFocusCapture={(event) => {
          const node = (event.target as HTMLElement).closest<HTMLElement>('[data-dvy-row-index]');
          if (node) setFocused(Number(node.dataset.dvyRowIndex));
        }}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(undefined);
        }}
      >
        <div
          role="list"
          style={{ position: 'relative', height: all ? undefined : items.length * row }}
        >
          {indices.map((index) => (
            <div
              role="listitem"
              key={getKey(items[index])}
              aria-setsize={items.length}
              aria-posinset={index + 1}
              data-dvy-row-index={index}
              style={
                all
                  ? undefined
                  : {
                      position: 'absolute',
                      insetInline: 0,
                      top: index * row,
                      height: row,
                      overflow: 'auto',
                    }
              }
            >
              {renderItem(items[index], index)}
            </div>
          ))}
        </div>
        {!items.length && <p>No items available.</p>}
      </div>
    </div>
  );
}
