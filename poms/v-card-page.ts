import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class VCardPage extends BasePage {
    readonly VCARD_CONTAINER: Locator;
    readonly CONTACTCARD_CONTAINER: Locator;
    readonly TEXT_ICON: Locator;

    constructor(page: Page) {
        super(page);
        this.VCARD_CONTAINER = this.page.locator('.profile-outer-container .m-auto-vcard-container');
        this.CONTACTCARD_CONTAINER = this.page.locator('.ContactCard_contact--container__BTJGG');
        this.TEXT_ICON = this.page.locator('.m-auto-text-button');
    }
}
