import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react';
export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  duration?: number;
  tone?: 'neutral' | 'danger';
}
export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { open, onOpenChange, message, duration = 5000, tone = 'neutral', children, className, ...props },
  ref,
) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!open || paused || duration <= 0 || document.hidden) return;
    const timeout = setTimeout(() => onOpenChange(false), duration);
    return () => clearTimeout(timeout);
  }, [open, paused, duration, onOpenChange, message]);
  useEffect(() => {
    const change = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  return (
    <div
      {...props}
      ref={ref}
      className={['dvy-toast', className].filter(Boolean).join(' ')}
      hidden={!open}
      data-tone={tone}
      onMouseEnter={(event) => {
        props.onMouseEnter?.(event);
        setPaused(true);
      }}
      onMouseLeave={(event) => {
        props.onMouseLeave?.(event);
        setPaused(false);
      }}
      onFocus={(event) => {
        props.onFocus?.(event);
        setPaused(true);
      }}
      onBlur={(event) => {
        props.onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div role={tone === 'danger' ? 'alert' : 'status'}>{open ? message : ''}</div>
      {children}
      <button type="button" aria-label="Dismiss notification" onClick={() => onOpenChange(false)}>
        ×
      </button>
    </div>
  );
});
