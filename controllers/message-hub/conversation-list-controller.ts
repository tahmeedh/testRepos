import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { ConversationListPage } from 'Poms/message-hub/conversation-list-page';

export class ConversationListController {
    readonly page: Page;
    readonly Pom: ConversationListPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new ConversationListPage(this.page);
    }

    async clickOnConversationAvatar(chatName: string) {
        await test.step(`Conversation List Controller: clicking on avatar of row ${chatName}`, async () => {
            Log.info(`Conversation List Controller: clicking on avatar of row ${chatName}`);
            await this.Pom.CONVERSATION_ROW.getByTestId('test-avatar-main')
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .click();
        });
    }

    async clickOnConversationName(conversationName: string) {
        await test.step('Conversation List Controller : Click on conversation', async () => {
            await this.Pom.CONVERSATION_NAME.getByText(conversationName).click();
        });
    }
}
