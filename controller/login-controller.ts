import type { Page } from '@playwright/test';
import { loginPage } from '../poms/login-page';
import { test, expect } from '@playwright/test';

export class LoginController {

    readonly page: Page;
    readonly Pom: loginPage;


    /**
    * @param {import('@playwright/test').Page} page
    */
    constructor(page: Page) {
        this.page = page;
        this.Pom = new loginPage(this.page);
    }

    async loginToPortal(username : string, password : string) {
        await this.Pom.LOGIN_FIELD.isVisible();

        await this.Pom.LOGIN_FIELD.fill(username);

        await this.Pom.page.waitForTimeout(3000);

        await this.Pom.LOGIN_FIELD.click();
        await this.Pom.LOGIN_FIELD.press('Enter');

        await this.Pom.PASSWORD_FIELD.isVisible();
        await this.Pom.PASSWORD_FIELD.fill(password);
        await this.Pom.LOGIN_BUTTON.click();

        // close notificaiton tooltips 
        try {
            await expect(this.Pom.ENABLE_NOTIFICATION_BUTTON).toBeVisible({timeout: 5000 });
            await this.Pom.ENABLE_NOTIFICATION_BUTTON.click();
        } catch (e) {
            try {
                await expect(this.Pom.CLOSE_NOTIFICATION_BUTTON).toBeVisible();
                await this.Pom.CLOSE_NOTIFICATION_BUTTON.click();
            } catch (e) {
                return;
            }
        }

    }

}