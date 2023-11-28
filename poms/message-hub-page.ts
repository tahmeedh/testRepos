import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class MessageHubPage extends BasePage {
    readonly page: Page;
    readonly HUB_CONTAINER: Locator;
    readonly CHATS_BUTTON: Locator;
    readonly CONTACTS_BUTTON: Locator;

    readonly CHAT_NAME: Locator;
    readonly DRAFT_TEXT_LINE: Locator;
    readonly ATTACHMENT_ICON: Locator;
    readonly ATTACHMENT_TEXT_LINE: Locator;
    readonly CHAT_FLAG_INDICATOR: Locator;
    readonly CHAT_FAVOURITE_INDICATOR: Locator;
    readonly CONVERSATION_ROW: Locator;

    constructor(page: Page) {
        super(page);

        this.HUB_CONTAINER = this.MESSAGEIFRAME.locator('.hub-container');
        //sidebar
        this.CHATS_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-chats-button');
        this.CONTACTS_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-contacts-button');

        // Row Information
        this.CHAT_NAME = this.MESSAGEIFRAME.locator('.twemoji-wrapper');
        this.DRAFT_TEXT_LINE = this.MESSAGEIFRAME.locator('.list-item-text-draft');
        this.ATTACHMENT_ICON = this.MESSAGEIFRAME.locator('.list-item-text-icon');
        this.ATTACHMENT_TEXT_LINE = this.MESSAGEIFRAME.getByText('Attachment');
        this.CHAT_FLAG_INDICATOR = this.MESSAGEIFRAME.locator('.grid-item__flag');
        this.CHAT_FAVOURITE_INDICATOR = this.MESSAGEIFRAME.locator('.gr-icon-star_filled');
        this.CONVERSATION_ROW = this.MESSAGEIFRAME.locator('.m-auto-list-item-row');
    }
}
