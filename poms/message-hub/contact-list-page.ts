import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class ContactListPage extends BasePage {
    readonly page: Page;
    readonly CONTACT_LIST: Locator;
    readonly CONTACT_ROW: Locator;
    readonly CONTACT_ROW_AVATAR: Locator;
    readonly CONTACT_ROW_NAME: Locator;

    constructor(page: Page) {
        super(page);

        this.CONTACT_LIST = this.MESSAGEIFRAME.getByTestId('m-auto-contact-list');
        this.CONTACT_ROW = this.MESSAGEIFRAME.getByTestId('m-auto-contact');
        this.CONTACT_ROW_AVATAR = this.MESSAGEIFRAME.getByTestId('m-auto-avatar-container');
        this.CONTACT_ROW_NAME = this.MESSAGEIFRAME.getByTestId('m-auto-contact-name');
    }
}
