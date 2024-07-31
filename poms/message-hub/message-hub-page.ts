import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class MessageHubPage extends BasePage {
    readonly page: Page;
    readonly HUB_CONTAINER: Locator;
    readonly WELCOME_TEXT: Locator;

    constructor(page: Page) {
        super(page);
        this.HUB_CONTAINER = this.MESSAGEIFRAME.locator('.hub-container');
        this.WELCOME_TEXT = this.MESSAGEIFRAME.locator('.m-auto-welcome-container-text');
    }
}
