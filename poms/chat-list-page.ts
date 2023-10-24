import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ChatListPage extends BasePage {
    readonly page: Page;
    readonly CHAT_BODY_PARTIAL: Locator;
    readonly CHAT_ITEM_ROW: Locator;
    readonly AVATAR_CONTAINER: Locator;
    readonly CHAT_LIST_CONTAINER: Locator;
    readonly CONVERSATION_LIST_CONTAINER: Locator;
    readonly CHANNEL_LIST_CONTAINER: Locator;
    readonly CONVERSATIONS_CONTAINER: Locator;
    readonly CHAT_CONTAINER: Locator;
    readonly CHANNELS_CONTAINER: Locator;
    readonly CHATS_BUTTON: Locator;
    readonly CONTACTS_BUTTON: Locator;

    readonly CHAT_NAME: Locator;
    readonly SECONDARY_LINE: Locator;
    readonly CHANNEL_DRAFT_LINE: Locator;
    readonly N_BADGE: Locator;
    readonly FAVOURITE_ICON: Locator;
    readonly CHANNEL_INFO: Locator;
    readonly INVITE_BADGE: Locator;
    readonly CHAT_ROWS: Locator;
    readonly CHANNEL_ROWS: Locator;

    constructor(page: Page) {
        super(page);

        // Partials
        this.CHAT_BODY_PARTIAL = this.CHATIFRAME.locator('.list-item-body');
        this.CHAT_ITEM_ROW = this.CHATIFRAME.locator('.m-auto-list-item-row');

        // Containers
        this.AVATAR_CONTAINER = this.CHATIFRAME.locator('.m-auto-avatar-container');
        this.CHAT_LIST_CONTAINER = this.CHATIFRAME.locator('.m-auto-accordion');
        this.CONVERSATION_LIST_CONTAINER = this.CHATIFRAME.locator('.conversation-list-container');
        this.CHANNEL_LIST_CONTAINER = this.CHATIFRAME.locator('.channel-list-container');
        this.CHANNELS_CONTAINER = this.CHATIFRAME.locator('.m-auto-accordion-item-channels');
        this.CHAT_ROWS = this.CHATIFRAME.locator('.conversation-list-container .m-auto-list-item-row');
        this.CHANNEL_ROWS = this.CHATIFRAME.locator('.channel-list-container .m-auto-list-item-row');

        //sidebar
        this.CHATS_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-chats-button');
        this.CONTACTS_BUTTON = this.CHATIFRAME.locator('.m-auto-contacts-button');

        // Row Information
        this.CHAT_NAME = this.CHATIFRAME.locator('.m-auto-name');
        this.SECONDARY_LINE = this.CHATIFRAME.locator('.m-auto-secondary-line');
        this.CHANNEL_DRAFT_LINE = this.CHATIFRAME.locator('.m-auto-list-item-draft');

        this.N_BADGE = this.CHATIFRAME.locator('.m-auto-blue-badge');
        this.FAVOURITE_ICON = this.CHATIFRAME.locator('.m-auto-favourite-icon');
        this.INVITE_BADGE = this.CHATIFRAME.locator('.m-auto-has-new-invite');
        // -- Row Channels

        this.CHANNEL_INFO = this.CHATIFRAME.locator('.m-auto-list-item-row');
    }
}
