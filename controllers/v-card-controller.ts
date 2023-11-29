import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { VCardPage } from 'Poms/v-card-page';

export class VCardController {
    readonly page: Page;
    readonly Pom: VCardPage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new VCardPage(this.page);
    }

    async clickOnEditButton() {
        await test.step(`VCard Controller: Click on edit button`, async () => {
            Log.info(`VCard Controller: Click on edit button`);
            await this.Pom.EDIT_BUTTON.click();
        });
    }
}
