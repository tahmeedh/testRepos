import test, { type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { HubHeaderPage } from 'Poms/message-hub/hub-header-page';

export class HubHeaderController {
    readonly page: Page;
    readonly Pom: HubHeaderPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new HubHeaderPage(this.page);
    }

    async clickStartChatButton() {
        await test.step('Hub Header Controller : Click Start Chat Button', async () => {
            Log.info(`Hub Header Controller : Click Start Chat Button`);
            await this.Pom.START_CHAT.click();
        });
    }

    async selectHeaderMainMenuOption(option: 'One-to-One' | 'Multi-Party' | 'Text' | 'WhatsApp' | 'Channel') {
        await test.step(`Hub Header Controller : Selecting '${option}' option from start chat menu dropdown`, async () => {
            Log.info(`Hub Header Controller : Selecting '${option}' option from header main menu`);
            await this.Pom.START_CHAT_DROPDOWN.getByText(option).click();
        });
    }

    async fillSearchField(input: string) {
        await test.step(`Hub Header Controller: Enter'${input}' into search field`, async () => {
            Log.info(`Hub Header Controller: Enter '${input}' into search field`);
            await this.Pom.SEARCH_FIELD.fill(input);
        });
    }

    async clickOnSearchButton() {
        await test.step(`Hub Header Controller: Click on search button`, async () => {
            Log.info(`Hub Header Controller: Click on search button`);
            await this.Pom.SEARCH_BUTTON.click();
        });
    }
}
