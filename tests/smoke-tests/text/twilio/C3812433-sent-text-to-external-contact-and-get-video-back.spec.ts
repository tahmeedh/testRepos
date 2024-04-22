import { test, chromium } from '@playwright/test';
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
let randomNumber = null;
let page1 = null;

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

    await test.step(`START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`, async () => {
        context1 = await browser.newContext();
        page1 = await context1.newPage();
        app = new BaseController(page1);
        await app.goToLoginPage();
    });

    await test.step('User Login', async () => {
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    });

    await test.step('User start a text Message', async () => {
        await app.startChatButtonController.ClickOnStartSMS();
        randomNumber = await app.createChatController.CreateSMS();
        await app.chatController.skipRecipientInfo();
    });

    await test.step(`${user1.userInfo.firstName} ${user1.userInfo.lastName} sends video`, async () => {
        const VIDEO = './asset/video.mp4';
        await app.chatController.waitForHeader();
        await app.previewAttachmentController.sendAttachment(VIDEO);
        await app.chatController.sendContent();
    });

    await test.step('Get Media Back', async () => {
        const mockTwilioMessage: MockInboundMessageType = {
            senderPhoneNumber: randomNumber,
            receipientGrId: GrId,
            message: mockSMSMessage,
            type: 'TWILIO',
            attachmentId: '5263eb4a-bbdd-4172-9bf2-c8de58770ff2'
        };
        await MockInboundMessageController.sendInboundMessage(mockTwilioMessage);
    });

    await test.step('Download Media Response', async () => {
        await app.chatController.downloadLastMedia();
        await page1.waitForEvent('download');
        Log.starDivider(`END TEST: Test Execution Commpleted`);
    });
});

test.afterEach(async () => {
    await company.teardown();
});
