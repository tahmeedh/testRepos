import type { Page } from '@playwright/test';
import { test } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { InvitePage } from 'Poms/chat-window/invite-page';

export class InviteController {
    readonly page: Page;
    readonly Pom: InvitePage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new InvitePage(this.page);
    }

    async acceptInvite(type = 'SUC') {
        await test.step('Invite Controller : Accept Invite', async () => {
            if (type === 'MUC') {
                await this.Pom.ACCEPT_BUTTON_MUC.click();
            } else {
                await this.Pom.ACCEPT_BUTTON.click();
            }
        });
    }

    async declineInvite(type = 'SUC') {
        await test.step('Invite Controller : Accept Invite', async () => {
            if (type === 'MUC') {
                await this.Pom.DECLINE_BUTTON_MUC.click();
            } else {
                await this.Pom.DECLINE_BUTTON.click();
            }
        });
    }

    async clickJoin() {
        await test.step('Invite Controller : Click Join', async () => {
            await this.Pom.JOIN_BUTTON.click();
        });
    }

    async clickFooterButton(buttonText: 'Accept' | 'Decline' | 'Hide') {
        await test.step(`Invite Controller: Click on '${buttonText}' button`, async () => {
            Log.info(`Invite Controller: Click on '${buttonText}' button`);
            await this.Pom.CHAT_ACTION_FOOTER_BUTTON.getByText(buttonText).last().click();
        });
    }

    async clickMemberRolesButton() {
        await test.step(`Invite Controller: Click members and roles button`, async () => {
            Log.info(`Invite Controller: Click members and roles button`);
            await this.Pom.MEMBER_ROLES_BUTTON.click();
        });
    }

    async hoverHeaderAvatar() {
        await test.step(`Invite Controller: Hover over chat header avatar`, async () => {
            Log.info(`Invite Controller: Hover over chat header avatar`);
            await this.Pom.HEADER_AVATAR.hover();
        });
    }

    async hoverParticipantListAvatarByName(userName: string) {
        await test.step(`Invite Controller: Hover over the avatar on row '${userName}'`, async () => {
            Log.info(`Invite Controller: Hover over the avatar on row '${userName}'`);
            await this.Pom.DETAILS_PARTICIPANTS_LIST.getByText(userName)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .hover();
        });
    }

    async hoverAdministratorListAvatarByName(userName: string) {
        await test.step(`Invite Controller: Hover over administrator list avatar on row '${userName}'`, async () => {
            Log.info(`Invite Controller: Hover over administrator list avatar on row '${userName}'`);
            await this.Pom.ADMINISTRATOR_LIST.getByText(userName)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .hover();
        });
    }
}
