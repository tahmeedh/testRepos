import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { GlobalSearchPage } from 'Poms/message-hub/global-search-page';

export class GlobalSearchController {
    readonly page: Page;
    readonly Pom: GlobalSearchPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new GlobalSearchPage(this.page);
    }

    async fillSearchField(input: string) {
        await test.step(`Global Search Controller: Enter'${input}' into search field`, async () => {
            Log.info(`Global Search Controller: Enter '${input}' into search field`);
            await this.Pom.SEARCH_FIELD.fill(input);
        });
    }

    async clickOnSearchButton() {
        await test.step(`Global Search Controller: Click on search button`, async () => {
            Log.info(`Global Search Controller: Click on search button`);
            await this.Pom.SEARCH_BUTTON.click();
        });
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
