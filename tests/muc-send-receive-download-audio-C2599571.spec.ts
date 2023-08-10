import { test, expect, chromium, Page, Browser, Locator } from '@playwright/test';
import { BaseController } from '../controller/base-controller';
import { companyCreateManager }  from '../helper/company-create-manager';
import { baseURL } from 'playwright.config';

test.describe('@Smoke @Local @MUC @FileSharing @Audio', () => {
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
    
    test('@Real C2599571: Send, receive and download audio from MUC', async () => {
        // user1 login 
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        await page1.goto( baseURL );
        app = new BaseController(page1);
        await app.loginController.loginToPortal(user1.email,user1.password);
        await app.closeTooltips();

        // user create MUC 
        await app.startChatButtonController.ClickOnStartMUC();
        const title = app.stringUtils.generateString(3,5);
        await app.createChatController.createMUC([user2.firstName, user3.firstName], title);

        // user send audio in MUC 
        const audio = './asset/audio.mp3';
        await app.attachmentController.sendAttachment(audio);
        await page1.waitForTimeout(5000); 

        // user 2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        await page2.goto( baseURL );
        app1 = new BaseController(page2);
        await app1.loginController.loginToPortal(user2.email, user2.password);
        await app1.closeTooltips();

        // accept invite 
        await app1.inviteController.acceptInvite("MUC", title);

        // assert system message 
        await app1.chatController.waitForHeader();
        const systemEvent = app1.Pom.CHATIFRAME.getByText("You joined");
        await expect(systemEvent).toHaveText("You joined");
        
        // assert audio
        await app1.chatController.waitForHeader()
        await app1.chatController.downloadLastMedia("MUC");
        await page2.waitForEvent('download');
        

        // user 3 login
        context3 = await browser.newContext();
        const page3 = await context3.newPage();
        await page3.goto( baseURL );
        app2 = new BaseController(page3);
        await app2.loginController.loginToPortal(user3.email, user3.password);
        await app2.closeTooltips();

        // decline invite
        await app2.inviteController.declineInvite("MUC", title);

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