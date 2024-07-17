import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { ConversationListPage } from 'Poms/message-hub/conversation-list-page';

export enum FilterType {
    HIDDEN = 'Hidden',
    INVITATION = 'Invitation',
    UNREAD = 'Unread',
    FAVOURITES = 'Favourites',
    FLAGGED = 'Flagged',
    ONE_TO_ONE = 'One-to-One',
    MULTI_PARTY = 'Multi-Party',
    TEXT = 'Text',
    WHATSAPP = 'WhatsApp',
    ALL = 'All'
}

/**
 * This component is part of the whole '.m-auto-accordion-item-conversations' div. Any child element should reside under this contoller.
 */
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
        await test.step(`Conversation List Controller : Click on conversation with name '${conversationName}'`, async () => {
            Log.info(`Conversation List Controller : Click on conversation with name '${conversationName}'`);
            await this.Pom.CONVERSATION_NAME.getByText(conversationName, { exact: true }).nth(0).click();
        });
    }

    async getConversationId(conversationName: string): Promise<string> {
        return test.step(`Conversation List Controller : Get conversation Id from conversation name '${conversationName}'`, async () => {
            Log.info(
                `Conversation List Controller : Get conversation Id from conversation name '${conversationName}'`
            );
            const child = this.Pom.CONVERSATION_NAME.getByText(conversationName);
            const conversationRow = this.Pom.CONVERSATION_ROW.filter({ has: child });
            const classes = await conversationRow.getAttribute('class');
            const classesAry = classes.split(' ');
            let longestClass = '';
            classesAry.forEach((element) => {
                if (element.length > longestClass.length) {
                    longestClass = element;
                }
            });
            const conversationIdremovedMAuto = longestClass.replace('m-auto-', '');
            return conversationIdremovedMAuto;
        });
    }

    async filterConversations(filterType: FilterType) {
        await test.step(`Filter Conversations based on ${filterType}`, async () => {
            Log.info(`Filter Conversations based on ${filterType}`);
            await this.Pom.FILTER_ICON.first().click();

            switch (filterType) {
                case FilterType.HIDDEN:
                    await this.Pom.HIDDEN_BUTTON.click();
                    break;
                default:
                    throw new Error(`Unsupported filter type: ${filterType}`);
            }
        });
    }
}
