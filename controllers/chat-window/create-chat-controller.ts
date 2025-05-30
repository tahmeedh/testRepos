import type { Page } from '@playwright/test';
import { test } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { CreateChatPage } from 'Poms/chat-window/create-chat-page';
import { StringUtils } from 'helper/string-utils';
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
            Log.info(`Search for ${username}`);
            await this.Pom.SUC_SEARCH_INPUT.click();
            await this.Pom.SUC_SEARCH_INPUT.fill(username);
            // click on user
            await this.Pom.CHATIFRAME.getByText(username).click();
        });
    }

    async createMUC(users: string[], subject: string = StringUtils.generateString()) {
        return test.step('Create Chat Controller : Select User', async () => {
            for (const username of users) {
                Log.info(`Search for ${username}`);
                await this.Pom.MUC_SEARCH_INPUT.click();
                await this.Pom.MUC_SEARCH_INPUT.fill(username);
                await this.Pom.CHATIFRAME.getByText(username).first().click();
            }
            await this.Pom.NEXT_BUTTON.click();
            // add subject name to MUC
            await this.Pom.INPUT_SUBJECT.fill(subject);
            await this.Pom.NEXT_BUTTON.click();

            return subject;
        });
    }

    async CreateSMS(phoneNumber: string = StringUtils.generatePhoneNumber()) {
        return test.step('Create Chat Controller : create SMS', async () => {
            Log.info(`Search for ${phoneNumber}`);
            const formatted = StringUtils.formatPhoneNumber(phoneNumber);
            await this.Pom.EXTERNAL_SEARCH_INPUT.click();
            await this.Pom.EXTERNAL_SEARCH_INPUT.fill(formatted);
            // click on user
            await this.Pom.CHATIFRAME.getByText(formatted).click();
            await this.Pom.NEXT_BUTTON.click();

            return formatted;
        });
    }

    async SearchAndSelectSMSUser(username) {
        return test.step('Seach and select the internal user to create SMS', async () => {
            await this.Pom.EXTERNAL_SEARCH_INPUT.click();
            await this.Pom.EXTERNAL_SEARCH_INPUT.fill(username);
            // click on user
            await this.Pom.CHATIFRAME.getByText(username).first().click();
            await this.Pom.NEXT_BUTTON.click();
        });
    }

    async CreateInternalText(phoneNumber: string) {
        const formatted = StringUtils.formatPhoneNumber(phoneNumber);

        // click on user
        await this.Pom.CHATIFRAME.getByText(formatted.trim()).click();
        await this.Pom.NEXT_BUTTON.click();
    }

    async CreateGroupText(phoneNumbers: string[]) {
        return test.step('Create Chat Controller : Select User', async () => {
            for (const phoneNumber of phoneNumbers) {
                const formatted = StringUtils.formatPhoneNumber(phoneNumber);
                Log.info(`Search for ${formatted}`);
                await this.Pom.SMS_SEARCH_INPUT.click();
                await this.Pom.SMS_SEARCH_INPUT.fill(formatted);
                // click on user
                await this.Pom.CHATIFRAME.getByText(formatted).click();
            }
            await this.Pom.NEXT_BUTTON.click();
        });
    }

    async SearchSMSUser(username: string = StringUtils.generatePhoneNumber()) {
        return test.step(`Create Chat Controller : Search for user '${username}' in create SMS view`, async () => {
            Log.info(`Create Chat Controller : Search for user '${username}' in create SMS view`);
            await this.Pom.EXTERNAL_SEARCH_INPUT.click();
            await this.Pom.EXTERNAL_SEARCH_INPUT.fill(username);
            return username;
        });
    }

    async SearchMucUser(username: string = StringUtils.generatePhoneNumber()) {
        return test.step('Create Chat Controller : create SMS', async () => {
            Log.info(`Search for ${username}`);
            await this.Pom.MUC_SEARCH_INPUT.click();
            await this.Pom.MUC_SEARCH_INPUT.fill(username);
            return username;
        });
    }

    async SearchSucUser(username: string = StringUtils.generatePhoneNumber()) {
        return test.step('Create Chat Controller : create SMS', async () => {
            Log.info(`Search for ${username}`);
            await this.Pom.SUC_SEARCH_INPUT.click();
            await this.Pom.SUC_SEARCH_INPUT.fill(username);
            return username;
        });
    }

    async CreateWhatsapp(phoneNumber: string = StringUtils.generatePhoneNumber()) {
        return test.step('Create Chat Controller : create SUC', async () => {
            // Search for user
            const formatted = StringUtils.formatPhoneNumber(phoneNumber);
            await this.Pom.EXTERNAL_SEARCH_INPUT.click();
            await this.Pom.EXTERNAL_SEARCH_INPUT.fill(formatted);
            // click on user
            await this.Pom.CHATIFRAME.getByText(formatted).click();
            await this.Pom.NEXT_BUTTON.click();

            return formatted;
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
                await this.Pom.INPUT_RADIO_OPEN_CHANNEL.check();
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

    async inviteMUC(users: string[]) {
        await test.step('Create Chat Controller : Select User', async () => {
            for (const username of users) {
                Log.info(`Search for ${username}`);
                await this.SearchMucUser(username);
                await this.Pom.CHATIFRAME.getByTestId('contact-list-user-row').getByText(username).click();
            }
            await this.Pom.INVITE_BUTTON.click();
        });
    }

    async inviteChannels(participants: string[]) {
        await test.step('Create Chat Controller : Select Participants in channels', async () => {
            if (participants.length !== 0) {
                await this.Pom.SELECT_PARTICIPANTS_BUTTON.click();
                for (const participant of participants) {
                    Log.info(`Search for ${participant}`);
                    await this.Pom.SELECT_PARTICIPANTS_INPUT.click();
                    await this.Pom.SELECT_PARTICIPANTS_INPUT.fill(participant);
                    await this.Pom.CHATIFRAME.getByTestId('contact-list-user-row')
                        .getByText(participant)
                        .click();
                }
                await this.Pom.SELECT_BUTTON.click();
            }
        });
    }

    async clickOnSearchComponentRowAvatar(userName: string) {
        await test.step(`Create Chat Controller: Click on the first row with name'${userName}'`, async () => {
            Log.info(`Create Chat Controller: Click on first row with name '${userName}'`);
            await this.Pom.SEARCH_COMPONENT_CONTACT_ROW.getByText(userName)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .click();
        });
    }

    async clickRowAvatarByPhoneNumber(phoneNumber: string) {
        await test.step(`Create Chat Controller: Click on the first row with phone number'${phoneNumber}'`, async () => {
            Log.info(`Create Chat Controller: Click on first row with phone number '${phoneNumber}'`);
            await this.Pom.SEARCH_COMPONENT_CONTACT_ROW.getByText(phoneNumber)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .click();
        });
    }

    async clickUserRowInternal(userName: string) {
        await test.step(`Create Chat Controller: Click on the row with user name'${userName}'`, async () => {
            Log.info(`Create Chat Controller: Click on the row with user name'${userName}'`);
            await this.Pom.NAME.getByText(userName).click();
        });
    }

    async clickAvatarByRow(rowNumber: number) {
        await test.step(`Create Chat Controller: Click on the avatar on row '${rowNumber}'`, async () => {
            Log.info(`Create Chat Controller: Click on the avatar on row '${rowNumber}'`);
            await this.Pom.AVATAR.nth(rowNumber).click();
        });
    }

    async clickFooterButton(buttonText: 'Next' | 'Cancel' | 'Select') {
        await test.step(`Create Chat Controller: Click on '${buttonText}' button`, async () => {
            Log.info(`Create Chat Controller: Click on '${buttonText}' button`);
            await this.Pom.BUTTON.getByText(buttonText).click();
        });
    }

    async clickOnCancelButton() {
        await test.step(`Create Chat Controller: Click on 'Cancel' button`, async () => {
            Log.info(`Create Chat Controller: Click on 'Cancel' button`);
            await this.Pom.CANCEL_BUTTON.click();
        });
    }

    async fillExternalSearchField(input: string) {
        await test.step(`Create Chat Controller: Fill External Search Field`, async () => {
            Log.info(`Create Chat Controller: Fill External Search Field`);
            await this.Pom.EXTERNAL_SEARCH_INPUT.fill(input);
        });
    }

    async clickAddPhoneNumber() {
        await test.step(`Create Chat Controller: Click Add Phone Number`, async () => {
            Log.info(`Create Chat Controller: Click Add Phone Number`);
            await this.Pom.ADD_EXTERNAL_NUMBER.click();
        });
    }

    async hoverAvatarByName(userName: string) {
        await test.step(`Create Chat Controller: Hover over the avatar on row '${userName}'`, async () => {
            Log.info(`Create Chat Controller: Hover over the avatar on row '${userName}'`);
            await this.Pom.MSC_CONTACT_LIST_ITEM.getByText(userName)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .hover();
        });
    }

    async hoverAvatarByNameExternal(userName: string) {
        await test.step(`Create Chat Controller: Hover over the avatar on row '${userName}' external`, async () => {
            Log.info(`Create Chat Controller: Hover over the avatar on row '${userName}' external `);
            await this.Pom.SEARCH_COMPONENT_CONTACT_ROW.getByText(userName)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .hover();
        });
    }

    async fillChannelName(channelName: string) {
        await test.step(`Create Chat Controller: Fill channel name ${channelName}`, async () => {
            Log.info(`Create Chat Controller: Fill channel name as ${channelName}`);
            await this.Pom.CHANNEL_NAME_BUTTON.fill(channelName);
        });
    }

    async clickAddModeratorBtn() {
        await test.step(`Create Chat Controller: Click add moderator button`, async () => {
            Log.info(`Create Chat Controller: Click add moderator button`);
            await this.Pom.SELECT_MODERATORS_BUTTON.click();
        });
    }

    async hoverParticipantListAvatarByName(userName: string) {
        await test.step(`Create Chat Controller: Hover over the avatar on row '${userName}'`, async () => {
            Log.info(`Create Chat Controller: Hover over the avatar on row '${userName}'`);
            await this.Pom.DETAILS_PARTICIPANTS_LIST.getByText(userName)
                .first()
                .locator('../..')
                .locator('.m-auto-avatar-container')
                .hover();
        });
    }
}
