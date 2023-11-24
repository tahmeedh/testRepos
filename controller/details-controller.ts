import type { Page } from '@playwright/test';
import { DetailsPage } from '../poms/details-page';

export class DetailsController {
    readonly page: Page;
    readonly Pom: DetailsPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new DetailsPage(this.page);
    }

    async clickMemberRolesButton() {
        this.Pom.MEMBER_ROLES_BUTTON.click();
    }
}
