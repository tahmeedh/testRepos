import { test,chromium} from '@playwright/test';
import { BaseController } from '../controller/base-controller';
import { companyCreateManager }  from '../helper/company-create-manager';
import { baseURL } from '../playwright.config'; 

test.describe('@Smoke @MUC @Local @FileSharing @Image', () => {
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

    test('@Real C2597783: Send, receive and download image from SUC', async () => {
        // change timeout
        test.setTimeout(120000);

        // user1 login 
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await page1.goto(baseURL);
        
        // user login 
        await app.login.loginToPortal(user1.email, user1.password);
        await app.closeTooltips();
        
        // user start 1-1
        await app.startChat.ClickOnStartOneToOne();
        await app.createChat.CreateSUC(user2.firstName);

        // user start conversation with user 2
        const randomContend = app.stringUtils.generateString();
        await app.chat.sendContent(randomContend);

        // user 2 login
        context2 = await browser.newContext();
        const page2 = await context2.newPage();
        await page2.goto(baseURL);
        app1 = new BaseController(page2);
        await app1.login.loginToPortal(user2.email, user2.password);
        await app1.closeTooltips();

        // user 2 accept invitation with user 1
        await app1.startChat.ClickOnStartOneToOne();
        await app1.createChat.CreateSUC(user1.firstName);
        await app1.chat.acceptSUC();

        // user send image in conversation
        const PNG = './asset/download.png';
        await app.chat.waitForHeader();
        await app.attachmentController.sendAttachment(PNG);
        await page1.waitForTimeout(3000); 
    
        // user 2 download image
        await app1.chat.waitForHeader()
        await app1.chat.downloadLastMedia();
        await page2.waitForEvent('download');

    });

    test.afterEach(async () => {
        await app.logout();
        await context1.close();
        await app1.logout();
        await context2.close();
        await createManager.cleanup();
    });

})