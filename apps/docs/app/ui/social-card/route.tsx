import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getPublishedRelease } from '../../../lib/published-release';

export const revalidate = 300;

export async function GET() {
  const [{ label }, logo] = await Promise.all([
    getPublishedRelease(),
    readFile(resolve(process.cwd(), 'public/devvy-logo.png')),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: '#f5faf6',
          color: '#16261d',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* The original project logo is embedded locally; no remote asset request. */}
          <img
            src={`data:image/png;base64,${logo.toString('base64')}`}
            alt=""
            width={64}
            height={64}
          />
          <span style={{ fontSize: 42, fontWeight: 700 }}>devvy ui</span>
          <span style={{ marginLeft: 'auto', fontSize: 24, color: '#176b4b' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: '-2px' }}>
            100 React components.
          </div>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: '-2px', color: '#176b4b' }}>
            Every detail yours.
          </div>
          <div style={{ fontSize: 26, marginTop: 14 }}>
            TypeScript · Custom themes · Optional Glass · MIT source
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 22,
            color: '#506256',
          }}
        >
          <span>By DEV STATION</span>
          <span>devvy-ui.dev-station.dev/ui</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
