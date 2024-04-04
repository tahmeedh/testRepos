import { test, chromium, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import {
    MockInboundMessageController,
    MockInboundMessageType
} from 'Apis/mock-inbound-message/mock-inbound-message-controller';
import { Log } from 'Apis/api-helpers/log-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;
const mockSMSMessage = 'test message'; // mock message to receive

let company: Company;
let user1 = null;
let GrId = null;

test.beforeEach(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignTwilioNumber();
    [GrId] = user1.userInfo.grcpAlias.split('@');
});

test(`${testName} ${testTags}`, async () => {
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

    // user start 1-1
    await app.startChatButtonController.ClickOnStartSMS();
    const randonNumber = await app.createChatController.CreateSMS();
    await app.chatController.skipRecipientInfo();
    await app.chatController.sendContent();

    // receive a message back
    const mockTwilioMessage: MockInboundMessageType = {
        senderPhoneNumber: randonNumber,
        receipientGrId: GrId,
        message: mockSMSMessage,
        type: 'TWILIO'
    };
    await MockInboundMessageController.sendInboundMessage(mockTwilioMessage);

    const responseText = app.Pom.CHATIFRAME.getByText(mockSMSMessage);
    await expect(responseText).toHaveText(mockSMSMessage);
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
