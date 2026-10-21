/** Merge optional class names without a runtime styling engine. */
export { resolveGlassQuality, type GlassQuality, type GlassCapabilities } from './glass';

export function cx(...values: Array<string | undefined | null | false>): string {
  return values.filter(Boolean).join(' ');
}

export interface NavigationOptions {
  key: string;
  currentIndex: number;
  disabled: readonly boolean[];
  orientation?: 'horizontal' | 'vertical';
  direction?: 'ltr' | 'rtl';
}

/** Return the next enabled index for a tab key, or undefined for an unrelated key. */
export function getNavigationIndex({
  key,
  currentIndex,
  disabled,
  orientation = 'horizontal',
  direction = 'ltr',
}: NavigationOptions): number | undefined {
  const enabled = disabled.flatMap((value, index) => (value ? [] : [index]));
  if (!enabled.length) return undefined;
  if (key === 'Home') return enabled[0];
  if (key === 'End') return enabled[enabled.length - 1];
  const forward =
    orientation === 'vertical' ? 'ArrowDown' : direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const backward =
    orientation === 'vertical' ? 'ArrowUp' : direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
  if (key !== forward && key !== backward) return undefined;
  const position = enabled.indexOf(currentIndex);
  return enabled[(position + (key === forward ? 1 : -1) + enabled.length) % enabled.length];
}
