import { test, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { Log } from 'Apis/api-helpers/log-utils';
import { User } from 'Apis/user';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let app: BaseController;

let company: Company;
let user1: User = null;
let user2: User = null;

test.beforeAll(async () => {
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignTwilioNumber();
});

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(`START TEST`);
    app = new BaseController(page);

    await test.step('GIVEN - User has an existing SMS conversation', async () => {
        await test.step('Go to login page', async () => {
            await app.goToLoginPage();
        });

        await test.step('Login', async () => {
            await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
            await app.closeTooltips();
        });
    });

    await test.step('User can navigate to company vCard in SMS create', async () => {
        await test.step(`User clicks on 'start-new-chat' button`, async () => {
            await app.startChatButtonController.ClickOnStartSMS();
        });

        await test.step(`User 1 searches for user 2`, async () => {
            await app.createChatController.SearchSMSUser(
                `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
            );
        });

        await test.step(`User 1 clicks on the avatar of the first result`, async () => {
            await app.createChatController.clickOnSearchComponentRowAvatar(
                `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
            );
            await expect(app.vCardController.Pom.COMPANY_NAME_INTERNAL).toHaveText(
                `${user2.userInfo.company.companyName}`
            );
        });

        await test.step('Company vCard is displayed when user clicks on company name', async () => {
            await app.vCardController.Pom.COMPANY_NAME_INTERNAL.click();
            await expect(app.companyVCardController.Pom.COMPANY_NAME).toHaveText(
                `${user2.userInfo.company.companyName}`
            );
        });
    });

    await test.step('User can navigate to back to conversation list from company vCard', async () => {
        await test.step('User vCard is displayed when user clicks on back button', async () => {
            await app.companyVCardController.clickOnBackButton();
            await expect(app.vCardController.Pom.COMPANY_NAME_INTERNAL).toHaveText(
                `${user2.userInfo.company.companyName}`
            );
        });

        await test.step('Create view is displayed when user clicks on back button', async () => {
            await app.vCardController.clickOnBackButton();
            await expect(app.createChatController.Pom.EXTERNAL_SEARCH_INPUT).toBeVisible();
        });

        await test.step('Conversation view displayed when user clicks on cancel button', async () => {
            await app.createChatController.clickOnCancelButton();
            await expect(app.startChatButtonController.Pom.START_CHAT).toBeVisible();
        });
    });
    Log.starDivider(`END TEST`);
});

test.afterAll(async () => {
    await company.teardown();
});
