import { forwardRef, useRef, useState, type HTMLAttributes } from 'react';
import { DropdownMenu, type MenuAction } from './DropdownMenu';
export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  menus: readonly { id: string; label: string; items: readonly MenuAction[] }[];
  dir?: 'ltr' | 'rtl';
}
export const Menubar = forwardRef<HTMLDivElement, MenubarProps>(function Menubar(
  { label, menus, dir = 'ltr', className, ...props },
  ref,
) {
  const [active, setActive] = useState(0),
    [open, setOpen] = useState<string>();
  const bar = useRef<HTMLDivElement>(null);
  return (
    <div
      {...props}
      ref={(node) => {
        bar.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      role="menubar"
      tabIndex={-1}
      aria-label={label}
      dir={dir}
      className={['dvy-menubar', className].filter(Boolean).join(' ')}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (
          event.defaultPrevented ||
          !(event.target as HTMLElement).hasAttribute('data-dvy-menu-trigger')
        )
          return;
        const keys = dir === 'rtl' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowRight', 'ArrowLeft'];
        let next = active;
        if (event.key === keys[0]) next = (active + 1) % menus.length;
        else if (event.key === keys[1]) next = (active - 1 + menus.length) % menus.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = menus.length - 1;
        else if (event.key === 'ArrowDown') {
          event.preventDefault();
          setOpen(menus[active]?.id);
          return;
        } else return;
        event.preventDefault();
        setActive(next);
        setOpen(undefined);
        const triggers =
          event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-dvy-menu-trigger]');
        triggers[next]?.focus();
      }}
    >
      {menus.map((menu, index) => (
        <DropdownMenu
          key={menu.id}
          label={menu.label}
          items={menu.items}
          open={open === menu.id}
          onOpenChange={(value) =>
            setOpen((current) => (value ? menu.id : current === menu.id ? undefined : current))
          }
          onKeyDown={(event) => {
            if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
            event.preventDefault();
            const next =
              (index + ((event.key === 'ArrowRight') !== (dir === 'rtl') ? 1 : -1) + menus.length) %
              menus.length;
            const triggers =
              bar.current?.querySelectorAll<HTMLButtonElement>('[data-dvy-menu-trigger]');
            triggers?.[next]?.focus();
            setActive(next);
            setOpen(menus[next]?.id);
          }}
          triggerProps={
            {
              role: 'menuitem',
              tabIndex: index === active ? 0 : -1,
              'data-dvy-menu-trigger': true,
              onFocus: () => setActive(index),
            } as React.ButtonHTMLAttributes<HTMLButtonElement>
          }
        />
      ))}
    </div>
  );
});
