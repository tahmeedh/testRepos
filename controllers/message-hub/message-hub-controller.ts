import { type Page } from '@playwright/test';
import { MessageHubPage } from 'Poms/message-hub/message-hub-page';

export class MessageHubController {
    readonly page: Page;
    readonly Pom: MessageHubPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new MessageHubPage(this.page);
    }
}
