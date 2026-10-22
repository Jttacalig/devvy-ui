import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
export interface TimelineItem {
  id: string;
  title: string;
  dateTime?: string;
  dateLabel?: string;
  content?: ReactNode;
}
export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  label: string;
  items: readonly TimelineItem[];
}
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { label, items, className, ...props },
  ref,
) {
  return (
    <ol
      {...props}
      ref={ref}
      aria-label={label}
      className={['dvy-timeline', className].filter(Boolean).join(' ')}
    >
      {items.map((item) => (
        <li key={item.id}>
          {item.dateTime && <time dateTime={item.dateTime}>{item.dateLabel ?? item.dateTime}</time>}
          <strong>{item.title}</strong>
          {item.content && <div>{item.content}</div>}
        </li>
      ))}
    </ol>
  );
});
