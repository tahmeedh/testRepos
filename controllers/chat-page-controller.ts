import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
import { StringUtils } from 'helper/string-utils';
import { ChatPage } from '../poms/chat-page';

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

    async typeContent(message: string = StringUtils.generateString()) {
        await test.step('Chat Controller : Send Content', async () => {
            await this.Pom.CHAT_INPUT_WRAPPER.click();
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

    async leaveChat() {
        await test.step('Chat Controller: Leave Chat and Naviagate back to Message Hub', async () => {
            await this.clickChatHeaderMenu();
            await this.Pom.DROP_DOWN_LEAVE.click();
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
}
