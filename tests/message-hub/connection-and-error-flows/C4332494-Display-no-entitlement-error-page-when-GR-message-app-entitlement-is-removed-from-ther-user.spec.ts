import { test, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BaseController } from 'Controllers/base-controller';
import { User } from 'Apis/user';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);

let app: BaseController;

let company: Company;
let user: User = null;

test.beforeEach(async () => {
    company = await Company.createCompany();
    user = await company.createUser();
});

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user.userInfo.firstName} ${user.userInfo.lastName}`
    );
    app = new BaseController(page);
    await app.loginAndInitialize(user.userInfo.email, user.userInfo.password);

    await test.step('Verify that Message Hub is shown', async () => {
        await expect(app.hubHeaderController.Pom.SEARCH_FIELD).toBeVisible();
        await expect(app.hubHeaderController.Pom.START_CHAT).toBeVisible();
    });

    await test.step('Remove the GR message app entitlement', async () => {
        await user.removeEntitlement('MESSAGE_APPLICATION');
        await app.page.waitForTimeout(8000); // Error page milliseconds = 10 seconds
    });

    await test.step('Verify that Error page with Entitlement Issus is shown', async () => {
        await expect(app.messageHubController.Pom.GR_MESSAGE_LOGO).toBeVisible();
        await expect(app.messageHubController.Pom.ERROR_PAGE_TITLE).toBeVisible();
        await expect(app.messageHubController.Pom.NO_PERMISSION_ERROR_TITLE).toBeVisible();
        await expect(app.messageHubController.Pom.ERROR_PAGE_TITLE).toHaveText(
            'You do not have permission to access Global Relay App.'
        );
        await expect(app.messageHubController.Pom.NO_PERMISSION_ERROR_TITLE).toHaveText(
            'For assistance, contact your company administrator.'
        );
    });

    await test.step('Verify that Message Hub is no longer shown', async () => {
        await expect(app.hubHeaderController.Pom.SEARCH_FIELD).not.toBeVisible();
        await expect(app.hubHeaderController.Pom.START_CHAT).not.toBeVisible();
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
