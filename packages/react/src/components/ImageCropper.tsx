import { forwardRef, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { safeURL } from '../lib/widgets';
export interface ImageCropperProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  onCrop: (blob: Blob) => void;
}
export const ImageCropper = forwardRef<HTMLDivElement, ImageCropperProps>(function ImageCropper(
  { src, alt, onCrop, className, ...props },
  ref,
) {
  const image = useRef<HTMLImageElement>(null),
    revision = useRef(0),
    [loaded, setLoaded] = useState(false),
    [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 }),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    revision.current++;
    setLoaded(!!image.current?.complete && !!image.current?.naturalWidth);
    setError('');
    setBusy(false);
    return () => {
      revision.current++;
    };
  }, [src]);
  const exportCrop = async () => {
    const node = image.current;
    if (!node || !loaded) return;
    const current = revision.current;
    setBusy(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round((node.naturalWidth * crop.width) / 100));
      canvas.height = Math.max(1, Math.round((node.naturalHeight * crop.height) / 100));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas export is unavailable.');
      context.drawImage(
        node,
        (node.naturalWidth * crop.x) / 100,
        (node.naturalHeight * crop.y) / 100,
        (node.naturalWidth * crop.width) / 100,
        (node.naturalHeight * crop.height) / 100,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (value) => (value ? resolve(value) : reject(new Error('Image export failed.'))),
          'image/png',
        ),
      );
      if (current === revision.current) {
        onCrop(blob);
        setError('Crop ready.');
      }
    } catch {
      if (current === revision.current)
        setError('Cannot export this image. Use a same-origin image or enable CORS on its server.');
    } finally {
      if (current === revision.current) setBusy(false);
    }
  };
  return (
    <div
      {...props}
      ref={ref}
      className={['dvy-image-cropper', className].filter(Boolean).join(' ')}
    >
      <div className="dvy-crop-image">
        <img
          ref={image}
          src={safeURL(src, true)}
          crossOrigin="anonymous"
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setError('Image could not be loaded.');
          }}
        />
        <span
          aria-hidden="true"
          className="dvy-crop-frame"
          style={{
            left: crop.x + '%',
            top: crop.y + '%',
            width: crop.width + '%',
            height: crop.height + '%',
          }}
        />
      </div>
      <fieldset>
        <legend>Crop area in percent</legend>
        {(['x', 'y', 'width', 'height'] as const).map((key) => (
          <label key={key}>
            {key}
            <input
              type="range"
              aria-label={'Crop ' + key}
              min={key === 'width' || key === 'height' ? 1 : 0}
              max={
                key === 'x'
                  ? 100 - crop.width
                  : key === 'y'
                    ? 100 - crop.height
                    : key === 'width'
                      ? 100 - crop.x
                      : 100 - crop.y
              }
              step={1}
              value={crop[key]}
              onChange={(e) => setCrop({ ...crop, [key]: e.target.valueAsNumber })}
            />
            <output>{crop[key]}%</output>
          </label>
        ))}
      </fieldset>
      <button type="button" className="dvy-button" disabled={!loaded || busy} onClick={exportCrop}>
        {busy ? 'Exporting…' : 'Export crop'}
      </button>
      <p role="status">{error}</p>
    </div>
  );
});
