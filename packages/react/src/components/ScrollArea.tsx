import { forwardRef, type HTMLAttributes } from 'react';
export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  axis?: 'vertical' | 'horizontal' | 'both';
}
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { label, axis = 'vertical', className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      role="region"
      aria-label={label}
      tabIndex={props.tabIndex ?? 0}
      data-axis={axis}
      className={['dvy-scroll-area', className].filter(Boolean).join(' ')}
    />
  );
});
