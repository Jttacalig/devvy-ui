import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react';
export interface TableOfContentsProps extends HTMLAttributes<HTMLElement> {
  label?: string;
  items: readonly { id: string; label: string; level?: number }[];
}
export const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(
  function TableOfContents({ label = 'On this page', items, className, ...props }, ref) {
    const [active, setActive] = useState('');
    useEffect(() => {
      if (typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver(
        (entries) => {
          const first = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (first) setActive(first.target.id);
        },
        { rootMargin: '0px 0px -60% 0px' },
      );
      for (const item of items) {
        const node = document.getElementById(item.id);
        if (node) observer.observe(node);
      }
      return () => observer.disconnect();
    }, [items]);
    return (
      <nav
        {...props}
        ref={ref}
        aria-label={label}
        className={['dvy-toc', className].filter(Boolean).join(' ')}
      >
        <ol>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                paddingInlineStart: Math.max(0, Math.min(5, (item.level ?? 2) - 2)) * 0.75 + 'rem',
              }}
            >
              <a
                href={'#' + encodeURIComponent(item.id)}
                aria-current={active === item.id ? 'location' : undefined}
                onClick={() => setActive(item.id)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    );
  },
);
