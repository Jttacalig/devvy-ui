import { forwardRef, useId, type HTMLAttributes } from 'react';
import { Spinner } from './Spinner';
export interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  loading: boolean;
  label?: string;
}
export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  function LoadingOverlay(
    { loading, label = 'Loading content', children, className, ...props },
    ref,
  ) {
    const id = useId();
    return (
      <div
        {...props}
        ref={ref}
        aria-busy={loading}
        className={['dvy-loading-overlay', className].filter(Boolean).join(' ')}
      >
        <div>{children}</div>
        {loading && (
          <div className="dvy-loading-layer">
            <Spinner decorative />
            <span id={id} role="status">
              {label}
            </span>
          </div>
        )}
      </div>
    );
  },
);
