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
let title = null;

let company: Company;
let user1: User;
let user2: User;

test.beforeEach(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);
});

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);

    await test.step('GIVEN - User has MUC opened', async () => {
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await app.goToLoginPage();
    });

    await test.step('Login ', async () => {
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.portalController.closeEnableDesktopNotification();
    });

    await test.step(`Start ${testChatType} chat and send message`, async () => {
        await app.hubHeaderController.clickStartChatButton();
        await app.hubHeaderController.selectHeaderMainMenuOption('Multi-Party');
        const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;
        title = await app.createChatController.createMUC([user2fullName]);
        const randomContent = StringUtils.generateString();
        await app.chatController.sendContent(randomContent);
    });

    await test.step('Step 1 WHEN - Click favourite button and return to chatlist ', async () => {
        await app.chatController.clickChatFavouriteButton();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
        await app.chatController.clickOnBackButton();
    });

    await test.step('step 1 THEN - See favourite icon and return to conversation and see favourite icon ', async () => {
        await expect(app.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).toBeVisible();
        await app.open(title);
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
    });

    await test.step('Step 2 WHEN - Click favourite button and return to chatlist ', async () => {
        await app.chatController.clickChatFavouriteButton();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).not.toBeVisible();
        await app.chatController.clickOnBackButton();
    });

    await test.step('step 2 THEN - favourite icon not visible and return to conversation and favourite icon not visible ', async () => {
        await expect(app.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).not.toBeVisible();
        await app.open(title);
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).not.toBeVisible();
    });
});
