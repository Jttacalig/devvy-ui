import { createElement, forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}
export const EmptyState = forwardRef<HTMLElement, EmptyStateProps>(function EmptyState(
  { title, description, icon, headingLevel = 3, children, className, ...props },
  ref,
) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      {...props}
      ref={ref}
      className={cx('dvy-empty-state', 'dvy-glass-surface', className)}
    >
      {icon && (
        <span className="dvy-empty-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {createElement('h' + headingLevel, { id, className: 'dvy-empty-title' }, title)}
      {description && <p>{description}</p>}
      {children}
    </section>
  );
});
