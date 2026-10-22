import { forwardRef, useRef, useState, type HTMLAttributes } from 'react';
import { Lightbox, type GalleryImage } from './Lightbox';
import { safeURL } from '../lib/widgets';
export interface GalleryProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  images: readonly GalleryImage[];
}
export const Gallery = forwardRef<HTMLDivElement, GalleryProps>(function Gallery(
  { label, images, className, ...props },
  ref,
) {
  const [open, setOpen] = useState(false),
    [index, setIndex] = useState(0),
    invoker = useRef<HTMLButtonElement>(null);
  return (
    <div {...props} ref={ref} className={['dvy-gallery', className].filter(Boolean).join(' ')}>
      <ul aria-label={label}>
        {images.map((image, i) => (
          <li key={image.id}>
            <button
              type="button"
              aria-label={'Open ' + image.alt + (image.caption ? ' ' + image.caption : '')}
              onClick={(event) => {
                invoker.current = event.currentTarget;
                setIndex(i);
                setOpen(true);
              }}
            >
              <img src={safeURL(image.src, true)} alt={image.alt} loading="lazy" />
              {image.caption && <span>{image.caption}</span>}
            </button>
          </li>
        ))}
      </ul>
      {!images.length && <p>No images available.</p>}
      <Lightbox
        open={open}
        onOpenChange={setOpen}
        images={images}
        index={index}
        onIndexChange={setIndex}
        returnFocusRef={invoker}
      />
    </div>
  );
});
