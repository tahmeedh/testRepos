import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { BaseController } from '../../../controller/base-controller';
import { StringUtils } from '../../../helper/string-utils';

test.describe('@Whatsapp @Draft', () => {
    let browser = null;
    let context1 = null;
    let app: BaseController;

    let company: Company;
    let user1 = null;
    let user2 = null;

    test.beforeEach(async () => {
        browser = await chromium.launch();
        company = await Company.createCompany();
        user1 = await company.createUser();
        user2 = await company.createUser();
        await company.addUserToEachOthersRoster([user1, user2]);

        // user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD');
        await Promise.all([
            user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
            user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
        ]);

        await Promise.all([user1.requestAndAssignTwilioNumber(), user1.requestAndAssignWhatsAppNumber()]);
    });

    test('@Real C3792626: Conversation list displays correct elements of Whatsapp draft state for unsent message', async () => {
        // user1 login
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);

        await app.goToLoginPage();
        // user login
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.closeTooltips();

        // user start 1-1
        await app.startChatButtonController.ClickOnStartWhatsapp();
        // const randonNumber = app.createChatController.CreateSMS();
        app.createChatController.CreateWhatsapp();
        await app.chatController.skipRecipientInfo();
        // user send message in conversation
        const randomContent = StringUtils.generateString();
        await app.chatController.sendContent();
        await app.chatController.typeContent(randomContent);
        await app.chatListController.clickSideBarChatsButton();

        // await expect(page1.getByText(randomContent)).toBeVisible();
        const messageReceived = app.Pom.MESSAGEIFRAME.getByText(randomContent);
        await expect(messageReceived).toHaveText(randomContent);
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
