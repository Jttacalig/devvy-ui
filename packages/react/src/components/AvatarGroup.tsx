import { Children, forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  max?: number;
}
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { label, max, className, children, ...props },
  ref,
) {
  const items = Children.toArray(children);
  const limit =
    max === undefined || !Number.isFinite(max) ? items.length : Math.max(0, Math.floor(max));
  const remaining = Math.max(0, items.length - limit);
  return (
    <div
      role="group"
      aria-label={label}
      {...props}
      ref={ref}
      className={cx('dvy-avatar-group', className)}
    >
      {items.slice(0, limit)}
      {remaining > 0 && (
        <span className="dvy-avatar-overflow" role="img" aria-label={remaining + ' more people'}>
          +{remaining}
        </span>
      )}
    </div>
  );
});
