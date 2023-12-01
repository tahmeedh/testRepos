import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class CompanyVCardPage extends BasePage {
    readonly BACK_BUTTON: Locator;
    readonly COMPANY_NAME: Locator;

    constructor(page: Page) {
        super(page);
        this.BACK_BUTTON = this.CHATIFRAME.locator(
            '.profile-outer-container .m-auto-chat-header-back-button'
        );
        this.COMPANY_NAME = this.CHATIFRAME.locator('.CompanyProfile_company-profile-header-name__az1WD');
    }
}
