import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface SeparatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { className, orientation = 'horizontal', decorative = true, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx('dvy-separator', className)}
      data-orientation={orientation}
      role={decorative ? 'none' : 'separator'}
      aria-hidden={decorative ? true : undefined}
      aria-orientation={decorative ? undefined : orientation}
      {...props}
    />
  );
});
