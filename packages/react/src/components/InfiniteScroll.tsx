import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
export interface InfiniteScrollProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  hasMore: boolean;
  onLoadMore: () => Promise<void> | void;
  loading?: boolean;
  automatic?: boolean;
}
export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(
  function InfiniteScroll(
    {
      label,
      hasMore,
      onLoadMore,
      loading = false,
      automatic = false,
      children,
      className,
      ...props
    },
    ref,
  ) {
    const [busy, setBusy] = useState(false),
      [error, setError] = useState(''),
      sentinel = useRef<HTMLDivElement>(null),
      pending = useRef(false),
      alive = useRef(true),
      load = useRef<() => void>(() => {});
    useEffect(() => {
      alive.current = true;
      return () => {
        alive.current = false;
      };
    }, []);
    const request = async () => {
      if (pending.current || loading || !hasMore) return;
      pending.current = true;
      setBusy(true);
      setError('');
      try {
        await onLoadMore();
      } catch {
        if (alive.current) setError('Could not load more. Try again.');
      } finally {
        pending.current = false;
        if (alive.current) setBusy(false);
      }
    };
    useEffect(() => {
      load.current = request;
    });
    useEffect(() => {
      if (!automatic || !hasMore || loading || typeof IntersectionObserver === 'undefined') return;
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) load.current();
      });
      if (sentinel.current) observer.observe(sentinel.current);
      return () => observer.disconnect();
    }, [automatic, hasMore, loading]);
    return (
      <div
        {...props}
        ref={ref}
        aria-label={label}
        aria-busy={busy || loading}
        className={['dvy-infinite-scroll', className].filter(Boolean).join(' ')}
      >
        {children}
        <div ref={sentinel} />
        <p role="status">{error || (!hasMore ? 'All items loaded.' : '')}</p>
        {hasMore && (
          <button
            type="button"
            className="dvy-button"
            disabled={busy || loading}
            onClick={() => load.current()}
          >
            {busy || loading ? 'Loading…' : error ? 'Retry loading' : 'Load more'}
          </button>
        )}
      </div>
    );
  },
);
