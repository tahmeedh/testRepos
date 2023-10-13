import { test } from '@playwright/test';
import { Company } from 'Apis/company';
import { BaseController } from 'controller/base-controller';

test('C666', async ({ page }) => {
    let company1: Company;
    try {
        company1 = await Company.createCompany();
        const user1 = await company1.createUser();
        await Promise.all([
            user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
            user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD'),
            user1.removeEntitlement('FILE_SHARING')
        ]);
        await Promise.all([user1.requestAndAssignWhatsAppNumber(), user1.requestAndAssignTwilioNumber()]);

        const app = new BaseController(page);
        await app.goToLoginPage();
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.page.pause();
    } catch (err) {
        console.error(err);
    } finally {
        await company1.teardown();
    }
});
