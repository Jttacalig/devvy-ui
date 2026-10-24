import Image from 'next/image';
import { supportButtonImage, supportUrl } from '../lib/support';

/** Official rendered artwork avoids the embed's document.write during navigation. */
export function SupportButton({ className = '' }: { className?: string }) {
  return (
    <a
      className={`dvy-button dvy-support-button ${className}`}
      href={supportUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Buy me a coffee"
      title="Buy me a coffee"
    >
      <span className="dvy-support-button-fallback">Buy me a coffee</span>
      <Image
        src={supportButtonImage}
        alt=""
        aria-hidden="true"
        width={210}
        height={60}
        unoptimized
        className="dvy-support-button-art"
      />
      <svg
        className="dvy-support-button-compact"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="white"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 7h10l-1 14H8L7 7ZM5 4h14v3H5zM8 1h8v3H8z" />
      </svg>
    </a>
  );
}
