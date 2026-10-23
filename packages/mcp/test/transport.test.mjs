import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { clearTimeout } from 'node:timers';

test('SDK malformed-line recovery and envelope validation preserve the next valid protocol exchange', async () => {
  const child = spawn(
    process.execPath,
    [fileURLToPath(new URL('../dist/server.mjs', import.meta.url))],
    { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true },
  );
  const lines = createInterface({ input: child.stdout });
  let stderr = '';
  const errorReported = new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('Malformed input was not reported on stderr')),
      10000,
    );
    child.stderr.once('data', () => {
      clearTimeout(timer);
      resolve();
    });
  });
  child.stderr.on('data', (chunk) => {
    stderr += chunk;
  });
  const pending = new Map();
  lines.on('line', (line) => {
    const message = JSON.parse(line);
    pending.get(message.id)?.(message);
  });
  function request(message) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('MCP wire response timed out')), 10000);
      pending.set(message.id, (response) => {
        clearTimeout(timeout);
        resolve(response);
      });
      child.stdin.write(JSON.stringify(message) + '\n');
    });
  }
  try {
    child.stdin.write('{malformed-json}\n');
    child.stdin.write('{"jsonrpc":"2.0","id":0,"method":42}\n');
    const init = await request({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-11-25',
        capabilities: {},
        clientInfo: { name: 'malformed-wire-test', version: '1.0.0' },
      },
    });
    assert.equal(init.result.serverInfo.name, 'devvy-ui');
    child.stdin.write(
      JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n',
    );
    const discovery = await request({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
    assert.equal(discovery.result.tools.length, 8);
    await errorReported;
    assert.match(stderr, /DEVVY MCP transport/);
  } finally {
    lines.close();
    child.stdin.end();
    child.kill();
  }
});
