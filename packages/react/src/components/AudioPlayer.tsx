import { forwardRef, type AudioHTMLAttributes, type ReactNode } from 'react';
import { safeURL } from '../lib/widgets';
export interface AudioPlayerProps extends AudioHTMLAttributes<HTMLAudioElement> {
  label: string;
  transcript: ReactNode;
}
export const AudioPlayer = forwardRef<HTMLAudioElement, AudioPlayerProps>(function AudioPlayer(
  { label, transcript, src, className, children, ...props },
  ref,
) {
  return (
    <figure className="dvy-media-player">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- Native audio has a required visible transcript; audio caption tracks do not provide the transcript UI. */}
      <audio
        {...props}
        ref={ref}
        aria-label={label}
        controls
        preload={props.preload ?? 'metadata'}
        src={src ? safeURL(src, true) : undefined}
        className={['dvy-audio-player', className].filter(Boolean).join(' ')}
      >
        {children}
      </audio>
      {transcript && <figcaption>{transcript}</figcaption>}
    </figure>
  );
});
