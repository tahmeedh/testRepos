import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { BaseController } from '../controller/base-controller';

test.describe('@Smoke @Local @MUC @FileSharing @Audio', () => {
    let browser = null;
    let context1 = null;
    let app = null;
    let context2 = null;
    let app1 = null;
    let context3 = null;
    let app2 = null;

    let company: Company;
    let user1 = null;
    let user2 = null;
    let user3 = null;

    test.beforeEach(async () => {
        browser = await chromium.launch();
        company = await Company.createCompany();
        user1 = await company.createUser();
        user2 = await company.createUser();
        user3 = await company.createUser();
    });

    test('@Real C2599571: Send, receive and download audio from MUC', async () => {
        // user1 login
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await app.goToLoginPage();
        // user login
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.closeTooltips();

        // user create MUC
        await app.startChatButtonController.ClickOnStartMUC();
        const title = app.stringUtils.generateString(3, 5);
        await app.createChatController.createMUC(
            [
                `${user2.userInfo.firstName} ${user2.userInfo.lastName}`,
                `${user3.userInfo.firstName} ${user3.userInfo.lastName}`
            ],
            title
        );

        // user send audio in MUC
        const audio = './asset/audio.mp3';
        await app.attachmentController.sendAttachment(audio);
        await page1.waitForTimeout(5000);

        // user 2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        app1 = new BaseController(page2);
        await app1.goToLoginPage();
        // user2 login
        await app1.loginController.loginToPortal(user2.userInfo.email, user2.userInfo.password);
        await app1.closeTooltips();

        // accept invite
        await app1.open(title);
        await app1.inviteController.acceptInvite('MUC');

        // assert system message
        await app1.chatController.waitForHeader();
        const systemEvent = app1.Pom.CHATIFRAME.getByText('You joined');
        await expect(systemEvent).toHaveText('You joined');

        // assert audio
        await app1.chatController.waitForHeader();
        await app1.chatController.downloadLastMedia('MUC');
        await page2.waitForEvent('download');

        // user 3 login
        context3 = await browser.newContext();
        const page3 = await context3.newPage();
        app2 = new BaseController(page3);
        await app2.goToLoginPage();
        await app2.loginController.loginToPortal(user3.userInfo.email, user3.userInfo.password);
        await app2.closeTooltips();

        // decline invite
        await app2.open(title);
        await app2.inviteController.declineInvite('MUC');
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
