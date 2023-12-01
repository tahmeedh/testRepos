import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { CompanyVCardPage } from 'Poms/company-v-card-page';

export class CompanyVCardController {
    readonly page: Page;
    readonly Pom: CompanyVCardPage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new CompanyVCardPage(this.page);
    }

    async clickOnBackButton() {
        await test.step(`Comapny vCard Controller: Click on back button`, async () => {
            Log.info(`Comapny vCard Controller: Click on back button`);
            await this.Pom.BACK_BUTTON.click();
        });
    }
}
