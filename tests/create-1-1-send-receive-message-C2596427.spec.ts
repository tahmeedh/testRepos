import { test, expect, chromium } from '@playwright/test';
import { BaseController } from '../controller/base-controller';
import { users } from 'Constants/users';

// import { baseURL } from 'playwright.config';
import { baseURL } from 'playwright.config';

test.describe('@Smoke @SUC', () => {
    let browser = null;
    let context1 = null;
    let context2 = null;
    let app : BaseController;
    let app1 : BaseController;

    test.beforeEach(async () => {
        browser = await chromium.launch();
    });
    

    test('@Real C2596427: Create 1-1, send and receive message', async () => {
        // change timeout
        test.setTimeout(120000);

        // user1 login 
        browser = await chromium.launch();
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);

        await page1.goto( baseURL );
        
        // user login 
        await app.login.loginToPortal(users.USER1.EMAIL, users.USER1.PASSWORD);
        await app.closeTooltips();
        
        // user start 1-1
        await app.startChat.ClickOnStartOneToOne();
        await app.createChat.CreateSUC(users.USER2.NAME);

        // user send message in conversation
        const randomContend = app.stringUtils.generateString();
        await app.chat.sendContent(randomContend);
    
        // user 2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        await page2.goto( baseURL );
        app1 = new BaseController(page2);

        await app1.login.loginToPortal(users.USER2.EMAIL, users.USER2.PASSWORD);
        await app1.closeTooltips();

        // user 2 open conversation with user 1
        await app1.startChat.ClickOnStartOneToOne();
        await app1.createChat.CreateSUC(users.USER1.NAME);

        // assert receive message 
        const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContend);
        await expect(messageReceived).toHaveText(randomContend);

        // assert sent and read timestamp
        await app.chat.checkLastRead();
    });

    test.afterEach(async () => {
        await app.logout();
        await context1.close();
        await app1.logout();
        await context2.close();
    });

})