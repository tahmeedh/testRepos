import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { Log } from 'Apis/api-helpers/log-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../../../controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app = null;
let number = null;

let company: Company;
let user1 = null;
let user2 = null;

test.beforeEach(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignTwilioNumber();
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
        await test.step('User is logged in', async () => {
            await app.goToLoginPage();
            await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
            await app.portalController.closeEnableDesktopNotification();
            await app.newsAlertController.clickNextSMSEnabledNotification();
            await app.portalController.clickCloseSMSEnabledNotification();
        });

        await test.step(`User has existing ${testChatType} conversation`, async () => {
            await app.startChatButtonController.ClickOnStartSMS();
            number = await app.createChatController.CreateSMS();
            await app.chatController.skipRecipientInfo();
            await app.chatController.sendContent();
        });
    });

    await test.step('Step 1 WHEN - Click favourite button and return to chatlist ', async () => {
        await app.chatController.clickChatFavouriteButton();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
        await app.chatController.clickOnBackButton();
    });

    await test.step('step 1 THEN - See favourite icon and return to conversation and see favourite icon ', async () => {
        await expect(app.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).toBeVisible();
        await app.open(number);
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
    });

    await test.step('Step 2 WHEN - Click favourite button and return to chatlist ', async () => {
        await app.chatController.clickChatFavouriteButton();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).not.toBeVisible();
        await app.chatController.clickOnBackButton();
    });

    await test.step('step 2 THEN - favourite icon not visible and return to conversation and favourite icon not visible ', async () => {
        await expect(app.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).not.toBeVisible();
        await app.open(number);
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).not.toBeVisible();
    });
});
