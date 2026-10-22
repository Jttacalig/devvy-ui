import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: number;
  minItemWidth?: string;
  gap?: CSSProperties['gap'];
}
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns, minItemWidth = '14rem', gap = '1rem', style, className, ...props },
  ref,
) {
  const count =
    columns !== undefined && Number.isFinite(columns)
      ? Math.min(24, Math.max(1, Math.floor(columns)))
      : undefined;
  return (
    <div
      {...props}
      ref={ref}
      className={cx('dvy-grid', className)}
      style={
        {
          gridTemplateColumns: count ? 'repeat(' + count + ', minmax(0, 1fr))' : undefined,
          '--dvy-grid-min': minItemWidth,
          gap,
          ...style,
        } as CSSProperties
      }
    />
  );
});
