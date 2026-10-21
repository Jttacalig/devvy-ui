'use client';

import { useId, type ReactNode, type SelectHTMLAttributes } from 'react';
import { InterfaceIcon } from './InterfaceIcon';

interface SelectControlProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hideLabel?: boolean;
  icon?: ReactNode;
  description?: string;
}

/** Native semantics and keyboard behavior, with progressive CSS picker styling. */
export function SelectControl({
  label,
  hideLabel,
  icon,
  description,
  id,
  className,
  children,
  ...props
}: SelectControlProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-help` : undefined;
  return (
    <div className="select-field">
      <label className={hideLabel ? 'sr-only' : 'select-label'} htmlFor={controlId}>
        {label}
      </label>
      <div className="select-shell" data-has-icon={icon ? '' : undefined}>
        {icon ? <span className="select-leading">{icon}</span> : null}
        <select
          {...props}
          id={controlId}
          aria-describedby={
            [props['aria-describedby'], descriptionId].filter(Boolean).join(' ') || undefined
          }
          className={['docs-select', className].filter(Boolean).join(' ')}
        >
          {children}
        </select>
        <span className="select-chevron">
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
