import { test, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BaseController } from 'Controllers/base-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);

let app: BaseController;

let company: Company;
let user1 = null;

test.beforeEach(async () => {
    company = await Company.createCompany();
    user1 = await company.createUser();
});

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    app = new BaseController(page);
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.starDivider(`Collapse the Message Hub`);
    await app.navigationController.toggleHideMessageHubButton();

    Log.starDivider(`Navigate to GR Directory`);
    await app.portalController.selectGrDirectoryButton();

    await test.step('Verify that Message Hub is in collapsed state', async () => {
        await expect(app.hubHeaderController.Pom.SEARCH_FIELD).not.toBeVisible();
        await expect(app.hubHeaderController.Pom.START_CHAT).not.toBeVisible();
    });

    Log.starDivider(`Navigate to GR Workspace`);
    await app.portalController.selectGrWorkspaceButton();

    test.step('Verify that Message Hub is expanded and welcome text is shown', async () => {
        await expect(app.hubHeaderController.Pom.SEARCH_FIELD).toBeVisible();
        await expect(app.hubHeaderController.Pom.START_CHAT).toBeVisible();
        await expect(app.messageHubController.Pom.WELCOME_TEXT).toBeVisible();
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
