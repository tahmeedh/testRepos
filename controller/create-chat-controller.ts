import type { Page } from '@playwright/test';
import { test } from '@playwright/test';
import { CreateChatPage } from '../poms/create-chat-page';
/* eslint-disable no-await-in-loop */

export class CreateChatController {
    readonly page: Page;
    readonly Pom: CreateChatPage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new CreateChatPage(this.page);
    }

    async CreateSUC(username: string) {
        await test.step('Create Chat Controller : create SUC', async () => {
            // Search for user
            await this.Pom.SUC_SEARCH_INPUT.click();
            await this.Pom.SUC_SEARCH_INPUT.fill(username);
            // click on user
            await this.Pom.CHATIFRAME.getByText(username).click();
        });
    }

    async createMUC(users: string[], subject: string) {
        await test.step('Create Chat Controller : Select User', async () => {
            for (const username of users) {
                await this.Pom.MUC_SEARCH_INPUT.click();
                await this.Pom.MUC_SEARCH_INPUT.fill(username);
                await this.Pom.CHATIFRAME.getByText(username).click();
            }
            await this.Pom.NEXT_BUTTON.click();
            // add subject name to MUC
            await this.Pom.INPUT_SUBJECT.fill(subject);
            await this.Pom.NEXT_BUTTON.click();
        });
    }

    // Create Channel
    async fillOutWhatIsItAboutForm(name: string, subject: string, description: string) {
        await test.step('Create Chat Controller : Fill Out What Is About Form', async () => {
            await this.Pom.CHANNEL_NAME_BUTTON.fill(name);
            await this.Pom.CHANNEL_SUBJECT_REGION.fill(subject);
            await this.Pom.CHANNEL_DESCRIPTION_REGION.fill(description);
            await this.Pom.NEXT_BUTTON.click();
        });
    }

    async fillOutWhoCanPostForm(company?: string) {
        await test.step('Create Channel Controller : Fill Out Who Can Post', async () => {
            if (company) {
                this.Pom.ADD_COMPANIES_BUTTON.click();
                // search
                await this.Pom.COMPANY_SEARCH_INPUT.click();
                await this.Pom.COMPANY_SEARCH_INPUT.fill(company);
                await this.Pom.CHATIFRAME.getByText(company).click();
                await this.Pom.SELECT_BUTTON.click();
            }
            await this.Pom.NEXT_BUTTON.click();
        });
    }

    async fillOutWhoCanJoinForm(type: string, moderators: string[], participants: string[]) {
        await test.step('Create Chat Controller : Fill Out Who Can Join', async () => {
            if (type === 'open') {
                await this.Pom.INPUT_RADIO_OPEN_CHANNEL.click();
            }
            if (moderators.length !== 0) {
                await this.Pom.SELECT_MODERATORS_BUTTON.click();
                // Search for moderator
                for (const modertor of moderators) {
                    await this.Pom.SELECT_MODERATORS_INPUT.click();
                    await this.Pom.SELECT_MODERATORS_INPUT.fill(modertor);
                    await this.Pom.CHATIFRAME.getByText(modertor).click();
                }
                await this.Pom.SELECT_BUTTON.click();
            }
            if (participants.length !== 0) {
                await this.Pom.SELECT_PARTICIPANTS_BUTTON.click();
                // serach for participants
                for (const participant of participants) {
                    await this.Pom.SELECT_PARTICIPANTS_INPUT.click();
                    await this.Pom.SELECT_PARTICIPANTS_INPUT.fill(participant);
                    await this.Pom.CHATIFRAME.getByText(participant).click();
                }
                await this.Pom.SELECT_BUTTON.click();
            }
        });
    }

    async CreateChannel() {
        await test.step('Create Chat Controller : Confirm Create Channel', async () => {
            await this.Pom.CREATE_BUTTON.click();
        });
    }
}
