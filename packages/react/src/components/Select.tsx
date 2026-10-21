import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Visual dimensions. Native size remains the number of visible options. */
  controlSize?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, controlSize = 'md', variant = 'outline', ...props },
  ref,
) {
  return (
    <select
      {...props}
      ref={ref}
      className={cx('dvy-select', className)}
      data-size={controlSize}
      data-variant={variant}
    />
  );
});
