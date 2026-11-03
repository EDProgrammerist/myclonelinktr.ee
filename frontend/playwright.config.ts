import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  timeout: 20000,
  snapshotPathTemplate: '{testDir}/../artifacts/mobile-themes/before-{arg}{ext}',
  use: { baseURL: process.env.TEST_URL || 'http://127.0.0.1:5173', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium', channel: 'msedge' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  reporter: [['list'], ['json', { outputFile: 'artifacts/mobile-themes/tests.json' }]],
})

