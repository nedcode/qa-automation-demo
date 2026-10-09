import { defineConfig } from '@playwright/test';

/**
 * API-only configuration: no browser is started, tests talk HTTP directly.
 * BASE_URL can point the same suite at another environment (e.g. staging).
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Retries only in CI, and every retry is visible in the report: a test that
  // needs a retry is a flaky test to be fixed, not hidden.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: process.env.BASE_URL ?? 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
  projects: [{ name: 'api', testMatch: /api\/.*\.spec\.ts/ }],
});
