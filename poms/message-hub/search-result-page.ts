import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class SearchResultPage extends BasePage {
    readonly page: Page;
    readonly SEARCH_RESULT_ROW: Locator;

    constructor(page: Page) {
        super(page);

        this.SEARCH_RESULT_ROW = this.MESSAGEIFRAME.locator('.m-auto-contact-list-user-row');
    }
}
