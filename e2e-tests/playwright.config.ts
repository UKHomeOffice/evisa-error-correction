import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const testDir = defineBddConfig({
  features: ['features/**/*.feature'],
  steps: ['steps/**/*.ts'],
  outputDir: '.features-gen'
});

export default defineConfig({
  testDir,
  testMatch: /.*\.spec\.js/,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:8080',
    screenshot: 'on',
    video: 'on',
    trace: 'on-first-retry'
  }
});
