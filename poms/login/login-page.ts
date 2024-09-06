import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class LoginPage extends BasePage {
    readonly LOGIN_ID_FIELD: Locator;
    readonly NEXT_BUTTON: Locator;
    readonly PASSWORD_FIELD: Locator;
    readonly LOGIN_BUTTON: Locator;

    constructor(page: Page) {
        super(page);
        // This is made to be compatible with old GAS and new GAS page
        this.LOGIN_ID_FIELD = this.page.locator('[id="loginId"]');
        this.NEXT_BUTTON = this.page.locator('[id="signInSubmitNext"]');
        this.PASSWORD_FIELD = this.page.locator('[id="loginPassword"]');
        this.LOGIN_BUTTON = this.page.locator('[id="signInSubmitStep2"]');
    }
}
