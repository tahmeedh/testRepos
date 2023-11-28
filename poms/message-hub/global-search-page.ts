import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class GlobalSearchPage extends BasePage {
    readonly page: Page;
    readonly SEARCH_FIELD: Locator;
    readonly SEARCH_BUTTON: Locator;
    readonly SEARCH_RESULT_ROW: Locator;

    constructor(page: Page) {
        super(page);

        this.SEARCH_FIELD = this.MESSAGEIFRAME.getByPlaceholder('Search people and channels');
        this.SEARCH_BUTTON = this.MESSAGEIFRAME.locator('.m-auto-globalsearch-search-button');
        this.SEARCH_RESULT_ROW = this.MESSAGEIFRAME.locator('.m-auto-contact-list-user-row');
    }
}
