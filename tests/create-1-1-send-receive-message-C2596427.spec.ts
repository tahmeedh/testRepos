import { test, expect, chromium } from '@playwright/test';
import { BaseController } from '../controller/base-controller';
import { companyCreateManager }  from '../helper/company-create-manager';
import { baseURL } from 'playwright.config';

test.describe('@Smoke @SUC', () => {
    let browser = null;
    let context1 = null;
    let context2 = null;
    let app : BaseController;
    let app1 : BaseController;

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
    

    test('@Real C2596427: Create 1-1, send and receive message', async () => {
        // user1 login 
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);

        await page1.goto( baseURL );
        
        // user login 
        await app.loginController.loginToPortal(user1.email, user1.password);
        await app.closeTooltips();
        
        // user start 1-1
        await app.startChatButtonController.ClickOnStartOneToOne();
        await app.createChatController.CreateSUC(user2.firstName);

        // user send message in conversation
        const randomContent = app.stringUtils.generateString();
        await app.chatController.sendContent(randomContent);
    
        // user 2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        await page2.goto( baseURL );
        app1 = new BaseController(page2);

        await app1.loginController.loginToPortal(user2.email, user2.password);
        await app1.closeTooltips();

        // user 2 open conversation with user 1
        await app1.startChatButtonController.ClickOnStartOneToOne();
        await app1.createChatController.CreateSUC(user1.firstName);

        // accept invite 
        await app1.inviteController.acceptInvite("SUC");

        // assert receive message 
        await app1.chatController.waitForHeader();
        const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContent);
        await expect(messageReceived).toHaveText(randomContent);

        // check system event
        await app1.chatController.waitForHeader();
        const systemEvent = app1.Pom.CHATIFRAME.getByText("You joined");
        await expect(systemEvent).toHaveText("You joined");

        // send message
        const randomContent1 = app.stringUtils.generateString();
        await app.chatController.sendContent(randomContent1);

        // assert receive message 
        await app1.chatController.waitForHeader();
        const messageReceived1 = app1.Pom.CHATIFRAME.getByText(randomContent1);
        await expect(messageReceived1).toHaveText(randomContent1);

        // assert sent and read timestamp
        await app.chatController.checkLastRead();
    });

    test.afterEach(async () => {
        await app.logout();
        await context1.close();
        await app1.logout();
        await context2.close();
        await createManager.cleanup();
    });

})