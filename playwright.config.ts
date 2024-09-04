import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

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
    retries: 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    //   reporter: 'html',
    reporter: [['html', { open: 'never' }], ['list']],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        // Timout for each action e.g. clicks and hover
        actionTimeout: 10000,
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

        /* Collect video when retrying the failed test. See https://playwright.dev/docs/videos */
        video: 'retain-on-failure',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'retain-on-failure'
    },

    /* Configure projects for major browsers */
    projects: [
        // {
        //     name: 'chromium',
        //     use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } }
        // }

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
        {
            name: 'Google Chrome',
            use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1280, height: 900 } }
        },
        /* This is to prevent the scripts from accidentally being ran. Please read apis/scripts/README.md for instructions */
        process.env.SCRIPT
            ? {
                  name: 'scripts',
                  testDir: './apis/scripts',
                  testMatch: /.*.spec.ts/
              }
            : {
                  name: 'ignoreAllTest',
                  testIgnore: '*.spec.ts'
              }
    ]

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
