import { test, chromium, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'controllers/base-controller';

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

    // user login
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    // user start 1-1
    await app.hubHeaderController.clickStartChatButton();
    await app.hubHeaderController.selectHeaderMainMenuOption('Text');
    await app.chatController.skipRecipientInfo();

    // user send message in conversation
    await app.chatController.sendContent();

    // user 2 flag chat
    await app.chatController.clickChatFlagButton();

    // to verify that flag icon shows up in the message hub
    await app.chatController.clickOnBackButton();

    // Verify the flag
    await expect(app.conversationListController.Pom.CHAT_FLAG_INDICATOR).toBeVisible();
});
