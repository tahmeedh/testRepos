import { test, expect, chromium, Page, Browser, Locator } from '@playwright/test';
import { BaseController } from '../controller/base-controller';
import { users } from 'Constants/users';
import { baseURL } from 'playwright.config';

test.describe('@Smoke @Local @Channel @FileSharing @Video', () => {

    test('@Real C2599572 : Send, receive and download video file from channel', async () => {
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

        // user create channel 
        await app.startChat.ClickONStartChannel();
        const title = app.stringUtils.generateString(3,5);
        await app.createChat.fillOutWhatIsItAboutForm(title, "sub", "descri");
        await app.createChat.fillOutWhoCanPostForm();
        await app.createChat.fillOutWhoCanJoinForm("open", [], [users.USER2.NAME]);
        await app.createChat.CreateChannel();

        // // send video in channel
        const video = './asset/video.mp4';
        await app.chat.waitForHeader();
        await app.attachmentController.sendAttachment(video);
        await page1.waitForTimeout(3000);

        // user2 login
        const context2 = await browser.newContext();
        const page2 = await context2.newPage();
        await page2.goto( baseURL );
        const app1 = new BaseController(page2);

        await app1.login.loginToPortal(users.USER2.EMAIL, users.USER2.PASSWORD);
        await app1.closeTooltips();

        // user 2 open channel
        const mucAccept = app1.Pom.MESSAGEIFRAME.getByText(title);
        await mucAccept.click({ timeout: 15000 });
        await app1.createChat.acceptInvite("Channel");

        // assert receive video 
        await app1.chat.waitForHeader()
        await app1.chat.downloadLastMedia();
        await page2.waitForEvent('download');

        // logout
        await app.logout();
        await context1.close();
        await app1.logout();
        await context2.close();
    
    })



})