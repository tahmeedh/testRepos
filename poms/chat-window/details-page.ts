import type { Locator, Page } from '@playwright/test';
import { BasePage } from '../base-page';

export class DetailsPage extends BasePage {
    readonly MEMBER_ROLES_BUTTON: Locator;
    readonly PARTICIPANT_ROW_MENU: Locator;
    readonly PARTICIPANT_ROW: Locator;
    readonly DROP_DOWN_REMOVE: Locator;
    readonly DROP_DOWN_PROMPT_TO_MODERATOR: Locator;
    readonly GROUP_TEXT_DETAIL_EDIT_BUTTON: Locator;
    readonly GROUP_TEXT_SUBJECT_EDIT_FIELD: Locator;
    readonly MUC_DETAIL_EDIT_BUTTON: Locator;
    readonly MUC_SUBJECT_EDIT_FIELD: Locator;
    readonly CHAT_SUBJECT_SAVE_BUTTON: Locator;

    constructor(page: Page) {
        super(page);

        this.MEMBER_ROLES_BUTTON = this.CHATIFRAME.locator('.m-auto-members-roles-button');
        this.PARTICIPANT_ROW_MENU = this.CHATIFRAME.locator('.participant-menu');
        this.PARTICIPANT_ROW = this.CHATIFRAME.locator('.m-auto-participant-row');
        this.DROP_DOWN_REMOVE = this.CHATIFRAME.getByText('Remove');
        this.DROP_DOWN_PROMPT_TO_MODERATOR = this.CHATIFRAME.getByText('Promote to Moderator');
        this.MUC_DETAIL_EDIT_BUTTON = this.CHATIFRAME.locator('.m-auto-edit-subject-btn');
        this.MUC_SUBJECT_EDIT_FIELD = this.CHATIFRAME.locator(
            '.m-auto-subject-edit-field .public-DraftEditor-content'
        );
        this.GROUP_TEXT_SUBJECT_EDIT_FIELD = this.CHATIFRAME.locator(
            '.m-auto-group-text-subject-edit-field .public-DraftEditor-content'
        );
        this.GROUP_TEXT_DETAIL_EDIT_BUTTON = this.CHATIFRAME.locator('.m-auto-edit-group-text-subject-btn');
        this.CHAT_SUBJECT_SAVE_BUTTON = this.CHATIFRAME.locator('.m-auto-saveEditBtn');
    }
}
