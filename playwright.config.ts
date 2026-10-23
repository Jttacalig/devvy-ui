import { defineConfig, devices } from '@playwright/test';
const port = Number(process.env.DEVVY_DOCS_PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error('DEVVY_DOCS_PORT must be a valid TCP port.');
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: './tests/browser',
  timeout: 60000,
  globalTimeout: process.env.CI ? 12 * 60 * 1000 : undefined,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [
    ['list'],
    process.env.CI ? ['blob'] : ['html', { open: 'never' }],
    ['json', { outputFile: '.artifacts/browser-results.json' }],
  ],
  use: {
    baseURL,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: `pnpm --filter devvy-ui-docs start --port ${port}`,
    url: `${baseURL}/ui`,
    reuseExistingServer: process.env.DEVVY_REUSE_DOCS_SERVER === '1' && !process.env.CI,
    timeout: 120000,
  },
});
