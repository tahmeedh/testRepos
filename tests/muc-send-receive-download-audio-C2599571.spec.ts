import { test, expect, chromium, Page, Browser, Locator } from '@playwright/test';
import { BaseController } from '../controller/base-controller';
import { users } from 'Constants/users';
import { baseURL } from 'playwright.config';

test.describe('@Smoke @Local @MUC @FileSharing @Audio', () => {
    
    test('@Real C2599571: Send, receive and download audio from MUC', async () => {
        // change timeout
        test.setTimeout(120000);

        // user1 login 
        const browser = await chromium.launch();
        const context1 = await browser.newContext();
        const page1 = await context1.newPage();
        await page1.goto( baseURL );
        const app = new BaseController(page1);
        await app.login.loginToPortal(users.USER1.EMAIL, users.USER1.PASSWORD);
        await app.closeTooltips();

        // user create MUC 
        await app.startChat.ClickONStartMUC();
        const title = app.stringUtils.generateString(3,5);
        await app.createChat.createMUC([users.USER2.NAME, users.USER3.NAME], title);

        // user send audio in MUC 
        const audio = './asset/audio.mp3';
        await app.attachmentController.sendAttachment(audio);
        await page1.waitForTimeout(5000); 

        // user 2 login
        const context2 = await browser.newContext();
        const page2 = await context2.newPage();
        await page2.goto( baseURL );
        const app1 = new BaseController(page2);
        await app1.login.loginToPortal(users.USER2.EMAIL, users.USER2.PASSWORD);
        await app1.closeTooltips();

        // accept invite 
        const mucAccept = app1.Pom.MESSAGEIFRAME.getByText(title);
        await mucAccept.click({ timeout: 15000 });
        await app1.createChat.acceptInvite("MUC");

        // assert system message 
        await app1.chat.waitForHeader();
        const systemEvent = app1.Pom.CHATIFRAME.getByText("You joined");
        await expect(systemEvent).toHaveText("You joined");
        
        // assert audio
        await app1.chat.waitForHeader()
        await app1.chat.downloadLastMedia("MUC");
        await page2.waitForEvent('download');
        

        // user 3 login
        const context3 = await browser.newContext();
        const page3 = await context3.newPage();
        await page3.goto( baseURL );
        const app2 = new BaseController(page3);
        await app2.login.loginToPortal(users.USER3.EMAIL, users.USER3.PASSWORD);
        await app2.closeTooltips();

        // decline invite
        const mucDecline = app2.Pom.MESSAGEIFRAME.getByText(title);
        await mucDecline.click({ timeout: 20000 });
        await app2.createChat.declineInvite("MUC");

        // logout 
        await app.logout();
        await context1.close();

        await app1.logout();
        await context2.close();
        await app2.logout();
        await context3.close();

    })
    
})