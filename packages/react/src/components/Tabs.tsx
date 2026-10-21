'use client';

import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { getNavigationIndex } from '@devvy-ui/core';
import { cx } from '../lib/cx';

export interface TabItem {
  /** Unique and stable within this Tabs instance. */
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'defaultValue' | 'onChange'> {
  items: readonly TabItem[];
  /** Accessible name of the tab list. */
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  dir?: 'ltr' | 'rtl';
}

/** Local-content tabs: panels stay mounted, preserving their form state. */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    items,
    label,
    value,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    activationMode = 'automatic',
    dir = 'ltr',
    className,
    ...props
  },
  ref,
) {
  const id = useId();
  const [internal, setInternal] = useState(defaultValue);
  const [focused, setFocused] = useState<string>();
  const requested = value === undefined ? internal : value;
  const selected =
    items.find((item) => item.value === requested && !item.disabled)?.value ??
    items.find((item) => !item.disabled)?.value;
  const tabbable =
    items.find((item) => item.value === focused && !item.disabled)?.value ?? selected;
  const itemId = (kind: string, itemValue: string) =>
    `${id}-${kind}-${encodeURIComponent(itemValue)}`;
  function select(next: string) {
    if (value === undefined) setInternal(next);
    if (next !== selected) onValueChange?.(next);
  }
  return (
    <div
      {...props}
      ref={ref}
      dir={dir}
      className={cx('dvy-tabs', className)}
      data-orientation={orientation}
    >
      <div
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        className="dvy-tab-list"
      >
        {items.map((item, index) => (
          <button
            key={item.value}
            type="button"
            role="tab"
            id={itemId('tab', item.value)}
            aria-controls={itemId('panel', item.value)}
            aria-selected={selected === item.value}
            disabled={item.disabled}
            tabIndex={tabbable === item.value ? 0 : -1}
            className="dvy-tab"
            onFocus={() => setFocused(item.value)}
            onClick={() => select(item.value)}
            onKeyDown={(event) => {
              const next = getNavigationIndex({
                key: event.key,
                currentIndex: index,
                disabled: items.map((tab) => !!tab.disabled),
                orientation,
                direction: dir,
              });
              if (next === undefined) return;
              event.preventDefault();
              event.currentTarget.parentElement
                ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
                .item(next)
                ?.focus();
              if (activationMode === 'automatic') select(items[next].value);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          role="tabpanel"
          id={itemId('panel', item.value)}
          aria-labelledby={itemId('tab', item.value)}
          hidden={selected !== item.value}
          tabIndex={0}
          className="dvy-tab-panel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
});
