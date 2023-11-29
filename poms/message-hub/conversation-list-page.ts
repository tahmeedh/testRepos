import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class ConversationListPage extends BasePage {
    readonly page: Page;
    readonly CONVERSATION_ROW: Locator;

    constructor(page: Page) {
        super(page);

        this.CONVERSATION_ROW = this.MESSAGEIFRAME.locator('.m-auto-list-item-row');
    }
}
