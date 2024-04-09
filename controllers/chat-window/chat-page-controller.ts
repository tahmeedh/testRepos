import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { ChatPage } from 'Poms/chat-window/chat-page';

export class ChatController {
    readonly page: Page;
    readonly Pom: ChatPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new ChatPage(this.page);
    }

    async sendContent(message: string = StringUtils.generateString()) {
        await test.step('Chat Controller : Send Content', async () => {
            await this.Pom.CHAT_INPUT_WRAPPER.click();
            await this.Pom.CHAT_INPUT.fill(message);
            await this.Pom.SEND_BUTTON.click();
        });

        return message;
    }

    async clickSendButton() {
        await test.step('Chat Controller : Click send button', async () => {
            await this.Pom.SEND_BUTTON.click();
        });
    }

    async typeContent(message: string = StringUtils.generateString()) {
        await test.step('Chat Controller : Send Content', async () => {
            await this.Pom.CHAT_INPUT.fill(message);
        });
    }

    async removeContent() {
        await test.step('Chat Controller : Send Content', async () => {
            await this.Pom.CHAT_INPUT_WRAPPER.click();
            await this.Pom.CHAT_INPUT.clear();
        });
    }

    async waitForHeader() {
        await test.step('Base Controller : Wait For Header', async () => {
            await expect(this.Pom.CHAT_HEADER_MENU).toBeVisible();
        });
    }

    async clickOnBackButton() {
        await test.step('Chat Controller: Naviagate back to Message Hub', async () => {
            await this.Pom.CHAT_BACK_BUTTON.click();
        });
    }

    async clickChatFlagButton() {
        await test.step('Chat Controller: Flag Chat', async () => {
            await this.Pom.CHAT_FLAG_BUTTON.click();
        });
    }

    async clickChatFavouriteButton() {
        await test.step('Chat Controller: Favourite Chat', async () => {
            await this.Pom.CHAT_FAVOURITE_BUTTON.click();
        });
    }

    async downloadLastMedia(type?: string) {
        await test.step('Chat Controller : Download Media Content', async () => {
            await this.page.waitForTimeout(1000);

            // hover over last media message
            let incomingMsgs;
            if (type === 'MUC') {
                incomingMsgs = this.Pom.INCOMING_PARTIAL_MUC;
            } else {
                incomingMsgs = this.Pom.INCOMING_PARTIAL;
            }

            const msgListCount = await incomingMsgs.count();
            const lastMsg = incomingMsgs.nth(msgListCount - 1);
            const lastDropdown = this.Pom.FILESHARING_OPTION_DROPDOWN_BTN.nth(msgListCount - 1);
            await lastMsg.hover();
            await lastDropdown.click();
            await this.Pom.FILESHARING_DOWNLOAD_BTN.click();
        });
    }

    async checkLastRead() {
        await test.step('Chat Controller : Click Last Message Has Been Read', async () => {
            const timestampRegion = this.Pom.TIMESTAMP_CONTAINER;
            const timestampCount = await timestampRegion.count();
            const lastTimeStamp = timestampRegion.nth(timestampCount - 1);

            await lastTimeStamp.click();
            await expect(lastTimeStamp.locator('.icon-sent')).toBeVisible();
            await expect(lastTimeStamp.locator('.icon-read')).toBeVisible();
        });
    }

    async skipRecipientInfo() {
        await test.step('Chat Controller : Skip Adding Recipient Information', async () => {
            await this.Pom.RECIPIENT_INFO_SKIP_BUTTON.click();
        });
    }

    async fillRecipientInfoModal(firstName: string, lastName: string) {
        await test.step('Chat Controller : Fill first name and last name in Recipient Information modal', async () => {
            Log.info('Chat Controller : Fill first name and last name in Recipient Information modal');
            await this.Pom.RECIPIENT_INFO_FIRST_NAME_FIELD.fill(firstName);
            await this.Pom.RECIPIENT_INFO_LAST_NAME_FIELD.fill(lastName);
        });
        await test.step(`Chat Controller : Clicks on 'Save' button in Recipient Information modal`, async () => {
            Log.info(`Chat Controller : Clicks on 'Save' button in Recipient Information modal`);
            await this.Pom.RECIPIENT_INFO_SAVE_BUTTON.click();
        });
    }

    async backButton() {
        await test.step('Chat Controller: Naviagate back to Message Hub', async () => {
            await this.Pom.CHAT_BACK_BUTTON.click();
        });
    }

    async clickChatHeaderMenu() {
        await test.step('Chat Controller: Naviagate back to Message Hub', async () => {
            await this.Pom.CHAT_HEADER_MENU.click();
        });
    }

    async openChatDetails() {
        await test.step('Chat Controller: Open Chat Detail', async () => {
            await this.clickChatHeaderMenu();
            await this.Pom.DROP_DOWN_VIEW_DETAILS.click();
        });
    }

    async leaveChat() {
        await test.step('Chat Controller: Leave Chat and Naviagate back to Message Hub', async () => {
            await this.clickChatHeaderMenu();
            await this.Pom.DROP_DOWN_LEAVE.click();
        });
    }

    async muteConversation() {
        await test.step('Chat Controller: Mute Conversation', async () => {
            await this.clickChatHeaderMenu();
            await this.Pom.DROP_DOWN_MUTE.click();
        });
    }

    async unMuteConversation() {
        await test.step('Chat Controller: Mute Conversation', async () => {
            await this.clickChatHeaderMenu();
            await this.Pom.DROP_DOWN_UNMUTE.click();
        });
    }

    async clickInviteParicipants() {
        await test.step('Chat Controller: Leave Chat and Naviagate Search Module', async () => {
            await this.clickChatHeaderMenu();
            await this.Pom.DROP_DOWN_INVITE_PARTICIPANTS.click();
        });
    }

    async clickInviteParicipantsChannels() {
        await test.step('Chat Controller: Leave Chat and Naviagate Channel Details then invite particpants', async () => {
            await this.clickChatHeaderMenu();
            await this.Pom.DROP_DOWN_VIEW_DETAILS.click();
        });
    }

    async clickVoiceNotePlayButton() {
        await test.step('Chat Controller: Click voice note play button', async () => {
            await this.Pom.VOICE_NOTE_PLAY_BUTTON.click();
        });
    }

    async hoverOverMessageRow(content: string) {
        await test.step(`Chat Controller: Hover over message row with content '${content}'`, async () => {
            Log.info(`Chat Controller: Hover over message row with content '${content}'`);
            await this.Pom.MESSAGE_ROW_CONTAINER.getByText(content).click();
        });
    }

    async clickOnChatBubbleMenu() {
        await test.step(`Chat Controller: Click on chat bubble menu`, async () => {
            Log.info(`Chat Controller: Click on chat bubble menu`);
            await this.Pom.MENU_ICON.click();
        });
    }

    async selectFromChatBubbleMenu(option: 'Reply' | 'Copy to Share' | 'Download') {
        await test.step(`Chat Controller: Select ${option} from chat bubble menu`, async () => {
            Log.info(`Chat Controller: Select ${option} from chat bubble menu`);
            await this.Pom.CHAT_BUBBLE_MENU_DROPDOWN.getByText(option).click();
        });
    }

    async clickChatInput() {
        await test.step(`Chat Controller: Click chat input`, async () => {
            Log.info(`Chat Controller: Click chat input`);
            await this.Pom.CHAT_INPUT.click();
        });
    }

    async hoverOverChatArea() {
        await test.step(`Chat Controller: Hover over chat area`, async () => {
            Log.info(`Chat Controller: Hover over chat area`);
            await this.Pom.CHAT_WINDOW.hover();
        });
    }

    async selectFromChatHeaderMenu(
        selection:
            | 'View Details'
            | 'Print Conversation'
            | 'Select Messages'
            | 'Leave'
            | 'Hide'
            | 'Mute'
            | 'Unmute'
    ) {
        await test.step(`Chat Controller - Selecting ${selection} on Chat Header Menu`, async () => {
            Log.info(`Chat Controller - Selecting ${selection} on Chat Header Menu`);
            await this.Pom.CHAT_HEADER_MENU_DROP_DOWN.getByText(selection, { exact: true }).click();
        });
    }
}
