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
        await test.step('Create Chat Controller : Accept Invite', async () => {
            if (type === 'MUC') {
                await this.Pom.ACCEPT_BUTTON_MUC.click();
            } else {
                await this.Pom.ACCEPT_BUTTON.click();
            }
        });
    }

    async declineInvite(type = 'SUC') {
        await test.step('Create Chat Controller : Accept Invite', async () => {
            if (type === 'MUC') {
                await this.Pom.DECLINE_BUTTON_MUC.click();
            } else {
                await this.Pom.DECLINE_BUTTON.click();
            }
        });
    }

    async clickJoin() {
        await test.step('Re-join SUC Chat : Click Join', async () => {
            await this.Pom.JOIN_BUTTON.click();
        });
    }

    async clickFooterButton(buttonText: 'Accept' | 'Decline' | 'Hide') {
        await test.step(`Create Chat Controller: Click on '${buttonText}' button`, async () => {
            Log.info(`Create Chat Controller: Click on '${buttonText}' button`);
            await this.Pom.CHAT_ACTION_FOOTER_BUTTON.getByText(buttonText).last().click();
        });
    }
}
