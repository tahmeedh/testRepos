import { test, chromium, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import {
    MockInboundMessageController,
    MockInboundMessageType
} from 'Apis/mock-inbound-message/mock-inbound-message-controller';
import { BaseController } from Controllers/base-controller';
import { StringUtils } from '../../../helper/string-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;

let company: Company;
let user1 = null;
let GrId = null;
const ResponseText = 'Auto Join sample test';

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

    await test.step('User login', async () => {
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await app.goToLoginPage();
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.portalController.closeEnableDesktopNotification();
    });

    await test.step('Get an external chat message', async () => {
        const mockTwilioMessage: MockInboundMessageType = {
            senderPhoneNumber: StringUtils.generatePhoneNumber(),
            receipientGrId: GrId,
            message: ResponseText,
            type: 'TWILIO'
        };
        await MockInboundMessageController.sendInboundMessage(mockTwilioMessage);
    });

    await test.step('External conversation invite shows up', async () => {
        await expect(app.conversationListController.Pom.NEW_MESSAGE_BLUE_DOT).toBeVisible();
        await app.conversationListController.Pom.NEW_MESSAGE_BLUE_DOT.click();
    });

    await test.step('Verify the user Auto joins the external chat conversation', async () => {
        await expect(app.chatController.Pom.CHAT_INPUT).toBeVisible();
        await expect(app.chatController.Pom.SEND_BUTTON).toBeVisible();
        await expect(app.chatController.Pom.CHATIFRAME.getByText(ResponseText)).toBeVisible();
    });
});
