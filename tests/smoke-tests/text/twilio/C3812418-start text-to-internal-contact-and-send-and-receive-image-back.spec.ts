import { test } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import {
    MockInboundMessageController,
    MockMsgDataType
} from 'Apis/mock-inbound-message/mock-inbound-message-controller';
import { User } from 'Apis/user';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let app: BaseController;
const mockSMSMessage = 'test message'; // mock message to receive

let company: Company;
let user1: User;
let user2: User;
let GrId1 = null;

test.beforeEach(async () => {
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
});

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    await test.step('Create Browser and Log in ', async () => {
        app = new BaseController(page);
        await app.goToLoginPage();
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.portalController.closeEnableDesktopNotification();
        await app.newsAlertController.clickNextSMSEnabledNotification();
        await app.portalController.clickCloseSMSEnabledNotification();
    });

    await test.step('User start text message with an internal contact', async () => {
        await app.hubHeaderController.clickStartChatButton();
        await app.hubHeaderController.selectHeaderMainMenuOption('Text');
        await app.createChatController.CreateInternalText(user2.userInfo.twilioNumber);
    });

    await test.step('Send and Receive a message back', async () => {
        const mockTwilioMessage1: MockMsgDataType = {
            type: 'SMS',
            senderPhoneNumber: user2.userInfo.twilioNumber,
            content: mockSMSMessage,
            attachmentId: '5263eb4a-bbdd-4172-9bf2-c8de58770ff2'
        };
        await MockInboundMessageController.receiveInboundExternalMsg(GrId1, mockTwilioMessage1);

        const mockTwilioMessage2: MockMsgDataType = {
            type: 'SMS',
            senderPhoneNumber: user2.userInfo.twilioNumber,
            content: mockSMSMessage
        };
        await MockInboundMessageController.receiveInboundExternalMsg(GrId1, mockTwilioMessage2);

        const PNG = './asset/download.png';
        await app.chatController.waitForHeader();
        await app.previewAttachmentController.sendAttachment(PNG);
    });
});
