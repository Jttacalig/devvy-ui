import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}
export const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  function CircularProgress(
    { label, value, max = 100, size = 'md', showValue = false, className, ...props },
    ref,
  ) {
    const limit = Number.isFinite(max) && max > 0 ? max : 100;
    const current =
      value !== undefined && Number.isFinite(value)
        ? Math.min(limit, Math.max(0, value))
        : undefined;
    const percent = current === undefined ? undefined : Math.round((current / limit) * 100);
    return (
      <div
        role="progressbar"
        aria-label={label}
        {...props}
        ref={ref}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={current}
        className={cx('dvy-circular-progress', className)}
        data-size={size}
      >
        <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
          <circle className="dvy-circular-track" cx="24" cy="24" r="20" />
          <circle
            className="dvy-circular-value"
            cx="24"
            cy="24"
            r="20"
            pathLength="100"
            strokeDasharray={current === undefined ? '18 12' : (current / limit) * 100 + ' 100'}
            transform="rotate(-90 24 24)"
          />
        </svg>
        {showValue && <span aria-hidden="true">{percent === undefined ? '…' : percent + '%'}</span>}
      </div>
    );
  },
);
