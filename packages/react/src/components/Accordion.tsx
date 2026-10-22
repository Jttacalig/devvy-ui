import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';
export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}
export interface AccordionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  items: readonly AccordionItem[];
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
}
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { items, value, defaultValue = [], onValueChange, multiple = false, className, ...props },
  ref,
) {
  const id = useId();
  const [local, setLocal] = useState(defaultValue);
  if (new Set(items.map((item) => item.value)).size !== items.length)
    throw new Error('Accordion item values must be unique.');
  const selected = value ?? local;
  const current = multiple ? selected : selected.slice(0, 1);
  function toggle(item: AccordionItem) {
    if (item.disabled) return;
    const next = current.includes(item.value)
      ? current.filter((key) => key !== item.value)
      : multiple
        ? [...current, item.value]
        : [item.value];
    if (value === undefined) setLocal(next);
    onValueChange?.(next);
  }
  return (
    <div {...props} ref={ref} className={cx('dvy-accordion', className)}>
      {items.map((item, index) => (
        <details
          key={item.value}
          open={current.includes(item.value)}
          className="dvy-accordion-item"
        >
          <summary
            aria-controls={id + '-' + index}
            aria-disabled={item.disabled || undefined}
            onClick={(event) => {
              event.preventDefault();
              toggle(item);
            }}
          >
            {item.title}
          </summary>
          <div id={id + '-' + index} className="dvy-accordion-content">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
});
