import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { SearchResultPage } from 'Poms/message-hub/search-result-page';

export class SearchResultController {
    readonly page: Page;
    readonly Pom: SearchResultPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new SearchResultPage(this.page);
    }

    async clickOnSearchResultRowAvatar(userName: string) {
        await test.step(`Global Search Controller: Click on global search row ${userName}`, async () => {
            Log.info(`Global Search Controller: Click on global search row '${userName}'`);
            await this.Pom.SEARCH_RESULT_ROW.getByText(userName)
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .click();
        });
    }
}
