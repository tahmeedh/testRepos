import { type Page } from '@playwright/test';
import { MessageHubPage } from 'Poms/message-hub-page';

export class MessageHubController {
    readonly page: Page;
    readonly Pom: MessageHubPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new MessageHubPage(this.page);
    }

    async clickSideBarChatsButton() {
        await this.Pom.CHATS_BUTTON.click();
    }

    async clickSideBarContactsButton() {
        await this.Pom.CONTACTS_BUTTON.click();
    }

    async clickMessageHubRow(chatName) {
        const ClickName = this.Pom.CHAT_NAME.getByText(chatName).click();
        return ClickName;
    }
}
