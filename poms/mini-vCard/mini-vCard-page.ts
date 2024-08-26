import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class MiniVCardPage extends BasePage {
    readonly MINI_VCARD_CONTAINER: Locator;
    readonly USER_PRESENCE: Locator;
    readonly USER_NAME: Locator;
    readonly COMPANY_NAME: Locator;
    readonly MESSAGE_BUTTON: Locator;
    readonly MORE_INFO_BUTTON: Locator;
    readonly CTA_SMS_BUTTON: Locator;
    readonly CTA_WA_BUTTON: Locator;
    readonly PHONE_NUMBER: Locator;
    readonly EMAIL: Locator;

    constructor(page: Page) {
        super(page);
        this.MINI_VCARD_CONTAINER = this.CHATIFRAME.getByTestId('test-mini-card-main');
        this.USER_PRESENCE =
            this.CHATIFRAME.getByTestId('test-mini-card-main').getByTestId('mini-card-user-presence');
        this.USER_NAME = this.CHATIFRAME.getByTestId('test-mini-card-main').getByTestId('user-name');
        this.COMPANY_NAME = this.CHATIFRAME.getByTestId('test-mini-card-main').getByTestId('company-name');
        this.MESSAGE_BUTTON =
            this.CHATIFRAME.getByTestId('test-mini-card-main').getByTestId('message-button');
        this.MORE_INFO_BUTTON =
            this.CHATIFRAME.getByTestId('test-mini-card-main').getByTestId('more-info-button');
        this.CTA_SMS_BUTTON = this.CHATIFRAME.getByTestId('test-mini-card-main').getByTestId('text-icon');
        this.CTA_WA_BUTTON = this.CHATIFRAME.getByTestId('test-mini-card-main').getByTestId('whatsapp-icon');
        this.PHONE_NUMBER =
            this.CHATIFRAME.getByTestId('test-mini-card-main').getByTestId('mini-card-phone-number');
        this.EMAIL =
            this.CHATIFRAME.getByTestId('test-mini-card-main').getByTestId('test-anchor-link-external');
    }
}
