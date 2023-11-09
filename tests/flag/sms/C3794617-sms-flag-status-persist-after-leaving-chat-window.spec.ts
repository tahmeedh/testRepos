import { test, chromium, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { BaseController } from '../../../controller/base-controller';

test.describe('@SMS @FLag', () => {
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

    test('C3794617: SMS Flag status persist after leaving chat chat-window', async () => {
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

        // user 2 flag chat
        await app.chatController.clickChatFlagButton();

        // to verify that flag icon shows up in the message hub
        await app.chatController.naviagteToMessageHub();

        // Verify the flag
        await expect(app.Pom.CHAT_FLAG_INDICATOR).toBeVisible();
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
