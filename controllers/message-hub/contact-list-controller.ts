import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { ContactListPage } from 'Poms/message-hub/contact-list-page';

export class ContactListController {
    readonly page: Page;
    readonly Pom: ContactListPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new ContactListPage(this.page);
    }

    async clickOnContactAvatar(chatName: string) {
        await test.step(`Contact list Controller: Click on avatar of row ${chatName}`, async () => {
            Log.info(`Contact list Controller: Click on avatar of row ${chatName}`);
            await this.Pom.CONTACT_ROW.getByText(chatName)
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .click();
        });
    }
}
