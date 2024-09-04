import { test, expect, chromium, Browser, BrowserContext } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { User } from 'Apis/user';
import { BaseController } from '../../../../controllers/base-controller';
/* eslint-disable max-len*/

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

    context2 = await browser2.newContext();
    const page2 = await context2.newPage();
    app2 = new BaseController(page2);

    await test.step('GIVEN', async () => {
        await test.step('User is logged in', async () => {
            await app.goToLoginPage();
            await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
            await app.portalController.closeEnableDesktopNotification();
        });
        await test.step('User is logged in', async () => {
            await app2.goToLoginPage();
            await app2.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
            await app2.portalController.closeEnableDesktopNotification();
        });
    });

    await test.step(`Start ${testChatType} chat and send message`, async () => {
        await app.startChatButtonController.ClickOnStartWhatsapp();
        await app.createChatController.CreateWhatsapp();
        await app.chatController.skipRecipientInfo();
        await app.chatController.sendContent();
    });

    await test.step('step 1 THEN - See favourite icon and return to conversation and see favourite icon ', async () => {
        await expect(app2.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).not.toBeVisible();
        await app2.conversationListController.clickConversationByRow(0);
    });

    await test.step('Step 1 WHEN - Click favourite button and return to chatlist ', async () => {
        await app.chatController.clickChatFavouriteButton();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
        await app.chatController.Pom.CHAT_HEADER_BUTTONS.screenshot({
            path: 'C3532167-Whatsapp-favourite-is-reflected-in-concurrent-sessions-when-session-reconnects.spec.ts-snapshots/header_buttons.png'
        });
    });

    await test.step('step 1 THEN - See favourite icon and return to conversation and see favourite icon ', async () => {
        await expect(app2.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
        await expect(app2.chatController.Pom.CHAT_HEADER_BUTTONS).toHaveScreenshot({
            maxDiffPixelRatio: 0.1
        });

        expect(
            await app2.chatController.Pom.CHAT_HEADER_BUTTONS.screenshot({
                path: 'tests/chat-window/whatsapp/favourite/C3532167-Whatsapp-favourite-is-reflected-in-concurrent-sessions-when-session-reconnects.spec.ts-snapshots/header_buttons.png'
            })
        ).toMatchSnapshot({
            name: `/C3532167-Whatsapp-favourite-is-reflected-in-concurrent-sessions-when-session-reconnects.spec.ts-snapshots/
            C3532167-Whatsapp-favourite-is-reflected-in-concurr-44482-onnects-chat-window-whatsapp-favourite-static-1-Google-Chrome-linux.png`,
            maxDiffPixels: 0.1
        });
    });
});
