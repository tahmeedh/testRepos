import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class InvitePage extends BasePage {
    readonly CHAT_ACTION_FOOTER_BUTTON: Locator;
    readonly JOIN_BUTTON: Locator;

    // SUC, Channel
    readonly ACCEPT_BUTTON: Locator;
    readonly DECLINE_BUTTON: Locator;

    // MUC
    readonly ACCEPT_BUTTON_MUC: Locator;
    readonly DECLINE_BUTTON_MUC: Locator;
    readonly;

    constructor(page: Page) {
        super(page);
        this.CHAT_ACTION_FOOTER_BUTTON = this.CHATIFRAME.locator('.chat-action-footer').getByRole('button');
        this.JOIN_BUTTON = this.CHATIFRAME.locator('.m-auto-footer-join');

        // SUC, Channel
        this.ACCEPT_BUTTON = this.CHATIFRAME.getByRole('button', { name: 'Accept' });
        this.DECLINE_BUTTON = this.CHATIFRAME.getByRole('button', { name: 'Decline' });

        //MUC
        this.ACCEPT_BUTTON_MUC = this.CHATIFRAME.locator('.top-view-container .m-auto-footer-accept');
        this.DECLINE_BUTTON_MUC = this.CHATIFRAME.locator('.top-view-container .m-auto-footer-decline');
    }
}
