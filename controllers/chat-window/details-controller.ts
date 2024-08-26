import type { Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { test } from '@playwright/test';
import { DetailsPage } from 'Poms/chat-window/details-page';
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

    async clickSelectParticipants() {
        await test.step('Details Controller: Click Select participants button', async () => {
            await this.Pom.SELECT_PARTICIPANTS.click();
        });
    }

    async clickSelectParticipantsMUC() {
        await test.step('Details Controller: Click Select participants button', async () => {
            await this.Pom.SELECT_PARTICIPANTS_MUC.click();
        });
    }

    async selectParticipant(userName: string) {
        await test.step(`Details Controller: Select participants ${userName}`, async () => {
            await this.Pom.CONTACT_LIST_USER_ROW.getByText(userName).first().click();
        });
    }

    async clickFooterButton(buttonText: 'Select' | 'Cancel') {
        await test.step(`Details Controller: Click on '${buttonText}' button`, async () => {
            Log.info(`Details Controller: Click on '${buttonText}' button`);
            await this.Pom.BUTTON.getByText(buttonText).click();
        });
    }

    async hoverParticipantListAvatarByName(userName: string) {
        await test.step(`Details Controller: Hover over the avatar on row '${userName}'`, async () => {
            Log.info(`Details Controller: Hover over the avatar on row '${userName}'`);
            await this.Pom.DETAILS_PARTICIPANTS_LIST.getByText(userName)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .hover();
        });
    }

    async hoverAdministratorListAvatarByName(userName: string) {
        await test.step(`Details Controller: Hover over administrator list avatar on row '${userName}'`, async () => {
            Log.info(`Details Controller: Hover over administrator list avatar on row '${userName}'`);
            await this.Pom.ADMINISTRATOR_LIST.getByText(userName)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .hover();
        });
    }

    async hoverSearchResultsAvatarByName(userName: string) {
        await test.step(`Details Controller: Hover over the avatar on row '${userName}'`, async () => {
            Log.info(`Details Controller: Hover over the avatar on row '${userName}'`);
            await this.Pom.MSC_CONTACT_LIST_ITEM.getByText(userName)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .hover();
        });
    }
}
