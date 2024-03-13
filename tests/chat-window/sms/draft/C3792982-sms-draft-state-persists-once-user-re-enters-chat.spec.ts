import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../../../controllers/base-controller';
import { StringUtils } from '../../../../helper/string-utils';

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
    await app.portalController.closeEnableDesktopNotification();

    // user start 1-1
    await app.startChatButtonController.ClickOnStartSMS();
    const randonNumber = await app.createChatController.CreateSMS();
    await app.chatController.skipRecipientInfo();
    // user send message in conversation

    // user send message in conversation
    const draftText = StringUtils.generateString();
    await app.chatController.sendContent();
    await app.chatController.typeContent(draftText);
    await app.messageHubController.clickSideBarChatsButton();

    await app.messageHubController.clickMessageHubRow(randonNumber);
    const secondaryLine = await app.Pom.MESSAGEIFRAME.getByText(draftText);
    await expect(secondaryLine).toHaveText(draftText);
});

test.afterEach(async () => {
    await company.teardown();
});
