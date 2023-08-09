import { test, expect, chromium, Page, Browser, Locator } from '@playwright/test';
import { BaseController } from '../controller/base-controller';
import { companyCreateManager }  from '../helper/company-create-manager';
import { baseURL } from 'playwright.config';

test.describe('@Smoke @MUC', () => {
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
    
    test('@Real @Smoke C2596748 l Create MUC, invite 2 participants to MUC, 1 participant accept, 1 participant decline', 
    async () => {
        // change timeout
        test.setTimeout(150000);

        // user1 login 
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await page1.goto( baseURL );
        await app.login.loginToPortal(user1.email, user1.password);
        await app.closeTooltips();

        // user create MUC 
        await app.startChat.ClickONStartMUC();
        const title = app.stringUtils.generateString(3,5);
        await app.createChat.createMUC([user2.firstName, user3.firstName], title);

        // user send message in MUC 
        const randomContend = app.stringUtils.generateString();
        await app.chat.sendContent(randomContend);

        // user 2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        app1 = new BaseController(page2);
        await page2.goto( baseURL );
        await app1.login.loginToPortal(user2.email, user2.password);
        await app1.closeTooltips();

        // accept invite 
        const mucAccept = app1.Pom.MESSAGEIFRAME.getByText(title);
        await mucAccept.click({ timeout: 15000 });
        await app1.createChat.acceptInvite("MUC");
        
        // assert message
        const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContend);
        await expect(messageReceived).toHaveText(randomContend);

        // assert system message 
        const systemEvent = app1.Pom.CHATIFRAME.getByText("You joined");
        await expect(systemEvent).toHaveText("You joined");

        // user 3 login
        context3 = await browser.newContext();
        const page3 = await context3.newPage();
        app2 = new BaseController(page3);
        await page3.goto( baseURL );
        await app2.login.loginToPortal(user3.email, user3.password);
        await app2.closeTooltips();

        // decline invite
        const mucDecline = app2.Pom.MESSAGEIFRAME.getByText(title);
        await mucDecline.click({ timeout: 20000 });
        await app2.createChat.declineInvite("MUC");

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