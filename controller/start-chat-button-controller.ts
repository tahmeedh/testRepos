import type { Locator, Page } from '@playwright/test';
import { test } from '@playwright/test';
import { StartChatButtonPage } from '../poms/start-chat-button-page';

export class StartChatButtonController {
    readonly page: Page;
    readonly Pom: StartChatButtonPage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new StartChatButtonPage(this.page);
    }

    async clickOnStartButton(chatTypeButton: Locator) {
        await test.step('Start Chat Button Controller : Click Start Button', async () => {
            await this.Pom.START_CHAT.click();
            await chatTypeButton.click();
        });
    }

    async ClickOnStartOneToOne() {
        await this.clickOnStartButton(this.Pom.START_ONE_ON_ONE);
    }

    async ClickOnStartMUC() {
        await this.clickOnStartButton(this.Pom.START_MUC);
    }

    async ClickOnStartSMS() {
        await this.clickOnStartButton(this.Pom.START_SMS);
    }

    async ClickOnStartWhatsapp() {
        await this.clickOnStartButton(this.Pom.START_WHATSAPP);
    }

    async ClickOnStartChannel() {
        await this.clickOnStartButton(this.Pom.START_CHANNEL);
    }
}
