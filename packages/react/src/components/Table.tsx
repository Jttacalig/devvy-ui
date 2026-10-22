import { forwardRef, type TableHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  caption: ReactNode;
  scrollLabel?: string;
  striped?: boolean;
  compact?: boolean;
}
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  {
    caption,
    scrollLabel = 'Scrollable table',
    striped = false,
    compact = false,
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <div className="dvy-table-scroll" role="region" aria-label={scrollLabel} tabIndex={0}>
      <table
        {...props}
        ref={ref}
        className={cx('dvy-table', className)}
        data-striped={striped}
        data-compact={compact}
      >
        <caption>{caption}</caption>
        {children}
      </table>
    </div>
  );
});
