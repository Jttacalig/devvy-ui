import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'fluid';
}
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'lg', className, ...props },
  ref,
) {
  return <div {...props} ref={ref} className={cx('dvy-container', className)} data-size={size} />;
});
