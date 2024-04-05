import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class ConversationListPage extends BasePage {
    readonly page: Page;
    readonly CONVERSATION_ROW: Locator;
    readonly CONVERSATION_NAME: Locator;
    readonly EMPTY_HUB_CHANNEL_MESSAGE: Locator;
    readonly MUTE_CHAT_ICON: Locator;
    readonly NEW_MESSAGE_BLUE_DOT: Locator;
    readonly NEW_MESSAGE_BLUE_BADGE: Locator;

    constructor(page: Page) {
        super(page);
        this.MUTE_CHAT_ICON = this.MESSAGEIFRAME.locator('.m-auto-muted-chat-icon');
        this.NEW_MESSAGE_BLUE_DOT = this.MESSAGEIFRAME.locator('.m-auto-has-new-content');
        this.NEW_MESSAGE_BLUE_BADGE = this.MESSAGEIFRAME.locator('.m-auto-blue-badge');
        this.CONVERSATION_ROW = this.MESSAGEIFRAME.locator('.m-auto-list-item-row');
        this.CONVERSATION_NAME = this.MESSAGEIFRAME.locator('.m-auto-name');
        this.EMPTY_HUB_CHANNEL_MESSAGE = this.MESSAGEIFRAME.locator('.m-auto-empty-hub-channel-message');
    }
}
