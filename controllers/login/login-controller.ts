import type { Page } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { LoginPage } from 'Poms/login/login-page';

export class LoginController {
    readonly page: Page;
    readonly Pom: LoginPage;

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new LoginPage(this.page);
    }

    async loginToPortal(username: string, password: string) {
        Log.info(`Login Controller: Log in to portal with username '${username}' and password '${password}'`);
        await this.Pom.LOGIN_ID_FIELD.fill(username);
        await this.Pom.NEXT_BUTTON.click();
        await this.Pom.PASSWORD_FIELD.fill(password);
        await this.Pom.LOGIN_BUTTON.click();
    }
}
