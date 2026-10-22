import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 16 / 9, className, style, children, ...props },
  ref,
) {
  const safeRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 1;
  return (
    <div
      {...props}
      ref={ref}
      className={cx('dvy-aspect-ratio', className)}
      style={{ '--dvy-aspect-ratio': safeRatio, ...style } as CSSProperties}
    >
      <div className="dvy-aspect-ratio-content">{children}</div>
    </div>
  );
});
