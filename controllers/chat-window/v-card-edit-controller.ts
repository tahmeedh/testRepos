import { test, type Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { VCardEditPage } from 'Poms/chat-window/v-card-edit-page';

export class VCardEditController {
    readonly page: Page;
    readonly Pom: VCardEditPage;

    constructor(page: Page) {
        this.page = page;
        this.Pom = new VCardEditPage(this.page);
    }

    async clickOnSaveButton() {
        await test.step(`VCard Edit Controller: Click on save button`, async () => {
            Log.info(`VCard Edit Controller: Click on save button`);
            await this.Pom.SAVE_BUTTON.click();
        });
    }

    async clickOnCancelButton() {
        await test.step(`VCard Edit Controller: Click on cancel button`, async () => {
            Log.info(`VCard Edit Controller: Click on cancel button`);
            await this.Pom.CANCEL_BUTTON.click();
        });
    }

    async fillFirstNameField(input: string) {
        await test.step(`VCard Edit Controller: Fill first name field with '${input}'`, async () => {
            Log.info(`VCard Edit Controller: Fill first name field with '${input}'`);
            await this.Pom.FIELD_FIRST_NAME.fill(input);
        });
    }

    async fillLastNameField(input: string) {
        await test.step(`VCard Edit Controller: Fill last name field with '${input}'`, async () => {
            Log.info(`VCard Edit Controller: Fill last name field with '${input}'`);
            await this.Pom.FIELD_LAST_NAME.fill(input);
        });
    }

    async fillCompanyField(input: string) {
        await test.step(`VCard Edit Controller: Fill company field with '${input}'`, async () => {
            Log.info(`VCard Edit Controller: Fill company field with '${input}'`);
            await this.Pom.FIELD_COMPANY.fill(input);
        });
    }

    async fillJobTitleField(input: string) {
        await test.step(`VCard Edit Controller: Fill job title field with '${input}'`, async () => {
            Log.info(`VCard Edit Controller: Fill job title field with '${input}'`);
            await this.Pom.FIELD_JOB_TITLE.fill(input);
        });
    }

    async fillEmailField(input: string) {
        await test.step(`VCard Edit Controller: Fill email field with '${input}'`, async () => {
            Log.info(`VCard Edit Controller: Fill email field with '${input}'`);
            await this.Pom.FIELD_EMAIL.fill(input);
        });
    }
}
