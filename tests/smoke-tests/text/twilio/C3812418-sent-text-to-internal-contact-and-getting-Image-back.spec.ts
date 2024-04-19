import { test, chromium, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import {
    MockInboundMessageController,
    MockInboundMessageType
} from 'Apis/mock-inbound-message/mock-inbound-message-controller';
import { Log } from 'Apis/api-helpers/log-utils';
import { User } from 'Apis/user';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;
const mockSMSMessage = 'test message'; // mock message to receive

let company: Company;
let user1: User;
let user2: User;
let GrId1 = null;
// let Grid2 = null;

test.beforeEach(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD'),
        user2.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user2.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignTwilioNumber();
    await user2.requestAndAssignTwilioNumber();

    [GrId1] = user1.userInfo.grcpAlias.split('@');
    //[Grid2] = user2.userInfo.grcpAlias.split('@');
});

test.fixme(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );

    // user1 login
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);

    await app.goToLoginPage();
    // user login
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.portalController.closeEnableDesktopNotification();

    await app.newsAlertController.clickNextSMSEnabledNotification();

    await expect(app.portalController.Pom.NEW_FEATURE_TOOLTIP_CLOSE_BUTTON).toBeVisible();
    await app.portalController.clickCloseSMSEnabledNotification();
    // user start text message with an internal contact
    await app.startChatButtonController.ClickOnStartSMS();

    await app.page.pause();

    await app.createChatController.createInternalSMS(
        `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
    );

    // receive a message back
    const mockTwilioMessage: MockInboundMessageType = {
        senderPhoneNumber: user2.userInfo.twilioNumber,
        receipientGrId: GrId1,
        message: mockSMSMessage,
        type: 'TWILIO',
        attachmentId: '5263eb4a-bbdd-4172-9bf2-c8de58770ff2'
    };
    await MockInboundMessageController.sendInboundMessage(mockTwilioMessage);

    await app.chatController.downloadLastMedia();
    await page1.waitForEvent('download');
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});

test.afterEach(async () => {
    await company.teardown();
});
