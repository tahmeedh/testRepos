import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BaseController } from 'controllers/base-controller';
import { StringUtils } from 'helper/string-utils';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
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
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);

    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.info(`Start ${testChatType} chat and send message`);
    await app.hubHeaderController.clickStartChatButton();
    await app.hubHeaderController.selectHeaderMainMenuOption('Text');
    const randonNumber = await app.createChatController.CreateSMS();
    await app.chatController.skipRecipientInfo();
    // user send message in conversation
    const draftText = StringUtils.generateString();
    await app.chatController.sendContent();
    Log.success(
        `SUCCESS: ${testChatType} conversation was created with '${randonNumber}' and random text string was '`
    );
    await app.chatController.typeContent(draftText);
    await app.navigationController.clickSideBarChatsButton();

    Log.info(`${testChatType} chat expects ${draftText} string in draft state to be removed `);
    await app.conversationListController.clickOnConversationName(randonNumber);
    await app.chatController.removeContent();
    await app.navigationController.clickSideBarChatsButton();

    const secondaryLine = await app.Pom.MESSAGEIFRAME.getByText(draftText);
    await expect(secondaryLine).toHaveCount(0);
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
