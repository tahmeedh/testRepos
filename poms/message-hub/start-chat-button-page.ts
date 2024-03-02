import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class StartChatButtonPage extends BasePage {
    readonly START_CHAT: Locator;
    readonly START_CHAT_DROPDOWN: Locator;
    readonly START_ONE_ON_ONE: Locator;
    readonly START_MUC: Locator;
    readonly START_SMS: Locator;
    readonly START_WHATSAPP: Locator;
    readonly START_CHANNEL: Locator;

    constructor(page: Page) {
        super(page);
        this.START_CHAT = this.MESSAGEIFRAME.locator('.m-auto-start-new-chat');
        this.START_CHAT_DROPDOWN = this.MESSAGEIFRAME.locator('.m-auto-start-chat-menu-dropdown');
        this.START_ONE_ON_ONE = this.MESSAGEIFRAME.locator('.m-auto-start-one-to-one-chat');
        this.START_MUC = this.MESSAGEIFRAME.locator('.m-auto-start-muc-chat');
        this.START_SMS = this.MESSAGEIFRAME.locator('.m-auto-start-sms-chat');
        this.START_WHATSAPP = this.MESSAGEIFRAME.locator('.m-auto-start-whatsapp-chat');
        this.START_CHANNEL = this.MESSAGEIFRAME.locator('.m-auto-start-channel-chat');
    }
}
