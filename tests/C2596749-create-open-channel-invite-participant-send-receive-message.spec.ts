import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { BaseController } from '../controller/base-controller';

test.describe('@Smoke @Channel', () => {
    let browser = null;
    let context1 = null;
    let app = null;
    let context2 = null;
    let app1 = null;
    let company: Company;
    let user1 = null;
    let user2 = null;

    test.beforeEach(async () => {
        browser = await chromium.launch();
        company = await Company.createCompany();
        user1 = await company.createUser();
        user2 = await company.createUser();
    });

    test('@Real C2596749 : Create Open Channel, invite participant, send and receive message', async () => {
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await app.goToLoginPage();
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.closeTooltips();

        // user create channel
        await app.startChatButtonController.ClickOnStartChannel();
        const title = app.stringUtils.generateString(3, 5);
        await app.createChatController.fillOutWhatIsItAboutForm(title, 'sub', 'description');
        await app.createChatController.fillOutWhoCanPostForm();
        await app.createChatController.fillOutWhoCanJoinForm(
            'open',
            [],
            [`${user2.userInfo.firstName} ${user2.userInfo.lastName}`]
        );
        await app.createChatController.CreateChannel();

        // send content in channel
        const randomContent = app.stringUtils.generateString();
        await app.chatController.sendContent(randomContent);

        // user2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        app1 = new BaseController(page2);
        await app1.goToLoginPage();
        await app1.loginController.loginToPortal(user2.userInfo.email, user2.userInfo.password);
        await app1.closeTooltips();

        // user 2 accept invite to channel
        await app1.open(title);
        await app1.inviteController.acceptInvite('Channel');

        // assert receive message
        const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContent);
        await expect(messageReceived).toHaveText(randomContent);
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
