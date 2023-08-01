import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';


export class loginPage extends BasePage {
    readonly LOGIN_FIELD : Locator;
    readonly CONTINUE_BUTTON : Locator;
    readonly PASSWORD_FIELD : Locator;
    readonly LOGIN_BUTTON : Locator;

    constructor (page:Page) {
        super(page);
        this.LOGIN_FIELD = this.page.getByLabel('Login ID', { exact: true });
        this.CONTINUE_BUTTON = this.page.getByRole('button', { name: 'Next' });
        this.PASSWORD_FIELD = this.page.getByLabel('Password');

        this.LOGIN_BUTTON = this.page.locator('#signInSubmitStep2');
    }

}

