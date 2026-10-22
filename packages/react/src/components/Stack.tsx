import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: CSSProperties['gap'];
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
}
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    direction = 'column',
    gap = '1rem',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    style,
    className,
    ...props
  },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={cx('dvy-stack', className)}
      data-direction={direction}
      style={{
        gap,
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
        justifyContent:
          justify === 'between'
            ? 'space-between'
            : justify === 'start'
              ? 'flex-start'
              : justify === 'end'
                ? 'flex-end'
                : justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    />
  );
});
