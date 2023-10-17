import { test, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { BaseController } from '../controller/base-controller';

test.describe('@Smoke @MUC @Local @FileSharing @Image', () => {
    let browser = null;
    let context1 = null;
    let context2 = null;
    let app: BaseController;
    let app1: BaseController;

    let company: Company;
    let user1 = null;
    let user2 = null;

    test.beforeEach(async () => {
        browser = await chromium.launch();
        company = await Company.createCompany();
        user1 = await company.createUser();
        user2 = await company.createUser();
    });

    test('@Real C2597783: Send, receive and download image from SUC', async () => {
        // user1 login
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await app.goToLoginPage();
        // user login
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.closeTooltips();

        // user start 1-1
        await app.startChatButtonController.ClickOnStartOneToOne();
        await app1.createChatController.CreateSUC(user1.userInfo.lastName);
        // user start conversation with user 2
        const randomContent = app.stringUtils.generateString();
        await app.chatController.sendContent(randomContent);

        // user 2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        await page2.goto(baseURL);
        app1 = new BaseController(page2);
        await app1.loginController.loginToPortal(user2.email, user2.password);
        await app1.closeTooltips();

        // user 2 accept invitation with user 1
        await app1.startChatButtonController.ClickOnStartOneToOne();
        await app1.createChatController.CreateSUC(user1.firstName);
        await app1.inviteController.acceptInvite('SUC');

        // user send image in conversation
        const PNG = './asset/download.png';
        await app.chatController.waitForHeader();
        await app.attachmentController.sendAttachment(PNG);

        // user 2 download image
        await app1.chatController.waitForHeader();
        await app1.chatController.downloadLastMedia();
        await page2.waitForEvent('download');
    });

    test.afterEach(async () => {
        await app.logout();
        await context1.close();
        await app1.logout();
        await context2.close();
        await createManager.cleanup();
    });
});
