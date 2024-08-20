import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { MiniVCardPage } from 'Poms/mini-vCard/mini-v-card-page';

export class MiniVCardController {
    readonly page: Page;
    readonly Pom: MiniVCardPage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new MiniVCardPage(this.page);
    }

    async clickMessageBtn() {
        await test.step(`Mini-VCard Controller: Click on 'message' button`, async () => {
            Log.info(`Mini-VCard Controller: Click on 'message' button`);
            await this.Pom.MESSAGE_BUTTON.click();
        });
    }

    async clickMoreInfoBtn() {
        await test.step(`Mini-VCard Controller: Click on 'message' button`, async () => {
            Log.info(`Mini-VCard Controller: Click on 'message' button`);
            await this.Pom.MORE_INFO_BUTTON.click();
        });
    }

    async clickCtaSMSBtn() {
        await test.step(`Mini-VCard Controller: Click on 'message' button`, async () => {
            Log.info(`Mini-VCard Controller: Click on 'message' button`);
            await this.Pom.CTA_SMS_BUTTON.click();
        });
    }

    async clickCtaWABtn() {
        await test.step(`Mini-VCard Controller: Click on 'message' button`, async () => {
            Log.info(`Mini-VCard Controller: Click on 'message' button`);
            await this.Pom.CTA_WA_BUTTON.click();
        });
    }
}
