import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
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
        await test.step(`News Alert Controller: Close 'Text messaging is enabled for your account' notification`, async () => {
            Log.info(
                `News Alert Controller: Close 'Text messaging is enabled for your account' notification`
            );
            try {
                await this.Pom.NEWS_ALERT_NEXT_BUTTON.click();
            } catch {
                Log.info(
                    'Text messaging is enabled for your account notification did not appear. Skipping to next step.'
                );
            }
        });
    }

    async closeSmsAndWhatsAppEnabledNotification() {
        await test.step(`News Alert Controller: Close 'WhatsApp and Text messaging is enabled for your account' notification`, async () => {
            Log.info(
                `News Alert Controller: Close 'WhatsApp and Text messaging is enabled for your account' notification`
            );
            try {
                await this.Pom.NEW_FEATURE_TOOLTIP_CLOSE_BUTTON.click();
            } catch {
                Log.info(
                    'WhatsApp and Text messaging is enabled for your account notification did not appear. Skipping to next step.'
                );
            }
        });
    }
}
