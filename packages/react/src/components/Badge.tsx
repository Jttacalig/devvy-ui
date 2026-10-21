import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'brand' | 'danger';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, tone = 'neutral', ...props },
  ref,
) {
  return <span ref={ref} className={cx('dvy-badge', className)} data-tone={tone} {...props} />;
});
