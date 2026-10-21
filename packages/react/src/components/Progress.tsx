import { forwardRef, type ProgressHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface ProgressProps
  extends Omit<ProgressHTMLAttributes<HTMLProgressElement>, 'value' | 'max'> {
  /** Accessible name for the task being measured. */
  label: string;
  /** Omit for indeterminate progress. Finite values are clamped to 0..max. */
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'brand' | 'neutral';
}

export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(function Progress(
  { className, label, value, max = 100, size = 'md', tone = 'brand', ...props },
  ref,
) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current =
    value !== undefined && Number.isFinite(value) ? Math.min(limit, Math.max(0, value)) : undefined;
  return (
    <progress
      aria-label={label}
      {...props}
      ref={ref}
      className={cx('dvy-progress', className)}
      max={limit}
      value={current}
      data-size={size}
      data-tone={tone}
    />
  );
});
