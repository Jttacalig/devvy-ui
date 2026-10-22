import { forwardRef, useEffect, useRef, useState } from 'react';
import { Popover, type PopoverProps } from './Popover';
import { useValue } from '../lib/widgets';
export interface HoverCardProps extends PopoverProps {
  delay?: number;
}
export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  { delay = 500, open, defaultOpen = false, onOpenChange, triggerProps, ...props },
  ref,
) {
  const [expanded, setExpanded] = useValue(open, defaultOpen, onOpenChange);
  const [interactive, setInteractive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <Popover
      {...props}
      ref={ref}
      open={expanded}
      onOpenChange={(value) => {
        setExpanded(value);
        if (!value) setInteractive(false);
      }}
      focusOnOpen={interactive}
      className={['dvy-hover-card', props.className].filter(Boolean).join(' ')}
      triggerProps={{
        ...triggerProps,
        onClick: (event) => {
          triggerProps?.onClick?.(event);
          clearTimeout(timer.current);
          if (!event.defaultPrevented) {
            setInteractive(true);
            if (expanded && !interactive) event.preventDefault();
          }
        },
        onMouseEnter: (event) => {
          triggerProps?.onMouseEnter?.(event);
          clearTimeout(timer.current);
          if (interactive) return;
          timer.current = setTimeout(
            () => {
              setInteractive(false);
              setExpanded(true);
            },
            Math.max(0, delay),
          );
        },
        onMouseLeave: (event) => {
          triggerProps?.onMouseLeave?.(event);
          clearTimeout(timer.current);
          if (interactive) return;
          timer.current = setTimeout(() => setExpanded(false), 200);
        },
      }}
      onMouseEnter={(event) => {
        props.onMouseEnter?.(event);
        clearTimeout(timer.current);
      }}
      onMouseLeave={(event) => {
        props.onMouseLeave?.(event);
        clearTimeout(timer.current);
        if (!interactive && !event.currentTarget.contains(document.activeElement))
          timer.current = setTimeout(() => setExpanded(false), 200);
      }}
    />
  );
});
