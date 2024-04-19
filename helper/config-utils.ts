import { Browser } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { CHAT_CONFIG_URLS, MESSAGE_HUB_CONFIG_URLS } from 'Constants/fe-config-urls';

export class ConfigUtils {
    static verifyServerName(serverName: string) {
        let matchFound: boolean;

        switch (serverName) {
            case 'local':
            case 'cpqa2':
            case 'cpqa2-pd1':
            case 'cpqa2-pd2':
            case 'cpqa2-va1':
            case 'cpqa2-ca1':
            case 'cpqa2-sq1':
            case 'cpqa1':
            case 'prod':
            case 'stg1':
                matchFound = true;
                break;
            default:
                matchFound = false;
                break;
        }

        if (!matchFound) {
            const error = new Error();
            Log.error(
                `FAILURE: Process.env.SERVER '${serverName}' is not valid. Unable to find portal config URL.`,
                error
            );
            throw error;
        }
    }

    static async getFeConfigs(browser: Browser, configUrl: string) {
        const browserContext = await browser.newContext();
        const newPage = await browserContext.newPage();

        await newPage.goto(configUrl);

        const settingsLocator = newPage.locator('body > pre');

        return settingsLocator.textContent();
    }

    /**
     * Given the expected feature flag name for message-hub and returns false if the flag is on. Returns true if the flag is off.
     * Function used for skipping feature flag guarded tests if flag is not turned on in the enviornment under test.
     * @param browser Playwright browser object used to load config page
     * @param flagNameAndOnStatus Full flag name and status as shown in the config file if the flag is on (must be exact match).
     * @returns True if the flag is OFF. False if the flag is ON.
     */
    static async isMessageHubFeatureFlagOff(browser: Browser, flagNameAndOnStatus: string) {
        const env = process.env.SERVER;
        this.verifyServerName(env);

        const settings = await this.getFeConfigs(browser, MESSAGE_HUB_CONFIG_URLS[env]);

        return !settings.includes(flagNameAndOnStatus);
    }

    /**
     * Given the expected feature flag name for message-chat-window and returns false if the flag is on. Returns true if the flag is off.
     * Function used for skipping feature flag guarded tests if flag is not turned on in the enviornment under test.
     * @param browser Playwright browser object used to load config page
     * @param flagNameAndOnStatus Full flag name and status as shown in the config file if the flag is on (must be exact match).
     * @returns True if the flag is OFF. False if the flag is ON.
     */
    static async isChatWindowFeatureFlagOff(browser: Browser, flagNameAndOnStatus: string) {
        const env = process.env.SERVER;
        this.verifyServerName(env);

        const settings = await this.getFeConfigs(browser, CHAT_CONFIG_URLS[env]);

        return !settings.includes(flagNameAndOnStatus);
    }
}
