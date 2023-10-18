import type { Page } from '@playwright/test';
import { test, expect } from '@playwright/test';
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

    async sendContent(message: string) {
        await test.step('Chat Controller : Send Content', async () => {
            await this.Pom.CHAT_INPUT_WRAPPER.click();
            await this.Pom.CHAT_INPUT.fill(message);
            await this.Pom.SEND_BUTTON.click();
        });
    }

    async waitForHeader() {
        await test.step('Base Controller : Wait For Header', async () => {
            await expect(this.Pom.CHAT_HEADER_MENU).toBeVisible();
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
}
