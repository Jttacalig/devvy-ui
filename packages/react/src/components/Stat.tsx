import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
export interface StatProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  label: string;
  value: ReactNode;
  change?: string;
  description?: string;
}
export const Stat = forwardRef<HTMLDivElement, StatProps>(function Stat(
  { label, value, change, description, className, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={['dvy-stat', className].filter(Boolean).join(' ')}>
      <dl>
        <dt>{label}</dt>
        <dd>{value}</dd>
      </dl>
      {change && <p className="dvy-stat-change">{change}</p>}
      {description && <p>{description}</p>}
    </div>
  );
});
