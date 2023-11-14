import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ChatPage extends BasePage {
    readonly page: Page;
    readonly CHAT_INPUT_WRAPPER: Locator;
    readonly CHAT_INPUT_SMS_WRAPPER: Locator;
    readonly CHAT_INPUT: Locator;
    readonly SEND_BUTTON: Locator;
    readonly ACCEPT_BUTTON: Locator;
    readonly CHAT_HEADER_MENU: Locator;
    readonly CHAT_BACK_BUTTON: Locator;

    readonly ALL_CONTENT: Locator;
    readonly TIMESTAMP_CONTAINER: Locator;

    readonly INCOMING_PARTIAL: Locator;
    readonly INCOMING_PARTIAL_MUC: Locator;
    readonly FILESHARING_OPTION_DROPDOWN_BTN: Locator;
    readonly FILESHARING_DOWNLOAD_BTN: Locator;
    readonly RECIPIENT_INFO_SKIP_BUTTON: Locator;
    readonly CHAT_FLAG_BUTTON: Locator;

    constructor(page: Page) {
        super(page);

        this.CHAT_BACK_BUTTON = this.CHATIFRAME.locator('.m-auto-back-button-container');
        this.CHAT_INPUT_WRAPPER = this.CHATIFRAME.locator('.public-DraftEditor-content');
        this.CHAT_INPUT_SMS_WRAPPER = this.CHATIFRAME.locator('.chat-input-wrapper-sms');
        this.CHAT_INPUT = this.CHATIFRAME.getByRole('textbox', { name: 'input-label' });
        this.SEND_BUTTON = this.CHATIFRAME.locator('.m-auto-send-btn');
        this.ACCEPT_BUTTON = this.CHATIFRAME.locator('.m-auto-footer-accept');

        this.CHAT_HEADER_MENU = this.CHATIFRAME.locator('.chat-header-menu-button');

        this.TIMESTAMP_CONTAINER = this.CHATIFRAME.locator('.m-auto-timestamp-region');
        this.ALL_CONTENT = this.CHATIFRAME.locator(
            '.m-auto-chat-container .chat-area .m-auto-message-content'
        );

        this.CHAT_BACK_BUTTON = this.CHATIFRAME.locator('.m-auto-back-button-container');
        this.CHAT_FLAG_BUTTON = this.CHATIFRAME.locator('.m-auto-flag-icon');

        this.INCOMING_PARTIAL = this.CHATIFRAME.locator('.m-auto-chat-bubble-incoming');
        this.INCOMING_PARTIAL_MUC = this.CHATIFRAME.locator('.m-auto-muc-chat-bubble-incoming');
        this.FILESHARING_OPTION_DROPDOWN_BTN = this.CHATIFRAME.locator('.m-auto-file-menu-icon');
        this.FILESHARING_DOWNLOAD_BTN = this.CHATIFRAME.getByRole('menuitem', { name: 'Download' });
        this.RECIPIENT_INFO_SKIP_BUTTON = this.CHATIFRAME.getByText('Skip');
    }
}
