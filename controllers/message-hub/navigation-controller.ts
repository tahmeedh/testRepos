import { type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { NavigationPage } from 'Poms/message-hub/navigation-page';

export class NavigationController {
    readonly page: Page;
    readonly Pom: NavigationPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new NavigationPage(this.page);
    }

    async clickSideBarChatsButton() {
        Log.info(`Navigation Controller: Click on side bar chat button'`);
        await this.Pom.CHATS_BUTTON.click();
    }

    async clickSideBarContactsButton() {
        Log.info(`Navigation Controller: Click on side bar contacts button'`);
        await this.Pom.CONTACTS_BUTTON.click();
    }

    async toggleHideMessageHubButton() {
        Log.info(`Portal Controller: Toggle Message Hub`);
        await this.Pom.MESSAGE_HUB_HIDE_BUTTON.click();
    }
}
