import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { Company } from 'Apis/company';
import { BandwidthUtils } from 'Apis/api-helpers/bandwidth-utils';
import { BaseController } from 'controller/base-controller';

test.describe.configure({ mode: 'default' });

test.beforeEach(async () => {
    await BandwidthUtils.removeNonBanwidthNumbersFromCompany();
    await BandwidthUtils.removeTestUsersFromBandwidthCompany();
});

test('C444', async ({ page }) => {
    Log.info(`===================== START: Running C555 =====================`);
    try {
        const company = await Company.importCompany(721495);
        const user1 = await company.createUser();
        await user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD');
        await page.waitForTimeout(2000);
        await BandwidthUtils.assignBandwidthNumber(user1.userInfo.userId);

        const app = new BaseController(page);
        await app.goToLoginPage();
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.page.pause();
    } catch (error) {
        Log.error(`FAILURE: An error occured`, error);
        test.fail();
    }
    Log.info(`===================== END: C555 ENDED =====================`);
});

test('C555', async ({ page }) => {
    Log.info(`===================== START: Running C555 =====================`);
    try {
        const company = await Company.importCompany(721495);
        const user1 = await company.createUser();
        await user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD');
        await page.waitForTimeout(2000);
        await BandwidthUtils.assignBandwidthNumber(user1.userInfo.userId);

        const app = new BaseController(page);
        await app.goToLoginPage();
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.page.pause();
    } catch (error) {
        Log.error(`FAILURE: An error occured`, error);
        test.fail();
    }
    Log.info(`===================== END: C555 ENDED =====================`);
});
