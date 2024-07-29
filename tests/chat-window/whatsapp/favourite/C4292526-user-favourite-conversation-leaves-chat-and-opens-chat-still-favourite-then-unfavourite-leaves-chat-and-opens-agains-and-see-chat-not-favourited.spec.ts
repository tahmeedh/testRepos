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
let company: Company;
let user1: User;

test.beforeEach(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignWhatsAppNumber();
});

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);

    await test.step('GIVEN', async () => {
        await app.goToLoginPage();
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.portalController.closeEnableDesktopNotification();
    });

    await test.step(`Start ${testChatType} chat and send message`, async () => {
        await app.startChatButtonController.ClickOnStartWhatsapp();
        await app.createChatController.CreateWhatsapp();
        await app.chatController.skipRecipientInfo();
        await app.chatController.sendContent();
    });

    Log.success(
        `SUCCESS: ${testChatType} conversation was created with '${testChatType}' number and random text string was '`
    );
    await test.step('Step 1 WHEN - Click favourite button and return to chatlist ', async () => {
        await app.chatController.clickChatFavouriteButton();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
        await app.chatController.clickOnBackButton();
    });

    await test.step('step 1 THEN - See favourite icon and return to conversation and see favourite icon ', async () => {
        await expect(app.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).toBeVisible();
        await app.conversationListController.clickConversationByRow(0);
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
    });

    await test.step('Step 2 WHEN - Click favourite button and return to chatlist ', async () => {
        await app.chatController.clickChatFavouriteButton();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).not.toBeVisible();
        await app.chatController.clickOnBackButton();
    });

    await test.step('step 2 THEN - favourite icon not visible and return to conversation and favourite icon not visible ', async () => {
        await expect(app.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).not.toBeVisible();
        await app.conversationListController.clickConversationByRow(0);
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).not.toBeVisible();
    });
});
