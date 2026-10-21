import { defineConfig, devices } from '@playwright/test';
const port = Number(process.env.DEVVY_DOCS_PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error('DEVVY_DOCS_PORT must be a valid TCP port.');
const baseURL = `http://127.0.0.1:${port}`;
export default defineConfig({
  testDir: './tests/browser',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: '.artifacts/browser-results.json' }],
  ],
  use: { baseURL, trace: 'retain-on-failure' },
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
