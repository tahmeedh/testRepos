import { test, expect, chromium, Browser, BrowserContext } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { User } from 'Apis/user';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser: Browser;
let context1: BrowserContext;
let app: BaseController;
let browser2: Browser;
let context2: BrowserContext;
let app2: BaseController;
let title = null;

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
});

test(`${testName} ${testTags} @VA-7592`, async () => {
    test.info().annotations.push(testAnnotation);
    const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;

    await test.step('GIVEN - User login', async () => {
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await app.goToLoginPage();
        context2 = await browser2.newContext();
        const page2 = await context2.newPage();
        app2 = new BaseController(page2);
        await app2.goToLoginPage();
    });

    await test.step('Login ', async () => {
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.portalController.closeEnableDesktopNotification();
    });
    await test.step('Login concurrent session ', async () => {
        await app2.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app2.portalController.closeEnableDesktopNotification();
    });

    await test.step(`Start ${testChatType} chat and send message`, async () => {
        await app.hubHeaderController.clickStartChatButton();
        await app.hubHeaderController.selectHeaderMainMenuOption('Multi-Party');
        title = await app.createChatController.createMUC([user2fullName]);
        const randomContent = StringUtils.generateString();
        await app.chatController.sendContent(randomContent);
    });

    await test.step('Phase 1 WHEN - Click favourite button and favourite button filled ', async () => {
        await app.chatController.clickChatFavouriteButton();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
    });

    await test.step('Phase 1 THEN - See favourite icon and return to conversation in concurrent session ', async () => {
        await app2.conversationListController.clickOnConversationName(title);
        await expect(app2.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
        await expect(app2.chatController.Pom.CHAT_HEADER_BUTTONS).toHaveScreenshot({
            maxDiffPixelRatio: 0.1
        });

        await test.step('Phase 2  WHEN - Click favourite button and favourite button unfilled ', async () => {
            await app.chatController.clickChatFavouriteButton();
            await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON).toBeVisible();
        });

        await test.step('Phase 2 THEN - Favourite icon not visible and return to conversation in concurrent session ', async () => {
            await expect(app2.chatController.Pom.CHAT_HEADER_BUTTONS).toHaveScreenshot({
                maxDiffPixelRatio: 0.1
            });
        });
    });
});
