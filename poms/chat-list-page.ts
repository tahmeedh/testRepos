import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ChatListPage extends BasePage {
    readonly page: Page;
    readonly CHAT_CONTAINER: Locator;
    readonly CHANNELS_CONTAINER: Locator;
    readonly CHATS_BUTTON: Locator;
    readonly CONTACTS_BUTTON: Locator;

    readonly CHAT_NAME: Locator;
    readonly DRAFT_TEXT_LINE: Locator;
    readonly ATTACHMENT_ICON: Locator;
    readonly ATTACHMENT_TEXT_LINE: Locator;
    readonly CHANNEL_INFO: Locator;
    readonly INVITE_BADGE: Locator;
    readonly CHAT_ROWS: Locator;
    readonly CHANNEL_ROWS: Locator;

    constructor(page: Page) {
        super(page);

        //sidebar
        this.CHATS_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-chats-button');
        this.CONTACTS_BUTTON = this.CHATIFRAME.locator('.m-auto-contacts-button');

        // Row Information
        this.CHAT_NAME = this.MESSAGEIFRAME.locator('.twemoji-wrapper');
        this.DRAFT_TEXT_LINE = this.MESSAGEIFRAME.locator('.list-item-text-draft');
        this.ATTACHMENT_ICON = this.MESSAGEIFRAME.locator('.list-item-text-icon');
        this.ATTACHMENT_TEXT_LINE = this.MESSAGEIFRAME.getByText('Attachment');
    }
}
