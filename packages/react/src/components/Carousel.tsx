import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { useValue } from '../lib/widgets';
export interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  label: string;
  slides: readonly ReactNode[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
}
export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { label, slides, value, defaultValue = 0, onValueChange, className, ...props },
  ref,
) {
  const [raw, setIndex] = useValue(value, defaultValue, onValueChange),
    index = Number.isFinite(raw) ? Math.max(0, Math.min(slides.length - 1, Math.floor(raw))) : 0,
    id = useId();
  return (
    <div
      {...props}
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={['dvy-carousel', className].filter(Boolean).join(' ')}
    >
      <div id={id}>
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={i + 1 + ' of ' + slides.length}
            hidden={i !== index}
          >
            {slide}
          </div>
        ))}
        {!slides.length && <p>No slides available.</p>}
      </div>
      <div className="dvy-carousel-controls">
        <button
          type="button"
          aria-controls={id}
          disabled={slides.length < 2}
          onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
        >
          Previous slide
        </button>
        <span role="status" aria-live="polite">
          {slides.length ? index + 1 : 0} / {slides.length}
        </span>
        <button
          type="button"
          aria-controls={id}
          disabled={slides.length < 2}
          onClick={() => setIndex((index + 1) % slides.length)}
        >
          Next slide
        </button>
      </div>
    </div>
  );
});
