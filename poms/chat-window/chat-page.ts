import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

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
    readonly CHAT_WINDOW: Locator;
    readonly DROP_DOWN_LEAVE: Locator;
    readonly DROP_DOWN_INVITE_PARTICIPANTS: Locator;
    readonly DROP_DOWN_VIEW_DETAILS: Locator;
    readonly CHAT_HEADER_MENU_DROP_DOWN: Locator;
    readonly CHAT_FAVOURITE_BUTTON: Locator;
    readonly LEAVE_CHAT_BUTTON: Locator;
    readonly RECIPIENT_INFO_FIRST_NAME_FIELD: Locator;
    readonly RECIPIENT_INFO_LAST_NAME_FIELD: Locator;
    readonly RECIPIENT_INFO_SAVE_BUTTON: Locator;
    readonly VOICE_NOTE_PLAY_BUTTON: Locator;
    readonly VOICE_NOTE_TIMESTAMP: Locator;
    readonly MESSAGE_ROW_CONTAINER: Locator;
    readonly MENU_ICON: Locator;
    readonly CHAT_BUBBLE_MENU_DROPDOWN: Locator;
    readonly IS_TYPING_INDICATOR: Locator;
    readonly IS_TYPING_AVATARS_CONTAINER: Locator;
    readonly IS_TYPING_AVATAR: Locator;
    readonly IS_TYPING_AVATAR_TEXT: Locator;
    readonly IS_TYPING_AVATAR_OVERFLOW: Locator;
    readonly CHAT_BUBBLE_ROW: Locator;

    constructor(page: Page) {
        super(page);

        this.DROP_DOWN_VIEW_DETAILS = this.CHATIFRAME.locator('.m-auto-detailsBtn');
        this.CHAT_HEADER_MENU_DROP_DOWN = this.CHATIFRAME.locator('.chat-header-menu-dropdown');
        this.DROP_DOWN_INVITE_PARTICIPANTS = this.CHATIFRAME.locator('.m-auto-inviteToConversationBtn');
        this.DROP_DOWN_LEAVE = this.CHATIFRAME.locator('.m-auto-leaveBtn');
        this.CHAT_WINDOW = this.CHATIFRAME.locator('.chat-area');
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
        this.CHAT_FAVOURITE_BUTTON = this.CHATIFRAME.locator('.m-auto-favourite-icon');

        this.INCOMING_PARTIAL = this.CHATIFRAME.locator('.m-auto-chat-bubble-incoming');
        this.INCOMING_PARTIAL_MUC = this.CHATIFRAME.locator('.m-auto-muc-chat-bubble-incoming');
        this.FILESHARING_OPTION_DROPDOWN_BTN = this.CHATIFRAME.locator('.m-auto-file-menu-icon');
        this.FILESHARING_DOWNLOAD_BTN = this.CHATIFRAME.getByRole('menuitem', { name: 'Download' });
        this.RECIPIENT_INFO_SKIP_BUTTON = this.CHATIFRAME.getByText('Skip');
        this.LEAVE_CHAT_BUTTON = this.CHATIFRAME.locator('.m-auto-leaveBtn');

        this.RECIPIENT_INFO_FIRST_NAME_FIELD = this.CHATIFRAME.locator(
            '.m-auto-first-name-input .public-DraftEditor-content'
        );
        this.RECIPIENT_INFO_LAST_NAME_FIELD = this.CHATIFRAME.locator(
            '.m-auto-last-name-input .public-DraftEditor-content'
        );
        this.RECIPIENT_INFO_SAVE_BUTTON = this.CHATIFRAME.getByText('Save');
        this.VOICE_NOTE_PLAY_BUTTON = this.CHATIFRAME.locator('.m-auto-voice-player .m-auto-play-icon');
        this.VOICE_NOTE_TIMESTAMP = this.CHATIFRAME.locator('.m-auto-voice-player .m-auto-audio-timestamp');
        this.MESSAGE_ROW_CONTAINER = this.CHATIFRAME.locator('.m-auto-message-row-container');
        this.MENU_ICON = this.CHATIFRAME.locator('.m-auto-file-menu-icon:visible');
        this.CHAT_BUBBLE_MENU_DROPDOWN = this.CHATIFRAME.locator('.m-auto-chat-bubble-menu:visible');
        this.CHAT_BUBBLE_ROW = this.CHATIFRAME.locator('.m-auto-message-row-container');

        this.IS_TYPING_INDICATOR = this.CHATIFRAME.getByTestId('is-typing');
        this.IS_TYPING_AVATAR =
            this.CHATIFRAME.getByTestId('is-typing-avatars').getByTestId('test-avatar-main');
        this.IS_TYPING_AVATAR_TEXT =
            this.CHATIFRAME.getByTestId('is-typing-avatars').getByTestId('avatar-text-content');
        this.IS_TYPING_AVATAR_OVERFLOW =
            this.CHATIFRAME.getByTestId('is-typing-avatars').getByTestId('is-typing-overflow');
    }
}
