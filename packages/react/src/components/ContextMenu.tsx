import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { DropdownMenu, type MenuAction } from './DropdownMenu';
import { useValue } from '../lib/widgets';
export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  items: readonly MenuAction[];
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
  { label, items, children, open, onOpenChange, onContextMenu, className, ...props },
  ref,
) {
  const [expanded, setExpanded] = useValue(open, false, onOpenChange);
  return (
    <div
      {...props}
      ref={ref}
      className={['dvy-context-menu', className].filter(Boolean).join(' ')}
      onContextMenu={(event) => {
        onContextMenu?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          setExpanded(true);
        }
      }}
    >
      {children}
      <DropdownMenu
        label={label}
        items={items}
        triggerProps={{
          onKeyDown: (event) => {
            if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
              event.preventDefault();
              setExpanded(true);
            }
          },
        }}
        open={expanded}
        onOpenChange={setExpanded}
      />
    </div>
  );
});
