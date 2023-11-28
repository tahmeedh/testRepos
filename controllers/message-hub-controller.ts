import { test, type Page } from '@playwright/test';
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

    async clickOnConversationAvatar(chatName: string) {
        await test.step(`Message Hub Controller: clicking on avatar of row ${chatName}`, async () => {
            await this.Pom.CONVERSATION_ROW.getByTestId('test-avatar-main')
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .click();
        });
    }
}
