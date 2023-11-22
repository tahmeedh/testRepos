import { test, chromium, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../../../controller/base-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;

let company: Company;
let user1 = null;

test.beforeEach(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignTwilioNumber();
});

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    // user1 login
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);

    await app.goToLoginPage();
    // user login
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.closeTooltips();

    // user start 1-1
    await app.startChatButtonController.ClickOnStartSMS();
    await app.chatController.skipRecipientInfo();

    // user send message in conversation
    await app.chatController.sendContent();
    await app.chatController.clickChatFavouriteButton();

    // to verify that favourite icon shows up in the message hub
    await app.chatController.clickOnBackButton();

    await app.page.pause();
    // Verify the flag
    await expect(app.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).toBeVisible();
});

test.afterEach(async () => {
    await company.teardown();
});
