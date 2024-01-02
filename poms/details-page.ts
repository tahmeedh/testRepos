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
            '.m-auto-subject-edit-field .public-DraftEditor-content'
        );
        this.SUBJECT_EDIT_FIELD = this.CHATIFRAME.locator(
            '.m-auto-group-text-subject-edit-field .public-DraftEditor-content'
        );
        this.GROUP_TEXT_DETAIL_EDIT_BUTTON = this.CHATIFRAME.locator('.m-auto-edit-group-text-subject-btn');
        this.CHAT_SUBJECT_SAVE_BUTTON = this.CHATIFRAME.locator('.m-auto-saveEditBtn');
    }
}
