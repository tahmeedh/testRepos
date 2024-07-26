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
    globalSetup: require.resolve('./global-setup'),
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
    retries: process.env.CI ? 1 : undefined,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [['html', { open: 'never' }], ['list'], ['allure-playwright']],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        // Timout for each action e.g. clicks and hover
        actionTimeout: 10000,
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

        /* Collect video when retrying the failed test. See https://playwright.dev/docs/videos */
        video: 'retain-on-failure',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on'
    },

    /* Configure projects for major browsers */
    projects: [
        // {
        //     name: 'chromium',
        //     use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } }
        // }
        {
            name: 'E2E tests',
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
});
