import { type Page } from '@playwright/test';
import { ErrorPage } from 'Poms/message-hub/error-page';

export class ErrorController {
    readonly page: Page;
    readonly Pom: ErrorPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new ErrorPage(this.page);
    }
}
