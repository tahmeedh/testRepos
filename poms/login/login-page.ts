import type { Locator, Page } from '@playwright/test';
import { BasePage } from 'Poms/base-page';

export class LoginPage extends BasePage {
    readonly LOGIN_ID_FIELD: Locator;
    readonly NEXT_BUTTON: Locator;
    readonly PASSWORD_FIELD: Locator;
    readonly LOGIN_BUTTON: Locator;

    constructor(page: Page) {
        super(page);
        this.LOGIN_ID_FIELD = this.page.getByLabel('Login ID', { exact: true });
        this.NEXT_BUTTON = this.page.getByRole('button', { name: 'Next' });
        this.PASSWORD_FIELD = this.page.getByLabel('Password');
        this.LOGIN_BUTTON = this.page.getByRole('button', { name: 'Log in' });
    }
}
