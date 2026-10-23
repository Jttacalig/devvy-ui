'use client';

import { useId, type ReactNode } from 'react';
import { Select, type SelectProps } from '@devvy-ui/react/select';
import { InterfaceIcon } from './InterfaceIcon';

interface SelectControlProps extends SelectProps {
  label: string;
  hideLabel?: boolean;
  icon?: ReactNode;
  description?: string;
  layout?: 'stacked' | 'inline';
}

/** Native semantics and keyboard behavior, with progressive CSS picker styling. */
export function SelectControl({
  label,
  hideLabel,
  icon,
  description,
  layout = 'stacked',
  id,
  className,
  children,
  ...props
}: SelectControlProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-help` : undefined;
  return (
    <div className="select-field" data-layout={layout}>
      <label className={hideLabel ? 'sr-only' : 'select-label'} htmlFor={controlId}>
        {label}
      </label>
      <div className="select-shell" data-has-icon={icon ? '' : undefined}>
        {icon ? (
          <span className="select-leading" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <Select
          {...props}
          id={controlId}
          aria-describedby={
            [props['aria-describedby'], descriptionId].filter(Boolean).join(' ') || undefined
          }
          className={['docs-select', className].filter(Boolean).join(' ')}
        >
          {children}
        </Select>
        <span className="select-chevron" aria-hidden="true">
          <InterfaceIcon name="chevron" />
        </span>
      </div>
      {description ? (
        <p id={descriptionId} className="select-description">
          {description}
        </p>
      ) : null}
    </div>
  );
}
