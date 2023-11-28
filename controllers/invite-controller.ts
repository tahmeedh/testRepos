import type { Page } from '@playwright/test';
import { test } from '@playwright/test';
import { CreateChatPage } from '../poms/create-chat-page';

export class InviteController {
    readonly page: Page;
    readonly Pom: CreateChatPage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new CreateChatPage(this.page);
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
}
