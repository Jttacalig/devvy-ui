import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';
import assert from 'node:assert/strict';
import { MAX_RESPONSE_BYTES } from '../src/content.mjs';

export function read(result) {
  assert.ok(Buffer.byteLength(JSON.stringify(result), 'utf8') <= MAX_RESPONSE_BYTES);
  const value = JSON.parse(result.content.find((item) => item.type === 'text').text);
  assert.deepEqual(result.structuredContent, value);
  return value;
}
export async function connected(run, built = false, modern = false) {
  const client = new Client(
    { name: 'devvy-integration-test', version: '1.0.0' },
    modern ? { versionNegotiation: { mode: { pin: '2026-07-28' } } } : {},
  );
  try {
    await client.connect(
      new StdioClientTransport({
        command: process.execPath,
        args: [
          fileURLToPath(
            new URL(built ? '../dist/server.mjs' : '../src/server.mjs', import.meta.url),
          ),
        ],
        stderr: 'pipe',
      }),
    );
    await run(client);
  } finally {
    await client.close();
  }
}
