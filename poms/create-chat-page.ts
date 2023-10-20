import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class CreateChatPage extends BasePage {
    readonly SUC_SEARCH_INPUT: Locator;
    readonly NAME: Locator;
    readonly SELECT_BUTTON: Locator;
    readonly CREATE_BUTTON: Locator;
    readonly ACCEPT_BUTTON: Locator;
    readonly DECLINE_BUTTON: Locator;

    // MUC
    readonly MUC_SEARCH_INPUT: Locator;
    readonly NEXT_BUTTON: Locator;
    readonly INPUT_SUBJECT: Locator;
    readonly ACCEPT_BUTTON_MUC: Locator;
    readonly DECLINE_BUTTON_MUC: Locator;

    // Channel
    readonly CHANNEL_NAME_BUTTON: Locator;
    readonly CHANNEL_SUBJECT_REGION: Locator;
    readonly CHANNEL_DESCRIPTION_REGION: Locator;
    readonly ADD_COMPANIES_BUTTON: Locator;
    readonly COMPANY_SEARCH_INPUT: Locator;
    readonly INPUT_RADIO_OPEN_CHANNEL: Locator;
    readonly SELECT_MODERATORS_BUTTON: Locator;
    readonly SELECT_MODERATORS_INPUT: Locator;
    readonly SELECT_PARTICIPANTS_BUTTON: Locator;
    readonly SELECT_PARTICIPANTS_INPUT: Locator;

    constructor(page: Page) {
        super(page);
        this.SUC_SEARCH_INPUT = this.CHATIFRAME.getByPlaceholder('Search by name');
        this.NAME = this.CHATIFRAME.locator('.m-auto-contact-list-item-username');
        this.SELECT_BUTTON = this.CHATIFRAME.locator('.m-auto-footer-add');
        this.CREATE_BUTTON = this.CHATIFRAME.locator('.m-auto-footer-create');
        this.ACCEPT_BUTTON = this.CHATIFRAME.getByRole('button', { name: 'Accept' });
        this.DECLINE_BUTTON = this.CHATIFRAME.getByRole('button', { name: 'Decline' });

        //MUC
        this.MUC_SEARCH_INPUT = this.CHATIFRAME.getByRole('textbox');
        this.NEXT_BUTTON = this.CHATIFRAME.locator('.m-auto-footer-next');
        this.INPUT_SUBJECT = this.CHATIFRAME.getByLabel('input-label');
        this.ACCEPT_BUTTON_MUC = this.CHATIFRAME.locator('.top-view-container .m-auto-footer-accept');
        this.DECLINE_BUTTON_MUC = this.CHATIFRAME.locator('.top-view-container .m-auto-footer-decline');

        // Channel
        this.CHANNEL_NAME_BUTTON = this.CHATIFRAME.locator('.m-auto-create-channel-name-region').getByLabel(
            'input-label'
        );
        this.CHANNEL_SUBJECT_REGION = this.CHATIFRAME.locator(
            '.m-auto-create-channel-subject-region'
        ).getByLabel('input-label');
        this.CHANNEL_DESCRIPTION_REGION = this.CHATIFRAME.locator(
            '.m-auto-create-channel-description-region'
        ).getByLabel('input-label');
        this.ADD_COMPANIES_BUTTON = this.CHATIFRAME.locator('.m-auto-add-companies');
        this.COMPANY_SEARCH_INPUT = this.CHATIFRAME.getByPlaceholder('Search to select companies');
        this.INPUT_RADIO_OPEN_CHANNEL = this.CHATIFRAME.locator(
            '.gr-RadioGroup-radioButtonRow-acad .m-auto-open-membership-radio'
        );
        this.SELECT_MODERATORS_BUTTON = this.CHATIFRAME.locator('.m-auto-invite-moderators-button');
        this.SELECT_MODERATORS_INPUT = this.CHATIFRAME.getByPlaceholder('Search to select moderators');

        this.SELECT_PARTICIPANTS_BUTTON = this.CHATIFRAME.locator('.m-auto-invite-members-button');
        this.SELECT_PARTICIPANTS_INPUT = this.CHATIFRAME.getByPlaceholder('Search to select participants');
    }
}
