import { useEffect, useRef, useState, type RefObject } from 'react';
export function useValue<T>(
  value: T | undefined,
  initial: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [local, setLocal] = useState(initial);
  return [
    value === undefined ? local : value,
    (next) => {
      if (value === undefined) setLocal(next);
      onChange?.(next);
    },
  ];
}
export function useReset(ref: RefObject<HTMLElement | null>, reset: () => void) {
  const latest = useRef(reset);
  useEffect(() => {
    latest.current = reset;
  });
  useEffect(() => {
    const node = ref.current;
    const form = (node as HTMLInputElement | null)?.form ?? node?.closest('form');
    const pending = new Set<ReturnType<typeof setTimeout>>();
    // Wait for all reset listeners, including later native and React listeners, to cancel.
    const handle = (event: Event) => {
      const timer = setTimeout(() => {
        pending.delete(timer);
        if (!event.defaultPrevented) latest.current();
      }, 0);
      pending.add(timer);
    };
    form?.addEventListener('reset', handle);
    return () => {
      for (const timer of pending) clearTimeout(timer);
      form?.removeEventListener('reset', handle);
    };
  }, [ref]);
}
export function safeURL(value: string, image = false): string | undefined {
  const url = Array.from(value.trim())
    .filter((char) => char.charCodeAt(0) > 32 && char.charCodeAt(0) !== 127)
    .join('');
  if (!url || url.startsWith('//')) return undefined;
  if (/^[a-z][a-z0-9+.-]*:/i.test(url))
    return /^(https?:|blob:)/i.test(url) || (!image && /^(mailto:|tel:)/i.test(url))
      ? url
      : undefined;
  return url;
}
export function moveItem<T>(items: readonly T[], from: number, to: number): T[] {
  const next = [...items];
  if (from < 0 || to < 0 || from >= next.length || to >= next.length) return next;
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00Z');
  return !Number.isNaN(+date) && date.toISOString().slice(0, 10) === value;
}
export function dateShift(value: string, days: number): string {
  const date = new Date(value + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split('T')[0];
}
