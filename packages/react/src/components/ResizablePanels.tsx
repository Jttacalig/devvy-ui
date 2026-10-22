/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- The ARIA window-splitter pattern requires a focusable separator with range values and keyboard/pointer handling. */
import { forwardRef, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useValue } from '../lib/widgets';
export interface ResizablePanelsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  label: string;
  children: readonly [ReactNode, ReactNode];
  value?: number;
  defaultValue?: number;
  onValueChange?: (percent: number) => void;
  min?: number;
  max?: number;
  orientation?: 'horizontal' | 'vertical';
}
export const ResizablePanels = forwardRef<HTMLDivElement, ResizablePanelsProps>(
  function ResizablePanels(
    {
      label,
      children,
      value,
      defaultValue = 50,
      onValueChange,
      min = 10,
      max = 90,
      orientation = 'horizontal',
      className,
      ...props
    },
    ref,
  ) {
    const [raw, setRaw] = useValue(value, defaultValue, onValueChange),
      root = useRef<HTMLDivElement>(null);
    const lower = Math.max(0, Math.min(99, Number.isFinite(min) ? min : 10)),
      upper = Math.max(lower + 1, Math.min(100, Number.isFinite(max) ? max : 90)),
      percent = Math.max(lower, Math.min(upper, Number.isFinite(raw) ? raw : 50));
    const update = (next: number) => setRaw(Math.max(lower, Math.min(upper, next)));
    return (
      <div
        {...props}
        ref={(node) => {
          root.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={['dvy-resizable-panels', className].filter(Boolean).join(' ')}
        data-orientation={orientation}
      >
        <div style={{ flexBasis: percent + '%' }}>{children[0]}</div>
        <div
          role="separator"
          tabIndex={0}
          aria-label={label}
          aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
          aria-valuemin={lower}
          aria-valuemax={upper}
          aria-valuenow={Math.round(percent)}
          className="dvy-resize-handle"
          onKeyDown={(event) => {
            const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
            const forward =
                orientation === 'vertical' ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight',
              back = orientation === 'vertical' ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft';
            if ([forward, back, 'Home', 'End'].includes(event.key)) {
              event.preventDefault();
              update(
                event.key === 'Home'
                  ? lower
                  : event.key === 'End'
                    ? upper
                    : percent + (event.key === forward ? 1 : -1) * (event.shiftKey ? 10 : 1),
              );
            }
          }}
          onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            const bounds = root.current!.getBoundingClientRect(),
              rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
            const ratio =
              orientation === 'vertical'
                ? (event.clientY - bounds.top) / bounds.height
                : rtl
                  ? (bounds.right - event.clientX) / bounds.width
                  : (event.clientX - bounds.left) / bounds.width;
            update(ratio * 100);
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.releasePointerCapture(event.pointerId);
          }}
        />
        <div>{children[1]}</div>
      </div>
    );
  },
);
