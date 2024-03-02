import { test, type Page } from '@playwright/test';
import { NewsAlertPage } from 'Poms/message-hub/news-alert-page';

export class NewsAlertController {
    readonly page: Page;
    readonly Pom: NewsAlertPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new NewsAlertPage(this.page);
    }

    async clickNextSMSEnabledNotification() {
        await test.step(`Notification Controller: Close 'Text messaging is enabled for your account' notification`, async () => {
            await this.Pom.NEWS_ALERT_NEXT_BUTTON.click();
        });
    }

    async closeSmsAndWhatsAppEnabledNotification() {
        await test.step(`Notification Controller: Close 'WhatsApp and Text messaging is enabled for your account' notification`, async () => {
            await this.Pom.NEW_FEATURE_TOOLTIP_CLOSE_BUTTON.click();
        });
    }
}
