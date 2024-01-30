import type { Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { test } from '@playwright/test';
import { DetailsPage } from '../poms/details-page';
/* eslint-disable no-await-in-loop */

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
        Log.info(`Click Member and Roles Button`);
        await this.Pom.MEMBER_ROLES_BUTTON.click();
    }

    async RemoveUsersFromChannel(participants: string[]) {
        for (const participant of participants) {
            Log.info(`Check if ${participant} already in channel`);
            await this.Pom.PARTICIPANT_ROW_MENU.first().click();
            await this.Pom.DROP_DOWN_REMOVE.click();
        }
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
