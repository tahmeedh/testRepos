import type { Locator, Page } from '@playwright/test';
import { CreateChatPage } from '../poms/create-chat-page';
import { test } from '@playwright/test';

export class InviteController {
    readonly page: Page;
    readonly Pom : CreateChatPage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new CreateChatPage(this.page);
    }

    async acceptInvite (type : string = "SUC", title ?: string) {
        await test.step ("Create Chat Controller : Accept Invite", async() => {
            if (type == "MUC") {
                const invitePage = this.Pom.MESSAGEIFRAME.getByText(title);
                await invitePage.click();
                await this.Pom.ACCEPT_BUTTON_MUC.click();
            }
            if (type == "Channel") {
                const invitePage = this.Pom.MESSAGEIFRAME.getByText(title);
                await invitePage.click();
                await this.Pom.ACCEPT_BUTTON.click();
            }
            if (type == "SUC") {
                await this.Pom.ACCEPT_BUTTON.click();
            }
        })
    }

    async declineInvite (type : string = "SUC", title ?: string) {
        await test.step ("Create Chat Controller : Accept Invite", async() => {
            if (type == "MUC") {
                const invitePage = this.Pom.MESSAGEIFRAME.getByText(title);
                await invitePage.click();
                await this.Pom.DECLINE_BUTTON_MUC.click();
            }
            if (type == "Channel") {
                const invitePage = this.Pom.MESSAGEIFRAME.getByText(title);
                await invitePage.click();
                await this.Pom.DECLINE_BUTTON.click();
            }
            if (type == "SUC") {
                await this.Pom.DECLINE_BUTTON.click();
            }
        })
    }



    

    







}