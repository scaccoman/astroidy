import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    browserName: 'chromium',
  },
  webServer: {
    command: 'pnpm run dev',
    port: 3000,
    timeout: 120 * 1000,
  },
};

export default config;
