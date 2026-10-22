import { createElement, forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'blockquote' | 'code';
  variant?: 'display' | 'heading' | 'body' | 'small' | 'code';
  tone?: 'default' | 'muted' | 'brand' | 'danger';
}
export const Typography = forwardRef<HTMLElement, TypographyProps>(function Typography(
  { as = 'p', variant = 'body', tone = 'default', className, ...props },
  ref,
) {
  return createElement(as, {
    ...props,
    ref,
    className: cx('dvy-typography', className),
    'data-variant': variant,
    'data-tone': tone,
  });
});
