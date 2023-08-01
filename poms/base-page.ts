import type { FrameLocator, Locator, Page } from '@playwright/test';

export class BasePage {
    // frame
    readonly page: Page;
    readonly MESSAGEIFRAME: FrameLocator;
    readonly CHATIFRAME : FrameLocator;

    readonly TOOLTIP_NEXT_BUTTON : Locator;
    readonly TOOLTIP_CLOSE_BUTTON : Locator;
    readonly TOOLTIP_CLOSE_BUTTONA : Locator;
    readonly ENABLE_NOTIFICATION_BUTTON : Locator;
    readonly CLOSE_NOTIFICATION_BUTTON : Locator;

    readonly SETTINGS_BAR_BUTTON : Locator;
    readonly LOG_OUT_BUTTON : Locator;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page:Page) {
        this.page = page;
        this.MESSAGEIFRAME = this.page.frameLocator('iframe[id="message-iframe"]');
        this.CHATIFRAME = this.page.frameLocator('iframe[title="message"]').frameLocator('iframe[title="chat window"]');

        this.TOOLTIP_NEXT_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-news-alert-next-link');
        this.TOOLTIP_CLOSE_BUTTON = this.page.locator('.m-auto-new-feature-tooltip-close');
        this.TOOLTIP_CLOSE_BUTTONA = this.MESSAGEIFRAME.locator('.m-auto-new-feature-tooltip-close');
        // this.ENABLE_NOTIFICATION_BUTTON = this.MESSAGEIFRAME.locator('.NewsAlert_visibility-on__E-B1n');
        this.ENABLE_NOTIFICATION_BUTTON = this.page.getByRole('button', { name: 'Enable' });
        this.CLOSE_NOTIFICATION_BUTTON = this.page.locator('span').first();

        this.SETTINGS_BAR_BUTTON = this.page.locator('.m-auto-header-main-menu-image');
        this.LOG_OUT_BUTTON = this.page.locator('.m-auto-header-main-menu-logout');
    
    }

}