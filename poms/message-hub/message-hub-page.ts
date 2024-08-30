import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class MessageHubPage extends BasePage {
    readonly page: Page;
    readonly HUB_CONTAINER: Locator;
    readonly WELCOME_TEXT: Locator;
    readonly GR_MESSAGE_LOGO: Locator;
    readonly ERROR_PAGE_TITLE: Locator;
    readonly NO_PERMISSION_ERROR_TITLE: Locator;

    constructor(page: Page) {
        super(page);
        this.HUB_CONTAINER = this.MESSAGEIFRAME.locator('.hub-container');
        this.WELCOME_TEXT = this.MESSAGEIFRAME.locator('.m-auto-welcome-container-text');
        this.GR_MESSAGE_LOGO = this.MESSAGEIFRAME.getByTestId('gr-msg-logo');
        this.ERROR_PAGE_TITLE = this.MESSAGEIFRAME.getByTestId('error-page-title');
        this.NO_PERMISSION_ERROR_TITLE = this.MESSAGEIFRAME.getByTestId('no-permission-error-content');
    }
}
