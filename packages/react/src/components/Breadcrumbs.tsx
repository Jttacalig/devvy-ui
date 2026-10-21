import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../lib/cx';

export interface BreadcrumbItem extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  label: ReactNode;
}
export interface BreadcrumbsProps
  extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'aria-label'> {
  items: readonly BreadcrumbItem[];
  label?: string;
}
/** An ordered trail. The last item is the current page, with or without a URL. */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, label = 'Breadcrumb', className, ...props },
  ref,
) {
  return (
    <nav {...props} ref={ref} aria-label={label} className={cx('dvy-breadcrumbs', className)}>
      <ol>
        {items.map(({ label: text, href, ...attributes }, index) => (
          <li key={index}>
            {index > 0 && (
              <span className="dvy-breadcrumb-divider" aria-hidden="true">
                /
              </span>
            )}
            {href ? (
              <a
                {...attributes}
                href={href}
                aria-current={index === items.length - 1 ? 'page' : undefined}
              >
                {text}
              </a>
            ) : (
              <span aria-current={index === items.length - 1 ? 'page' : undefined}>{text}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
});
