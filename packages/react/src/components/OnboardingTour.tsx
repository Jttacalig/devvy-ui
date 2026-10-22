import { forwardRef, useEffect, useState } from 'react';
import { Dialog, type DialogProps } from './Dialog';
export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetId?: string;
}
export interface OnboardingTourProps
  extends Omit<DialogProps, 'title' | 'description' | 'children'> {
  steps: readonly TourStep[];
  onComplete?: () => void;
}
export const OnboardingTour = forwardRef<HTMLDialogElement, OnboardingTourProps>(
  function OnboardingTour({ steps, onComplete, ...props }, ref) {
    const [index, setIndex] = useState(0),
      step = steps[Math.min(index, steps.length - 1)];
    useEffect(() => {
      if (!props.open) {
        setIndex(0);
        return;
      }
      const target = step?.targetId ? document.getElementById(step.targetId) : null;
      target?.classList.add('dvy-tour-target');
      target?.scrollIntoView({ block: 'center', behavior: 'auto' });
      return () => target?.classList.remove('dvy-tour-target');
    }, [props.open, step?.targetId]);
    if (!step) return null;
    return (
      <Dialog
        {...props}
        ref={ref}
        title={step.title}
        description={step.description}
        className={['dvy-tour', props.className].filter(Boolean).join(' ')}
      >
        <p role="status">
          Step {index + 1} of {steps.length}
        </p>
        <div className="dvy-dialog-actions">
          <button
            type="button"
            className="dvy-button"
            data-variant="outline"
            onClick={() => props.onOpenChange(false)}
          >
            Skip tour
          </button>
          <button
            type="button"
            className="dvy-button"
            data-variant="outline"
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
          >
            Back
          </button>
          <button
            type="button"
            className="dvy-button"
            onClick={() => {
              if (index + 1 >= steps.length) {
                props.onOpenChange(false);
                onComplete?.();
              } else setIndex((i) => i + 1);
            }}
          >
            {index + 1 >= steps.length ? 'Finish' : 'Next'}
          </button>
        </div>
      </Dialog>
    );
  },
);
