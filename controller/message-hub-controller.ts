import type { Page } from '@playwright/test';
import { MessageHubPage } from '../poms/message-hub';

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

    async findChat(chatName) {
        const chat = this.page.getByText(chatName);
        return chat;
    }
}
