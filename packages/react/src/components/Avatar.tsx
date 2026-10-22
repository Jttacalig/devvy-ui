import { forwardRef, useState, type HTMLAttributes, type ImgHTMLAttributes } from 'react';
import { cx } from '../lib/cx';
export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>;
}
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'md', shape = 'circle', imageProps, className, ...props },
  ref,
) {
  const [failed, setFailed] = useState<string>();
  const initials =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => Array.from(part)[0])
      .join('')
      .toLocaleUpperCase() || '?';
  return (
    <span
      role="img"
      aria-label={name.trim() || 'Unknown person'}
      {...props}
      ref={ref}
      className={cx('dvy-avatar', className)}
      data-size={size}
      data-shape={shape}
    >
      {src && src !== failed ? (
        <img
          loading="lazy"
          decoding="async"
          {...imageProps}
          src={src}
          alt=""
          onError={(event) => {
            setFailed(src);
            imageProps?.onError?.(event);
          }}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
});
