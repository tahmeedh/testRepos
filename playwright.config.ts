import { defineConfig, devices } from '@playwright/test';

let baseUrl;
export const smThrift = { host: null, port: 7443 };
export const companyPrefixName = 'portal';

switch (process.env.SERVER) {
    case 'prod':
        baseUrl = 'https://portal.globalrelay.com';
        smThrift.host = null; // Don't use SM thrift on PROD environment!!!
        break;
    case 'stg1':
        baseUrl = 'https://portalstg1.globalrelay.com';
        smThrift.host = null; // Don't use SM thrift on PROD environment!!!
        break;
    case 'cpci1':
        baseUrl = 'https://lb-portal-cpci1-nvan.dev-globalrelay.net';
        smThrift.host = 'lb-sm-cpci1-nvan.dev-globalrelay.net';
        break;
    case 'local':
        baseUrl = 'https://portal.dev-globalrelay.net';
        smThrift.host = 'lb-sm-cpqa2-nvan.dev-globalrelay.net';
        break;
    case 'cpqa1':
        baseUrl = 'https://cpqa1portal.dev-globalrelay.net';
        smThrift.host = 'lb-sm-cpqa1-nvan.dev-globalrelay.net';
        break;
    case 'cpqa2':
        baseUrl = 'https://cpqa2portal.dev-globalrelay.net';
        smThrift.host = 'lb-sm-cpqa2-nvan.dev-globalrelay.net';
        break;
    case 'cpqa2-pd1':
        baseUrl = 'https://lb3-portal-cpqa2-nvan.dev-globalrelay.net';
        smThrift.host = 'lb-sm-cpqa2-nvan.dev-globalrelay.net';
        break;
    case 'cpqa2-pd2':
        baseUrl = 'https://lb4-portal-cpqa2-nvan.dev-globalrelay.net';
        smThrift.host = 'lb-sm-cpqa2-nvan.dev-globalrelay.net';
        break;
    case 'cpqa2-va1':
        baseUrl = 'https://lb7-portal-cpqa2-nvan.dev-globalrelay.net';
        smThrift.host = 'lb-sm-cpqa2-nvan.dev-globalrelay.net';
        break;
    case 'cpqa2-ca1':
        baseUrl = 'https://lb9-portal-cpqa2-nvan.dev-globalrelay.net';
        smThrift.host = 'lb-sm-cpqa2-nvan.dev-globalrelay.net';
        break;
    case 'cpqa2-sq1':
        baseUrl = 'https://lb8-portal-cpqa2-nvan.dev-globalrelay.net';
        smThrift.host = 'lb-sm-cpqa2-nvan.dev-globalrelay.net';
        break;
    case 'mbsnap2-at':
        baseUrl = 'https://lb2-portal-mbsnap2-nvan.dev-globalrelay.net';
        smThrift.host = 'lb-sm-mbsnap2-nvan.dev-globalrelay.net';
        break;
    case 'mbsnap2':
    default:
        process.env.SERVER = 'mbsnap2';
        baseUrl = 'https://lb-portal-mbsnap2-nvan.dev-globalrelay.net';
        smThrift.host = 'lb-sm-mbsnap2-nvan.dev-globalrelay.net';
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

export const baseURL = baseUrl;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    // Timeout for each test, includes test, hooks and fixtures:
    timeout: 180000,
    // Timeout for each assertion:
    expect: { timeout: 10000 },

    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    //   reporter: 'html',
    reporter: [['html', { open: 'never' }], ['list']],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

        /* Collect video when retrying the failed test. See https://playwright.dev/docs/videos */
        video: 'retain-on-failure',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry'
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } }
        }

        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ]

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
