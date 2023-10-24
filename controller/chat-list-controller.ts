import type { Page } from '@playwright/test';
import { ChatListPage } from '../poms/chat-list-page';

export class ChatListController {
    readonly page: Page;
    readonly Pom: ChatListPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new ChatListPage(this.page);
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
