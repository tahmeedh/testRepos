import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BaseController } from '../../../../controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;

let company: Company;
let user1 = null;
let user2 = null;

test.beforeEach(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD'),
        user2.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user2.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignTwilioNumber();
    await user2.requestAndAssignTwilioNumber();
});

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);
    await app.goToLoginPage();
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.portalController.closeEnableDesktopNotification();

    Log.info(
        `Start ${testChatType} chat and search for ${user2.userInfo.firstName} ${user2.userInfo.lastName}`
    );
    await app.startChatButtonController.ClickOnStartSMS();
    await app.createChatController.SearchSMSUser(`${user2.userInfo.firstName} ${user2.userInfo.lastName}`);

    await test.step('Step 1 - User can add info to vCard', async () => {
        await test.step('User clicks on avatar on contact list', async () => {
            await app.contactListController.clickOnContactAvatar(`firstname lastname`);
        });

        await test.step('vCard is displayed', async () => {
            await expect(app.vCardController.Pom.FIRST_LAST_NAME).toHaveText(`firstname lastname`);
            await expect(app.vCardController.Pom.PHONE_NUMBER).toBeVisible();
            await expect(app.vCardController.Pom.TEXT_ICON).toBeVisible();
        });

        await test.step('User clicks on the edit button', async () => {
            await app.vCardController.clickOnEditButton();
        });

        await test.step('User info fields are populated', async () => {
            await expect(app.vCardEditController.Pom.FIELD_FIRST_NAME).toHaveValue(`firstname`);
            await expect(app.vCardEditController.Pom.FIELD_LAST_NAME).toHaveValue(`lastname`);
            await expect(app.vCardEditController.Pom.FIELD_COMPANY).toHaveValue(``);
            await expect(app.vCardEditController.Pom.FIELD_EMAIL).toHaveValue(``);
            await expect(app.vCardEditController.Pom.FIELD_JOB_TITLE).toHaveValue(``);
        });

        await test.step('User fill in the fields', async () => {
            await app.vCardEditController.fillFirstNameField(`first`);
            await app.vCardEditController.fillLastNameField(`last`);
            await app.vCardEditController.fillCompanyField(`company`);
            await app.vCardEditController.fillEmailField(`email@email.com`);
            await app.vCardEditController.fillJobTitleField(`jobtitle`);
        });

        await test.step('User clicks on the save button', async () => {
            await app.vCardEditController.clickOnSaveButton();
        });

        await test.step('User info are updated on vCard', async () => {
            await expect(app.vCardController.Pom.FIRST_LAST_NAME).toHaveText(`first last`);
            await expect(app.vCardController.Pom.PHONE_NUMBER).toBeVisible();
            await expect(app.vCardController.Pom.COMPANY).toHaveText(`company`);
            await expect(app.vCardController.Pom.EMAIL).toHaveText(`email@email.com`);
            await expect(app.vCardController.Pom.JOB_TITLE).toHaveText(`jobtitle`);

            await expect(app.vCardController.Pom.TEXT_ICON).toBeVisible();
            await expect(app.vCardController.Pom.CALL_ICON).toBeVisible();
        });
    });
});
