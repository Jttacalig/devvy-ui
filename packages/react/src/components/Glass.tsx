'use client';

import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react';
import { resolveGlassQuality, type GlassQuality } from '@devvy-ui/core';
import { cx } from '../lib/cx';

export interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  enabled?: boolean;
  quality?: 'auto' | GlassQuality;
  theme?: 'light' | 'dark' | 'system';
}

/** Optional material scope. SSR starts opaque; auto enhancement happens only after hydration. */
export const Glass = forwardRef<HTMLDivElement, GlassProps>(function Glass(
  { enabled = true, quality = 'auto', theme, className, ...props },
  ref,
) {
  const [automaticQuality, setAutomaticQuality] = useState<GlassQuality>('reduced');
  useEffect(() => {
    if (!enabled || quality !== 'auto') return;
    const memory =
      'deviceMemory' in navigator && typeof navigator.deviceMemory === 'number'
        ? navigator.deviceMemory
        : undefined;
    const connection = 'connection' in navigator ? navigator.connection : undefined;
    const saveData =
      typeof connection === 'object' &&
      connection !== null &&
      'saveData' in connection &&
      connection.saveData === true;
    setAutomaticQuality(
      resolveGlassQuality({
        backdropFilter:
          typeof CSS !== 'undefined' &&
          (CSS.supports('backdrop-filter', 'blur(1px)') ||
            CSS.supports('-webkit-backdrop-filter', 'blur(1px)')),
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: memory,
        saveData,
      }),
    );
  }, [quality, enabled]);
  return (
    <div
      {...props}
      ref={ref}
      className={cx('dvy-glass', className)}
      data-devvy-material={enabled ? 'glass' : undefined}
      data-devvy-quality={enabled ? (quality === 'auto' ? automaticQuality : quality) : undefined}
      data-devvy-theme={theme}
    />
  );
});
