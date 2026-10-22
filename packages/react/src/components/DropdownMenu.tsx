import { forwardRef, useRef, type KeyboardEvent } from 'react';
import { Popover, type PopoverProps } from './Popover';
import { useValue } from '../lib/widgets';
export interface MenuAction {
  id: string;
  label: string;
  disabled?: boolean;
  shortcut?: string;
  onSelect: () => void;
}
export interface DropdownMenuProps extends Omit<PopoverProps, 'children' | 'panelRole'> {
  items: readonly MenuAction[];
}
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(function DropdownMenu(
  { items, open, defaultOpen = false, onOpenChange, ...props },
  ref,
) {
  const [expanded, setExpanded] = useValue(open, defaultOpen, onOpenChange);
  const typeahead = useRef({ text: '', time: 0 });
  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    props.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const buttons = [
      ...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'),
    ];
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    let next: number | undefined;
    if (event.key === 'ArrowDown') next = (current + 1) % buttons.length;
    if (event.key === 'ArrowUp') next = (current - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== ' ') {
      const now = Date.now();
      typeahead.current.text =
        (now - typeahead.current.time > 600 ? '' : typeahead.current.text) +
        event.key.toLocaleLowerCase();
      typeahead.current.time = now;
      next = buttons.findIndex(
        (button, i) =>
          i > current && button.textContent?.toLocaleLowerCase().startsWith(typeahead.current.text),
      );
      if (next < 0)
        next = buttons.findIndex((button) =>
          button.textContent?.toLocaleLowerCase().startsWith(typeahead.current.text),
        );
    }
    if (next !== undefined) {
      event.preventDefault();
      buttons[next]?.focus();
    }
  }
  return (
    <Popover
      {...props}
      ref={ref}
      open={expanded}
      onOpenChange={setExpanded}
      panelRole="menu"
      onKeyDown={navigate}
    >
      {items.length ? (
        items.map((item) => (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            tabIndex={-1}
            disabled={item.disabled}
            className="dvy-menu-item"
            onClick={() => {
              setExpanded(false);
              item.onSelect();
            }}
          >
            {item.label}
            {item.shortcut && <kbd aria-hidden="true">{item.shortcut}</kbd>}
          </button>
        ))
      ) : (
        <p>No actions available.</p>
      )}
    </Popover>
  );
});
