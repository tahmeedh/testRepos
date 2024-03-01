import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base-page';

export class VCardEditPage extends BasePage {
    readonly RECIPIENT_NUMBER: Locator;
    readonly FIELD_FIRST_NAME: Locator;
    readonly FIELD_LAST_NAME: Locator;
    readonly FIELD_COMPANY: Locator;
    readonly FIELD_JOB_TITLE: Locator;
    readonly FIELD_EMAIL: Locator;
    readonly SAVE_BUTTON: Locator;
    readonly CANCEL_BUTTON: Locator;

    constructor(page: Page) {
        super(page);
        this.RECIPIENT_NUMBER = this.CHATIFRAME.getByTestId('recipient-number');
        this.FIELD_FIRST_NAME = this.CHATIFRAME.locator('.m-auto-first-name-input');
        this.FIELD_LAST_NAME = this.CHATIFRAME.locator('.m-auto-last-name-input');
        this.FIELD_COMPANY = this.CHATIFRAME.locator('.m-auto-company-name-input');
        this.FIELD_JOB_TITLE = this.CHATIFRAME.locator('.m-auto-job-title-input');
        this.FIELD_EMAIL = this.CHATIFRAME.locator('.m-auto-email-address-input');
        this.SAVE_BUTTON = this.CHATIFRAME.locator('.m-auto-external-contact-save-button');
        this.CANCEL_BUTTON = this.CHATIFRAME.locator('.m-auto-external-contact-cancel-button');
    }
}
