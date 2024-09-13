import { test, expect, chromium, Browser, BrowserContext } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { User } from 'Apis/user';
import { BaseController } from '../../../../controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser: Browser;
let context1: BrowserContext;
let app: BaseController;
let browser2: Browser;
let context2: BrowserContext;
let app2: BaseController;
let company: Company;
let user1: User;
let user2: User;

test.beforeEach(async () => {
    browser = await chromium.launch();
    browser2 = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);

    await user1.requestAndAssignWhatsAppNumber();
});
test.skip(`${testName} ${testTags} @VA-7592 @BUG_ID:VA-7664`, async () => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);

    context2 = await browser2.newContext();
    const page2 = await context2.newPage();
    app2 = new BaseController(page2);

    await test.step('GIVEN', async () => {
        await test.step('User is logged in', async () => {
            await app.goToLoginPage();
            await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
            await app.portalController.closeEnableDesktopNotification();
        });
        await test.step('Login concurrent session', async () => {
            await app2.goToLoginPage();
            await app2.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
            await app2.portalController.closeEnableDesktopNotification();
        });
    });

    await test.step(`Start ${testChatType} chat and send message`, async () => {
        await app.hubHeaderController.clickStartChatButton();
        await app.hubHeaderController.selectHeaderMainMenuOption('WhatsApp');
        await app.createChatController.CreateWhatsapp();
        await app.chatController.skipRecipientInfo();
        await app.chatController.sendContent();
    });

    await test.step('Step 1 WHEN - Click flag button and flag button filled ', async () => {
        await app.chatController.clickChatFlagButton();
        await expect(app.chatController.Pom.CHAT_FLAG_BUTTON_FILLED).toBeVisible();
    });

    await test.step('step 1 THEN - See flag icon and return to conversation in concurrent session ', async () => {
        await app2.conversationListController.clickConversationByRow(0);
        await expect(app2.chatController.Pom.CHAT_FLAG_BUTTON_FILLED).toBeVisible();
        await expect(app2.chatController.Pom.CHAT_HEADER_BUTTONS).toHaveScreenshot({
            maxDiffPixelRatio: 0.1
        });

        await test.step('Phase 2 WHEN - Click flag button and flag button unfilled', async () => {
            await app.chatController.clickChatFlagButton();
            await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON).toBeVisible();
        });

        await test.step('Phase 2 THEN - Flag icon not visible and return to conversation in concurrent session ', async () => {
            await expect(app2.chatController.Pom.CHAT_FLAG_BUTTON).toBeVisible();
            await expect(app2.chatController.Pom.CHAT_HEADER_BUTTONS).toHaveScreenshot({
                maxDiffPixelRatio: 0.1
            });
        });
    });
});
