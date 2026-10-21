import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../lib/cx';

type DivProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, DivProps>(function Card(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('dvy-card', className)} {...props} />;
});
export const CardHeader = forwardRef<HTMLDivElement, DivProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('dvy-card-header', className)} {...props} />;
});
export const CardContent = forwardRef<HTMLDivElement, DivProps>(function CardContent(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('dvy-card-content', className)} {...props} />;
});
export const CardFooter = forwardRef<HTMLDivElement, DivProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cx('dvy-card-footer', className)} {...props} />;
});
export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function CardTitle({ className, children, ...props }, ref) {
    return (
      <h3 ref={ref} className={cx('dvy-card-title', className)} {...props}>
        {children}
      </h3>
    );
  },
);
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(function CardDescription({ className, ...props }, ref) {
  return <p ref={ref} className={cx('dvy-card-description', className)} {...props} />;
});
