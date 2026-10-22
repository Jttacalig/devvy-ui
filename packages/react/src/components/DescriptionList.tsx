import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
export interface DescriptionItem {
  id?: string;
  term: ReactNode;
  description: ReactNode;
}
export interface DescriptionListProps extends Omit<HTMLAttributes<HTMLDListElement>, 'children'> {
  items: readonly DescriptionItem[];
  orientation?: 'horizontal' | 'vertical';
}
export const DescriptionList = forwardRef<HTMLDListElement, DescriptionListProps>(
  function DescriptionList({ items, orientation = 'horizontal', className, ...props }, ref) {
    return (
      <dl
        {...props}
        ref={ref}
        className={cx('dvy-description-list', className)}
        data-orientation={orientation}
      >
        {items.map((item, index) => (
          <div key={item.id ?? index}>
            <dt>{item.term}</dt>
            <dd>{item.description}</dd>
          </div>
        ))}
      </dl>
    );
  },
);
