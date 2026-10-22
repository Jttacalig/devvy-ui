import { forwardRef, type HTMLAttributes } from 'react';
import { safeURL } from '../lib/widgets';
export interface StepperProps extends HTMLAttributes<HTMLElement> {
  label: string;
  steps: readonly {
    id: string;
    label: string;
    description?: string;
    href?: string;
    disabled?: boolean;
  }[];
  current: number;
  onStepChange?: (index: number) => void;
}
export const Stepper = forwardRef<HTMLElement, StepperProps>(function Stepper(
  { label, steps, current, onStepChange, className, ...props },
  ref,
) {
  return (
    <nav
      {...props}
      ref={ref}
      aria-label={label}
      className={['dvy-stepper', className].filter(Boolean).join(' ')}
    >
      <ol>
        {steps.map((step, i) => (
          <li
            key={step.id}
            data-complete={i < current}
            aria-current={i === current ? 'step' : undefined}
          >
            {step.href && !step.disabled ? (
              <a href={safeURL(step.href)}>{step.label}</a>
            ) : onStepChange ? (
              <button type="button" disabled={step.disabled} onClick={() => onStepChange(i)}>
                {step.label}
              </button>
            ) : (
              <span>{step.label}</span>
            )}
            {step.description && <small>{step.description}</small>}
          </li>
        ))}
      </ol>
    </nav>
  );
});
