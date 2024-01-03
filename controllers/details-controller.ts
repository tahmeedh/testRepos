import type { Page } from '@playwright/test';
import { test } from '@playwright/test';
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

    async renameMUC(subjectName: string) {
        await test.step('Detail Controller: Rename Chat', async () => {
            await this.Pom.MUC_DETAIL_EDIT_BUTTON.click();
            await this.Pom.MUC_SUBJECT_EDIT_FIELD.fill(subjectName);
            await this.Pom.CHAT_SUBJECT_SAVE_BUTTON.click();
        });
    }

    async renameGroupChat(subjectName: string) {
        await test.step('Detail Controller: Rename Chat', async () => {
            await this.Pom.GROUP_TEXT_DETAIL_EDIT_BUTTON.click();
            await this.Pom.GROUP_TEXT_SUBJECT_EDIT_FIELD.fill(subjectName);
            await this.Pom.CHAT_SUBJECT_SAVE_BUTTON.click();
        });
    }
    Chat;
}
