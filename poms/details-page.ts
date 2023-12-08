import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class DetailsPage extends BasePage {
    readonly MEMBER_ROLES_BUTTON: Locator;
    readonly PARTICIPANT_ROW_MENU: Locator;
    readonly PARTICIPANT_ROW: Locator;
    readonly DROP_DOWN_REMOVE: Locator;
    readonly DROP_DOWN_PROMPT_TO_MODERATOR: Locator;

    constructor(page: Page) {
        super(page);

        this.MEMBER_ROLES_BUTTON = this.CHATIFRAME.locator('.m-auto-members-roles-button');
        this.PARTICIPANT_ROW_MENU = this.CHATIFRAME.locator('.participant-menu');
        this.PARTICIPANT_ROW = this.CHATIFRAME.locator('.m-auto-participant-row');
        this.DROP_DOWN_REMOVE = this.CHATIFRAME.getByText('Remove');
        this.DROP_DOWN_PROMPT_TO_MODERATOR = this.CHATIFRAME.getByText('Promote to Moderator');
    }
}
