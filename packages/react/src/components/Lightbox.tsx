import { forwardRef, useState } from 'react';
import { Dialog, type DialogProps } from './Dialog';
import { safeURL, useValue } from '../lib/widgets';
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}
export interface LightboxProps extends Omit<DialogProps, 'title' | 'children'> {
  images: readonly GalleryImage[];
  index?: number;
  onIndexChange?: (index: number) => void;
}
export const Lightbox = forwardRef<HTMLDialogElement, LightboxProps>(function Lightbox(
  { images, index, onIndexChange, ...props },
  ref,
) {
  const [raw, setIndex] = useValue(index, 0, onIndexChange),
    [zoom, setZoom] = useState(100),
    [failed, setFailed] = useState(''),
    active = Math.max(0, Math.min(images.length - 1, raw)),
    image = images[active],
    src = image ? safeURL(image.src, true) : undefined;
  return (
    <Dialog
      {...props}
      ref={ref}
      title={image ? 'Image ' + (active + 1) + ' of ' + images.length : 'No images'}
      className={['dvy-lightbox', props.className].filter(Boolean).join(' ')}
    >
      {image && (
        <>
          <div
            className="dvy-lightbox-image"
            tabIndex={0}
            role="region"
            aria-label="Zoomable image"
          >
            {src && failed !== image.src ? (
              <img
                src={src}
                alt={image.alt}
                style={{ width: zoom + '%', maxWidth: 'none' }}
                onError={() => setFailed(image.src)}
              />
            ) : (
              <p>Image unavailable. {image.alt}</p>
            )}
          </div>
          {image.caption && <p>{image.caption}</p>}
          <label>
            Image zoom
            <input
              type="range"
              min={100}
              max={200}
              step={10}
              value={zoom}
              onChange={(e) => setZoom(e.target.valueAsNumber)}
            />
          </label>
          <div className="dvy-dialog-actions">
            <button
              type="button"
              disabled={images.length < 2}
              onClick={() => {
                setZoom(100);
                setIndex((active - 1 + images.length) % images.length);
              }}
            >
              Previous image
            </button>
            <button
              type="button"
              disabled={images.length < 2}
              onClick={() => {
                setZoom(100);
                setIndex((active + 1) % images.length);
              }}
            >
              Next image
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
});
