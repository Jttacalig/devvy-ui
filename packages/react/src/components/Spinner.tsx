import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  decorative?: boolean;
}
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { label = 'Loading', size = 'md', decorative = false, className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      role={decorative ? undefined : 'status'}
      aria-hidden={decorative || undefined}
      className={cx('dvy-loading-spinner', className)}
      data-size={size}
    >
      <span className="dvy-spinner" aria-hidden="true" />
      {!decorative && <span className="dvy-sr-only">{label}</span>}
    </span>
  );
});
