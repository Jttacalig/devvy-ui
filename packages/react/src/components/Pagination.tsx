import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
type PaginationAction =
  | { onPageChange: (page: number) => void; getHref?: never }
  | { getHref: (page: number) => string; onPageChange?: never };
export type PaginationProps = HTMLAttributes<HTMLElement> &
  PaginationAction & { page: number; count: number; label?: string };
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, count, label = 'Pagination', getHref, onPageChange, className, ...props },
  ref,
) {
  const total = Number.isFinite(count)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(count)))
    : 0;
  const current = Number.isFinite(page) ? Math.max(1, Math.min(total || 1, Math.floor(page))) : 1;
  const visible = new Set([1, total]);
  for (let n = Math.max(1, current - 2); n <= Math.min(total, current + 2); n++) visible.add(n);
  const pages = [...visible].filter((n) => n > 0).sort((a, b) => a - b);
  const control = (n: number, text: string | number, disabled = false) =>
    getHref ? (
      disabled ? (
        <span aria-disabled="true">{text}</span>
      ) : (
        <a
          href={getHref(n)}
          aria-label={typeof text === 'number' ? 'Page ' + n : undefined}
          aria-current={n === current && typeof text === 'number' ? 'page' : undefined}
        >
          {text}
        </a>
      )
    ) : (
      <button
        type="button"
        disabled={disabled}
        aria-label={typeof text === 'number' ? 'Page ' + n : undefined}
        aria-current={n === current && typeof text === 'number' ? 'page' : undefined}
        onClick={() => {
          if (n !== current) onPageChange?.(n);
        }}
      >
        {text}
      </button>
    );
  return (
    <nav aria-label={label} {...props} ref={ref} className={cx('dvy-pagination', className)}>
      {total === 0 ? (
        <p>No pages</p>
      ) : (
        <ul>
          <li>{control(current - 1, 'Previous', current === 1)}</li>
          {pages.map((n, i) => (
            <li key={n}>
              {i > 0 && n - pages[i - 1] > 1 && (
                <span className="dvy-pagination-gap" aria-hidden="true">
                  …
                </span>
              )}
              {control(n, n)}
            </li>
          ))}
          <li>{control(current + 1, 'Next', current === total)}</li>
        </ul>
      )}
    </nav>
  );
});
