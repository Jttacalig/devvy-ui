import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

export interface SkeletonProps
  extends Omit<
    HTMLAttributes<HTMLSpanElement>,
    'children' | 'tabIndex' | 'role' | 'aria-hidden' | 'dangerouslySetInnerHTML'
  > {
  variant?: 'text' | 'circle' | 'rect';
  animated?: boolean;
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { className, variant = 'text', animated = true, width, height, style, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      className={cx('dvy-skeleton', className)}
      data-variant={variant}
      data-animated={animated}
      aria-hidden="true"
      style={{ width, height, ...style }}
    />
  );
});
