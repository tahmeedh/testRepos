import type { Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
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
}
