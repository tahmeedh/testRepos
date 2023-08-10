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

    let createManager : companyCreateManager;
    let user1 = null;
    let user2 = null;

    test.beforeEach(async () => {
        browser = await chromium.launch();
        createManager = new companyCreateManager();
        const company = await createManager.init(2);
        user1 = createManager.users[0];
        user2 = createManager.users[1];
    });

    test('@Real C2596749 : Create Open Channel, invite participant, send and receive message', async () => {
        // user1 login 
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await page1.goto( baseURL );
        await app.loginController.loginToPortal(user1.email, user2.password);
        await app.closeTooltips();

        // user create channel 
        await app.startChatButtonController.ClickOnStartChannel();
        const title = app.stringUtils.generateString(3,5);
        await app.createChatController.fillOutWhatIsItAboutForm(title, "sub", "descri");
        await app.createChatController.fillOutWhoCanPostForm();
        await app.createChatController.fillOutWhoCanJoinForm("open", [], [user2.firstName]);
        await app.createChatController.CreateChannel();

        // send content in channel
        const randomContent = app.stringUtils.generateString();
        await app.chatController.sendContent(randomContent);

        // user2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        app1 = new BaseController(page2);
        await page2.goto( baseURL );

        await app1.loginController.loginToPortal(user2.email, user2.password);
        await app1.closeTooltips();

        // user 2 accept invite to channel
        await app1.open(title);
        await app1.inviteController.acceptInvite("Channel");

        // assert receive message 
        const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContent);
        await expect(messageReceived).toHaveText(randomContent);

        // logout
        await app.logout();
        await context1.close();
        await app1.logout();
        await context2.close();
        await createManager.cleanup();
    })

})