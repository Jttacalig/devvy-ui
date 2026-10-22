import { forwardRef, useState, type DetailsHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
export interface CollapsibleProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
  summary: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}
export const Collapsible = forwardRef<HTMLDetailsElement, CollapsibleProps>(function Collapsible(
  {
    summary,
    open,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
    children,
    className,
    ...props
  },
  ref,
) {
  const [local, setLocal] = useState(defaultOpen);
  const expanded = open ?? local;
  return (
    <details {...props} ref={ref} open={expanded} className={cx('dvy-collapsible', className)}>
      <summary
        aria-disabled={disabled || undefined}
        onClick={(event) => {
          event.preventDefault();
          if (disabled) return;
          if (open === undefined) setLocal(!expanded);
          onOpenChange?.(!expanded);
        }}
      >
        {summary}
      </summary>
      <div className="dvy-collapsible-content">{children}</div>
    </details>
  );
});
