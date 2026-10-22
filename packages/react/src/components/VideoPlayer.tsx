import { forwardRef, type VideoHTMLAttributes, type ReactNode } from 'react';
import { safeURL } from '../lib/widgets';
export interface VideoPlayerProps extends VideoHTMLAttributes<HTMLVideoElement> {
  label: string;
  sources?: readonly { src: string; type: string }[];
  tracks?: readonly { src: string; srcLang: string; label: string; default?: boolean }[];
  transcript?: ReactNode;
}
export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(function VideoPlayer(
  { label, sources = [], tracks = [], transcript, src, poster, className, children, ...props },
  ref,
) {
  return (
    <figure className="dvy-media-player">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption -- Caption track elements are rendered from the tracks descriptors below; the rule only recognizes static direct children. */}
      <video
        {...props}
        ref={ref}
        aria-label={label}
        controls
        preload={props.preload ?? 'none'}
        src={src ? safeURL(src, true) : undefined}
        poster={poster ? safeURL(poster, true) : undefined}
        className={['dvy-video-player', className].filter(Boolean).join(' ')}
      >
        {sources.map((source) => (
          <source key={source.src} type={source.type} src={safeURL(source.src, true)} />
        ))}
        {tracks.map((track) => (
          <track key={track.srcLang} kind="captions" {...track} src={safeURL(track.src, true)} />
        ))}
        {children}
      </video>
      {transcript && <figcaption>{transcript}</figcaption>}
    </figure>
  );
});
