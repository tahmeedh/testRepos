import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class HubHeaderPage extends BasePage {
    readonly page: Page;
    readonly START_CHAT: Locator;
    readonly START_CHAT_DROPDOWN: Locator;
    readonly SEARCH_FIELD: Locator;
    readonly SEARCH_BUTTON: Locator;

    constructor(page: Page) {
        super(page);
        this.START_CHAT = this.MESSAGEIFRAME.locator('.m-auto-start-new-chat');
        this.START_CHAT_DROPDOWN = this.MESSAGEIFRAME.locator('.m-auto-start-chat-menu-dropdown');
        this.SEARCH_FIELD = this.MESSAGEIFRAME.getByPlaceholder('Search people and channels');
        this.SEARCH_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-globalsearch-search-button');
    }
}
