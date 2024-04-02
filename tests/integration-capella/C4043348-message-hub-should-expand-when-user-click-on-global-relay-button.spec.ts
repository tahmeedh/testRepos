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
    await app.goToLoginPage();
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);

    await app.portalController.closeEnableDesktopNotification();

    // Collapse the Message Hub
    await app.navigationController.hideMessageHub();

    Log.starDivider(`Navigate to GR Directory`);
    await app.portalController.selectGrDirectoryButton();
    await expect(app.globalSearchController.Pom.SEARCH_FIELD).not.toBeVisible();
    await expect(app.startChatButtonController.Pom.START_CHAT).not.toBeVisible();

    Log.starDivider(`Navigate to GR Workspace`);
    await app.portalController.selectGrWorkspaceButton();

    // Verify that Message Hub has expanded
    await expect(app.globalSearchController.Pom.SEARCH_FIELD).toBeVisible();
    await expect(app.startChatButtonController.Pom.START_CHAT).toBeVisible();

    // Verify Welcome text is shown
    await expect(app.messageHubController.Pom.WELCOME_TEXT).toBeVisible();

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
