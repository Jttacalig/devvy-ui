import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { useValue } from '../lib/widgets';
export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  label: string;
  trigger?: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  triggerProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  panelRole?: 'dialog' | 'menu' | 'listbox';
  focusOnOpen?: boolean;
}
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  {
    label,
    trigger,
    children,
    open,
    defaultOpen = false,
    onOpenChange,
    disabled,
    triggerProps,
    panelRole = 'dialog',
    focusOnOpen = true,
    className,
    style,
    ...props
  },
  ref,
) {
  const [expanded, setExpanded] = useValue(open, defaultOpen, onOpenChange);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ left: number; top: number }>();
  const [appearance, setAppearance] = useState<CSSProperties>();
  const anchor = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();
  const previous = useRef(false);
  useEffect(() => {
    if (!expanded && previous.current && document.activeElement === document.body)
      anchor.current?.focus();
    previous.current = expanded;
  }, [expanded]);
  const callback = useRef(setExpanded);
  useEffect(() => {
    callback.current = setExpanded;
  });
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!expanded || !mounted) {
      setPosition(undefined);
      return;
    }
    const inherit = () => {
      if (!anchor.current) return;
      const computed = getComputedStyle(anchor.current);
      const variables = Object.fromEntries(
        Array.from(computed)
          .filter((name) => name.startsWith('--dvy-'))
          .map((name) => [name, computed.getPropertyValue(name)]),
      );
      setAppearance({
        ...variables,
        direction: computed.direction as CSSProperties['direction'],
        colorScheme: computed.colorScheme,
      });
    };
    inherit();
    const place = () => {
      const a = anchor.current?.getBoundingClientRect(),
        p = panel.current?.getBoundingClientRect();
      if (!a || !p) return;
      setPosition({
        left: Math.max(8, Math.min(a.left, window.innerWidth - p.width - 8)),
        top: Math.max(
          8,
          a.bottom + p.height + 8 <= window.innerHeight ? a.bottom + 8 : a.top - p.height - 8,
        ),
      });
    };
    place();
    const outside = (event: Event) => {
      const target = event.target as Node;
      if (!anchor.current?.contains(target) && !panel.current?.contains(target))
        callback.current(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (
        event.key === 'Tab' &&
        panelRole === 'menu' &&
        panel.current?.contains(document.activeElement)
      ) {
        callback.current(false);
        anchor.current?.focus();
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        callback.current(false);
        anchor.current?.focus();
      }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    const resize = () => {
      inherit();
      place();
    };
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', place, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', place, true);
    };
  }, [expanded, mounted, panelRole]);
  const placed = position !== undefined;
  useEffect(() => {
    if (!expanded || !placed || !focusOnOpen) return;
    (
      panel.current?.querySelector<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]',
      ) ?? panel.current
    )?.focus();
  }, [expanded, placed, focusOnOpen]);
  return (
    <span className="dvy-popover-anchor">
      <button
        {...triggerProps}
        ref={anchor}
        type={triggerProps?.type ?? 'button'}
        disabled={disabled || triggerProps?.disabled}
        className={cx('dvy-button', triggerProps?.className)}
        data-variant="outline"
        data-size="md"
        aria-expanded={expanded}
        aria-haspopup={panelRole}
        aria-controls={expanded ? id : undefined}
        onClick={(event) => {
          triggerProps?.onClick?.(event);
          if (!event.defaultPrevented) setExpanded(!expanded);
        }}
      >
        {trigger ?? label}
      </button>
      {expanded &&
        mounted &&
        createPortal(
          <div
            {...props}
            id={id}
            role={panelRole}
            aria-label={label}
            tabIndex={-1}
            ref={(node) => {
              panel.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            className={cx('dvy-popover', className)}
            style={{
              ...appearance,
              ...style,
              position: 'fixed',
              left: position?.left ?? 8,
              top: position?.top ?? 8,
              visibility: position ? 'visible' : 'hidden',
            }}
          >
            {children}
          </div>,
          anchor.current?.closest('dialog[open]') ?? document.body,
        )}
    </span>
  );
});
