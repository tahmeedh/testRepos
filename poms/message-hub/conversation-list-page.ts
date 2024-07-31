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
    readonly NEW_INVITE_BADGE: Locator;
    readonly FILTER_ICON: Locator;
    readonly HIDDEN_BUTTON: Locator;
    readonly FILTER_TAG: Locator;

    readonly CHAT_NAME: Locator;
    readonly DRAFT_TEXT_LINE: Locator;
    readonly ATTACHMENT_ICON: Locator;
    readonly ATTACHMENT_TEXT_LINE: Locator;
    readonly CHAT_FLAG_INDICATOR: Locator;
    readonly CHAT_FAVOURITE_INDICATOR: Locator;
    constructor(page: Page) {
        super(page);
        this.MUTE_CHAT_ICON = this.MESSAGEIFRAME.locator('.m-auto-muted-chat-icon');
        this.NEW_MESSAGE_BLUE_DOT = this.MESSAGEIFRAME.locator('.m-auto-has-new-content');
        this.NEW_MESSAGE_BLUE_BADGE = this.MESSAGEIFRAME.locator('.m-auto-blue-badge');
        this.CONVERSATION_ROW = this.MESSAGEIFRAME.locator('.m-auto-list-item-row');
        this.CONVERSATION_NAME = this.MESSAGEIFRAME.locator('.m-auto-name');
        this.EMPTY_HUB_CHANNEL_MESSAGE = this.MESSAGEIFRAME.locator('.m-auto-empty-hub-channel-message');
        this.NEW_INVITE_BADGE = this.MESSAGEIFRAME.locator('.m-auto-has-new-invite');
        this.FILTER_ICON = this.MESSAGEIFRAME.locator('.m-auto-filter-menu-icon');
        this.HIDDEN_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-filter-item-hidden');
        this.FILTER_TAG = this.MESSAGEIFRAME.locator('.m-auto-filter-tag');
        this.CHAT_NAME = this.MESSAGEIFRAME.locator('.twemoji-wrapper');
        this.DRAFT_TEXT_LINE = this.MESSAGEIFRAME.locator('.list-item-text-draft');
        this.ATTACHMENT_ICON = this.MESSAGEIFRAME.locator('.list-item-text-icon');
        this.ATTACHMENT_TEXT_LINE = this.MESSAGEIFRAME.getByText('Attachment');
        this.CHAT_FLAG_INDICATOR = this.MESSAGEIFRAME.locator('.grid-item__flag');
        this.CHAT_FAVOURITE_INDICATOR = this.MESSAGEIFRAME.locator('.gr-icon-star_filled');
    }
}
