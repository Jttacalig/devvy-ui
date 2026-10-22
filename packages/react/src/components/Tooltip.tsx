import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../lib/cx';
export interface TooltipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'content'> {
  content: ReactNode;
  delay?: number;
}
export const Tooltip = forwardRef<HTMLButtonElement, TooltipProps>(function Tooltip(
  {
    content,
    delay = 300,
    children,
    className,
    onFocus,
    onBlur,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    ...props
  },
  ref,
) {
  const [open, setOpen] = useState(false),
    id = useId(),
    timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const anchor = useRef<HTMLSpanElement>(null),
    tooltip = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<{ left: number; top: number }>();
  const show = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), Math.max(0, delay));
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 150);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return;
    const place = () => {
      const a = anchor.current?.getBoundingClientRect(),
        tip = tooltip.current?.getBoundingClientRect();
      if (!a || !tip) return;
      setPosition({
        left: Math.max(8, Math.min(a.left, innerWidth - tip.width - 8)) - a.left,
        top: a.bottom + tip.height + 8 <= innerHeight ? a.height + 8 : -tip.height - 8,
      });
    };
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);
  return (
    <span ref={anchor} className="dvy-tooltip-anchor" onMouseEnter={show} onMouseLeave={hide}>
      <button
        {...props}
        type={props.type ?? 'button'}
        ref={ref}
        className={cx('dvy-tooltip-trigger', className)}
        aria-describedby={
          [props['aria-describedby'], open ? id : undefined].filter(Boolean).join(' ') || undefined
        }
        onFocus={(event) => {
          onFocus?.(event);
          show();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          hide();
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.key === 'Escape') {
            event.preventDefault();
            clearTimeout(timer.current);
            setOpen(false);
          }
        }}
      >
        {children}
      </button>
      <span
        ref={tooltip}
        role="tooltip"
        id={id}
        hidden={!open}
        className="dvy-tooltip"
        style={
          position ? { ...position, insetInlineStart: 'auto', insetBlockStart: 'auto' } : undefined
        }
      >
        {content}
      </span>
    </span>
  );
});
