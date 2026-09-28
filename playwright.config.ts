import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const port = Number(process.env.PLAYWRIGHT_PORT || 8080);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${port}`;

const testDir = defineBddConfig({
  features: 'e2e-tests/features/**/*.feature',
  steps: [
    'e2e-tests/steps/**/*.step.ts',
    'e2e-tests/fixture/fixtures.ts'
  ],
  outputDir: '.features-gen'
});

export default defineConfig({
  testDir,
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    viewport: null,
    screenshot: 'on',
    video: 'on',
    trace: 'on-first-retry',
    headless: !!process.env.CI
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
      command: 'yarn start',
      port,
      env: {
        ...process.env,
        NODE_ENV: 'test'
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    }
  ]
});