import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface StatusIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  label: string;
  tone?: 'neutral' | 'brand' | 'danger';
}
export const StatusIndicator = forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  function StatusIndicator({ label, tone = 'neutral', className, ...props }, ref) {
    return (
      <span {...props} ref={ref} className={cx('dvy-status-indicator', className)} data-tone={tone}>
        <span className="dvy-status-dot" aria-hidden="true" />
        {label}
      </span>
    );
  },
);
