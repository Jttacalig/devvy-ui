import { forwardRef, type HTMLAttributes } from 'react';
import { safeURL } from '../lib/widgets';
export interface NavigationMenuProps extends HTMLAttributes<HTMLElement> {
  label: string;
  items: readonly {
    label: string;
    href?: string;
    children?: readonly { label: string; href: string }[];
  }[];
}
export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu(
  { label, items, className, ...props },
  ref,
) {
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={label}
      className={['dvy-navigation-menu', className].filter(Boolean).join(' ')}
    >
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.children ? (
              <details>
                <summary>{item.label}</summary>
                <ul>
                  {item.children.map((child, i) => (
                    <li key={i}>
                      <a href={safeURL(child.href)}>{child.label}</a>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <a href={safeURL(item.href ?? '#')}>{item.label}</a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
});
