import { test, expect, chromium, Page, Browser, Locator } from '@playwright/test';
import { BaseController } from '../controller/base-controller';
import { companyCreateManager }  from '../helper/company-create-manager';
import { baseURL } from 'playwright.config';

test.describe('@Smoke @Channel', () => {
    let browser = null;
    let context1 = null;
    let app = null;
    let context2 = null;
    let app1 = null;
    let context3 = null;
    let app2 = null;

    let createManager : companyCreateManager;
    let user1 = null;
    let user2 = null;
    let user3 = null;

    test.beforeEach(async () => {
        browser = await chromium.launch();
        createManager = new companyCreateManager();
        const company = await createManager.init(3);
        user1 = createManager.users[0];
        user2 = createManager.users[1];
        user3 = createManager.users[2];
    });

    test('@Real C2596750: Create restricted Channel, invite participant and moderator', async () => {
        // user1 login 
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await page1.goto(baseURL);
        await app.loginController.loginToPortal(user1.email, user1.password);
        await app.closeTooltips();

        // user create channel 
        await app.startChatButtonController.ClickOnStartChannel();
        const title = app.stringUtils.generateString(3, 5);
        await app.createChatController.fillOutWhatIsItAboutForm(title, "sub", "descri");
        await app.createChatController.fillOutWhoCanPostForm();
        await app.createChatController.fillOutWhoCanJoinForm("restricted", [user2.firstName], [user3.firstName]);
        await app.createChatController.CreateChannel();

        // send content in channel
        const randomContent = app.stringUtils.generateString();
        await app.chatController.sendContent(randomContent);

        // user2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        await page2.goto(baseURL);
        app1 = new BaseController(page2);

        await app1.loginController.loginToPortal(user2.email, user2.password);
        await app1.closeTooltips();

        // user 2 open and accept channel invite
        await app1.open(title);
        await app1.inviteController.acceptInvite("Channel");

        // assert receive message 
        const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContent);
        await expect(messageReceived).toHaveText(randomContent);

        // usere login
        context3 = await browser.newContext();
        const page3 = await context3.newPage();
        await page3.goto(baseURL);
        app2 = new BaseController(page3);

        await app2.loginController.loginToPortal(user3.email, user3.password);
        await app2.closeTooltips();

        // user 3 open and decline channel invite
        await app2.open(title);
        await app2.inviteController.declineInvite("Channel");
    })

    test.afterEach(async () => {
        await app.logout();
        await context1.close();
        await app1.logout();
        await context2.close();
        await app2.logout();
        await context3.close();
        await createManager.cleanup();
    });

})