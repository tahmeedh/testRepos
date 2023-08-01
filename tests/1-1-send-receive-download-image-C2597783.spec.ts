import { test,chromium} from '@playwright/test';
import { BaseController } from '../controller/base-controller';
import { users } from 'Constants/users';
import { baseURL } from '../playwright.config'; 

test.describe('@Smoke @MUC @Local @FileSharing @Image', () => {
    let browser = null;
    let context1 = null;
    let context2 = null;
    let app : BaseController;
    let app1 : BaseController;

    test.beforeEach(async () => {
        browser = await chromium.launch();
    });

    test('@Real C2597783: Send, receive and download image from SUC', async () => {
        // change timeout
        test.setTimeout(120000);

        // user1 login 
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await page1.goto(baseURL);
        
        // user login 
        await app.login.loginToPortal(users.USER1.EMAIL, users.USER1.PASSWORD);
        await app.closeTooltips();
        
        // user start 1-1
        await app.startChat.ClickOnStartOneToOne();

        await app.createChat.CreateSUC(users.USER3.NAME);
        // user send image in conversation
        const PNG = './asset/download.png';
        await app.chat.waitForHeader();
        await app.attachmentController.sendAttachment(PNG);
        await page1.waitForTimeout(3000); 
    
        // user 2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        await page2.goto(baseURL);
        app1 = new BaseController(page2);

        await app1.login.loginToPortal(users.USER3.EMAIL, users.USER3.PASSWORD);

        await app1.closeTooltips();

        // user 2 open conversation with user 1
        await app1.startChat.ClickOnStartOneToOne();
        await app1.createChat.CreateSUC(users.USER1.NAME);

        // download image
        await app1.chat.waitForHeader()
        await app1.chat.downloadLastMedia();
        await page2.waitForEvent('download');

    });

    test.afterEach(async () => {
        await app.logout();
        await context1.close();
        await app1.logout();
        await context2.close();
    });

})