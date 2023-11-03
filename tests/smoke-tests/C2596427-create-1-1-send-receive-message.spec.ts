import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { BaseController } from '../../controller/base-controller';

test.describe('@Smoke @SUC', () => {
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
        await company.addUserToEachOthersRoster([user1, user2]);
    });

    test('@Real C2596427: Create 1-1, send and receive message', async () => {
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
        await app.createChatController.CreateSUC(`${user2.userInfo.firstName} ${user2.userInfo.lastName}`);

        // user send message in conversation
        const randomContent = StringUtils.generateString();
        await app.chatController.sendContent(randomContent);

        // user 2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        app1 = new BaseController(page2);
        await app1.goToLoginPage();

        await app1.loginController.loginToPortal(user2.userInfo.email, user2.userInfo.password);
        await app1.closeTooltips();

        // user 2 open conversation with user 1
        await app1.startChatButtonController.ClickOnStartOneToOne();
        await app1.createChatController.CreateSUC(user1.userInfo.lastName);

        // accept invite
        await app1.inviteController.acceptInvite('SUC');

        // assert receive message
        await app1.chatController.waitForHeader();
        const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContent);
        await expect(messageReceived).toHaveText(randomContent);

        // check system event
        await app1.chatController.waitForHeader();
        const systemEvent = app1.Pom.CHATIFRAME.getByText('You joined');
        await expect(systemEvent).toHaveText('You joined');

        // send message
        const randomContent1 = StringUtils.generateString();
        await app.chatController.sendContent(randomContent1);

        // assert receive message
        await app1.chatController.waitForHeader();
        const messageReceived1 = app1.Pom.CHATIFRAME.getByText(randomContent1);
        await expect(messageReceived1).toHaveText(randomContent1);

        // assert sent and read timestamp
        await app.chatController.checkLastRead();
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
