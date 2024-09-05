import { test, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import {
    MockInboundMessageController,
    MockMsgDataType
} from 'Apis/mock-inbound-message/mock-inbound-message-controller';
import { BaseController } from 'controllers/base-controller';
import { User } from 'Apis/user';
import { PhoneNumberUtils } from 'Apis/api-helpers/phoneNumber-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let app: BaseController;
let company: Company;
let user1: User;
let GrId: any;
const ResponseText = 'Auto Join sample test';

test.beforeEach(async () => {
    company = await Company.createCompany();
    user1 = await company.createUser();

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);
    await user1.requestAndAssignTwilioNumber();
    [GrId] = user1.userInfo.grcpAlias.split('@');
});

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);

    await test.step('User login', async () => {
        app = new BaseController(page);
        await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);
    });

    await test.step('Check no new message badge are present', async () => {
        await expect(app.navigationController.Pom.NEW_MESSAGE_RED_BADGE).not.toBeVisible();
        await expect(app.conversationListController.Pom.NEW_MESSAGE_BLUE_BADGE).not.toBeVisible();
    });

    await test.step('Get an external chat message', async () => {
        const mockWhatsAppMessage: MockMsgDataType = {
            type: 'SMS',
            senderPhoneNumber: PhoneNumberUtils.randomPhoneNumber(),
            content: ResponseText
        };
        await MockInboundMessageController.receiveInboundExternalMsg(GrId, mockWhatsAppMessage);
    });

    await test.step('External conversation invite shows up without the invite badge', async () => {
        await expect(app.navigationController.Pom.NEW_MESSAGE_RED_BADGE).toBeVisible();
        await expect(app.navigationController.Pom.NEW_MESSAGE_RED_BADGE).toHaveText('1');
        await expect(app.conversationListController.Pom.NEW_MESSAGE_BLUE_BADGE).toBeVisible();
        await expect(app.conversationListController.Pom.NEW_MESSAGE_BLUE_BADGE).toHaveText('1');
        await expect(app.conversationListController.Pom.NEW_INVITE_BADGE).not.toBeVisible();
        await expect(app.conversationListController.Pom.NEW_MESSAGE_BLUE_DOT).toBeVisible();
        await app.conversationListController.Pom.NEW_MESSAGE_BLUE_DOT.click();
    });

    await test.step('Verify the user Auto joins the external chat conversation', async () => {
        await expect(app.chatController.Pom.CHAT_INPUT).toBeVisible();
        await expect(app.chatController.Pom.SEND_BUTTON).toBeVisible();
        await expect(app.chatController.Pom.CHATIFRAME.getByText(ResponseText)).toBeVisible();
    });
});
