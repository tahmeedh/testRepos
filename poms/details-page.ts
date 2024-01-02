import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class DetailsPage extends BasePage {
    readonly MEMBER_ROLES_BUTTON: Locator;
    readonly GROUP_TEXT_DETAIL_EDIT_BUTTON: Locator;
    readonly SUBJECT_EDIT_FIELD: Locator;
    readonly CHAT_DETAIL_EDIT_BUTTON: Locator;
    readonly CHAT_SUBJECT_EDIT_FIELD: Locator;
    readonly CHAT_SUBJECT_SAVE_BUTTON: Locator;

    constructor(page: Page) {
        super(page);

        this.MEMBER_ROLES_BUTTON = this.CHATIFRAME.locator('.m-auto-members-roles-button');
        this.CHAT_DETAIL_EDIT_BUTTON = this.CHATIFRAME.locator('.m-auto-edit-subject-btn');
        this.CHAT_SUBJECT_EDIT_FIELD = this.CHATIFRAME.locator(
            'xpath=//*[@id="root"]/div[2]/div[2]/div/div[1]/div/div[2]/div[1]/div/div/div/div/div/div/div'
        );
        // this.SUBJECT_EDIT_FIELD = this.CHATIFRAME.getByPlaceholder('Enter subject');
        this.SUBJECT_EDIT_FIELD = this.CHATIFRAME.locator(
            'xpath=//*[@id="root"]/div[2]/div/div/div[1]/div/div[2]/div[1]/div/div/div[2]/div'
        );
        this.GROUP_TEXT_DETAIL_EDIT_BUTTON = this.CHATIFRAME.locator('.m-auto-edit-group-text-subject-btn');
        this.CHAT_SUBJECT_SAVE_BUTTON = this.CHATIFRAME.locator('.m-auto-saveEditBtn');
    }
}
