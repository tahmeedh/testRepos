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

    test.beforeEach(async () => {
        browser = await chromium.launch();
        createManager = new companyCreateManager();
        const company = await createManager.init(2);
        user1 = createManager.users[0];
        user2 = createManager.users[1];
    });

    test('@Real C2596749 : Create Open Channel, invite participant, send and receive message', async () => {
        // change timeout
        test.setTimeout(120000);

        // user1 login 
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await page1.goto( baseURL );
        await app.login.loginToPortal(user1.email, user2.password);
        await app.closeTooltips();

        // user create channel 
        await app.startChat.ClickONStartChannel();
        const title = app.stringUtils.generateString(3,5);
        await app.createChat.fillOutWhatIsItAboutForm(title, "sub", "descri");
        await app.createChat.fillOutWhoCanPostForm();
        await app.createChat.fillOutWhoCanJoinForm("open", [], [user2.firstName]);
        await app.createChat.CreateChannel();

        // // send content in channel
        const randomContend = app.stringUtils.generateString();
        await app.chat.sendContent(randomContend);

        // user2 login
        const context2 = await browser.newContext();
        const page2 = await context2.newPage();
        const app1 = new BaseController(page2);
        await page2.goto( baseURL );

        await app1.login.loginToPortal(user2.email, user2.password);
        await app1.closeTooltips();

        // user 2 open channel
        const mucAccept = app1.Pom.MESSAGEIFRAME.getByText(title);
        await mucAccept.click({ timeout: 15000 });
        await app1.createChat.acceptInvite("Channel");

        // assert receive message 
        const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContend);
        await expect(messageReceived).toHaveText(randomContend);

        // logout
        await app.logout();
        await context1.close();
        await app1.logout();
        await context2.close();
        await createManager.cleanup();
    })

})