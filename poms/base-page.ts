import type { FrameLocator, Locator, Page } from '@playwright/test';

export class BasePage {
    // frame
    readonly page: Page;
    readonly MESSAGEIFRAME: FrameLocator;
    readonly CHATIFRAME: FrameLocator;
    readonly AVATAR: Locator;
    readonly LOAD_GR_APP_SPINNER: Locator;
    readonly HUB_CONTAINER: Locator;
    readonly WELCOME_TEXT: Locator;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.MESSAGEIFRAME = this.page.frameLocator('iframe[id="message-iframe"]');
        this.CHATIFRAME = this.page
            .frameLocator('iframe[title="message"]')
            .frameLocator('iframe[title="chat window"]');
        this.AVATAR = this.CHATIFRAME.locator('.m-auto-avatar-container');
        this.LOAD_GR_APP_SPINNER = this.page.getByAltText('Loading Global Relay App');
    }
}
