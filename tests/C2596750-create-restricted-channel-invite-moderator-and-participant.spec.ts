import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { BaseController } from '../controller/base-controller';

test.describe('@Smoke @Channel', () => {
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
        await company.addUserToEachOthersRoster([user1, user2, user3]);
    });

    test('@Real C2596750: Create restricted Channel, invite participant and moderator', async () => {
        // user1 login
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await app.goToLoginPage();
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.closeTooltips();

        // user create channel
        await app.startChatButtonController.ClickOnStartChannel();
        const title = app.stringUtils.generateString(3, 5);
        await app.createChatController.fillOutWhatIsItAboutForm(title, 'sub', 'descri');
        await app.createChatController.fillOutWhoCanPostForm();
        await app.createChatController.fillOutWhoCanJoinForm(
            'restricted',
            [`${user2.userInfo.firstName} ${user2.userInfo.lastName}`],
            [`${user3.userInfo.firstName} ${user3.userInfo.lastName}`]
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

        // user 2 open and accept channel invite
        await app1.open(title);
        await app1.inviteController.acceptInvite('Channel');

        // assert receive message
        const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContent);
        await expect(messageReceived).toHaveText(randomContent);

        // usere login
        context3 = await browser.newContext();
        const page3 = await context3.newPage();
        app2 = new BaseController(page3);
        await app2.goToLoginPage();
        await app2.loginController.loginToPortal(user3.userInfo.email, user3.userInfo.password);
        await app2.closeTooltips();

        // user 3 open and decline channel invite
        await app2.open(title);
        await app2.inviteController.declineInvite('Channel');
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
