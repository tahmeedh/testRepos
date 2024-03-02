import { test, type Page } from '@playwright/test';
import { PortalPage } from 'Poms/portal/portal-page';

export class PortalController {
    readonly page: Page;
    readonly Pom: PortalPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new PortalPage(this.page);
    }

    async closeEnableDesktopNotification() {
        await test.step('Portal Controller : Click on enable desktop notification close button', async () => {
            await this.Pom.ENABLE_DESKTOP_NOTIFICATION_CLOSE_BUTTON.click();
        });
    }

    async closeGRPhoneNumberNotification() {
        await test.step(`Notification Controller: Close 'View your Global Relay number and set up call-forwarding in your profile.`, async () => {
            await this.Pom.NEW_FEATURE_TOOLTIP_CLOSE_BUTTON.click();
        });
    }

    async logout() {
        await test.step('Portal Controller : Log Out', async () => {
            await this.Pom.SETTINGS_BAR_BUTTON.click();
            await this.Pom.LOG_OUT_BUTTON.click();
        });
    }
}
