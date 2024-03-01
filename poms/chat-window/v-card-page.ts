import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base-page';

export class VCardPage extends BasePage {
    readonly VCARD_CONTAINER: Locator;
    readonly CONTACTCARD_CONTAINER: Locator;
    readonly TEXT_ICON: Locator;
    readonly CALL_ICON: Locator;
    readonly FIRST_LAST_NAME: Locator;
    readonly COMPANY_NAME_INTERNAL: Locator;
    readonly EDIT_BUTTON: Locator;
    readonly BACK_BUTTON: Locator;
    readonly PHONE_NUMBER: Locator;
    readonly JOB_TITLE: Locator;
    readonly COMPANY: Locator;
    readonly EMAIL: Locator;
    readonly CHAT_HEADER_MENU: Locator;

    constructor(page: Page) {
        super(page);
        this.VCARD_CONTAINER = this.CHATIFRAME.locator('.m-auto-vcard-container');
        this.CONTACTCARD_CONTAINER = this.CHATIFRAME.locator('.ContactCard_contact--container__BTJGG');
        this.TEXT_ICON = this.CHATIFRAME.locator('.m-auto-text-button');
        this.CALL_ICON = this.CHATIFRAME.locator('.m-auto-call-button');
        this.FIRST_LAST_NAME = this.CHATIFRAME.locator('.m-auto-sms-contact-first-and-last-name');
        this.COMPANY_NAME_INTERNAL = this.CHATIFRAME.locator('.m-auto-company-name');
        this.EDIT_BUTTON = this.CHATIFRAME.locator('.m-auto-external-vcard-edit-button');
        this.BACK_BUTTON = this.CHATIFRAME.locator('.m-auto-vcard-container .m-auto-chat-header-back-button');
        this.PHONE_NUMBER = this.CHATIFRAME.locator('.m-auto-phone-number-primary');
        this.CHAT_HEADER_MENU = this.CHATIFRAME.locator('.m-auto-menu-button');
        this.JOB_TITLE = this.CHATIFRAME.locator('.m-auto-job-title');
        this.COMPANY = this.CHATIFRAME.locator('.m-auto-company-section');
        this.EMAIL = this.CHATIFRAME.locator('.m-auto-email-address');
    }
}
