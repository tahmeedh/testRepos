import { test, expect, BrowserContext } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';
import { GrcpController } from 'Apis/grcp/grcp-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.MUTE_1CONCURRENT;
const conversationName = 'mute sms';

test.skip(`${testName} ${testTags} @static`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    let browser1: BrowserContext;
    let browser2: BrowserContext;
    let app1: BaseController;
    let app2: BaseController;

    await test.step(`GIVEN`, async () => {
        await test.step(`Open browsers`, async () => {
            browser1 = await browser.newContext();
            const user1Page = await browser1.newPage();
            app1 = new BaseController(user1Page);

            browser2 = await browser.newContext();
            const user2Page = await browser2.newPage();
            app2 = new BaseController(user2Page);
        });

        await Promise.all([
            test.step(`Browser1 - User1 is logged in`, async () => {
                await expect(async () => {
                    await browser1.clearCookies();
                    await app1.goToLoginPage();
                    await app1.loginController.loginToPortal(user1.EMAIL, user1.PASSWORD);
                }).toPass();
            }),
            test.step(`Browser2 - User1 is logged in`, async () => {
                await expect(async () => {
                    await browser2.clearCookies();
                    await app2.goToLoginPage();
                    await app2.loginController.loginToPortal(user1.EMAIL, user1.PASSWORD);
                }).toPass();
            })
        ]);

        await test.step(`Close desktop notification`, async () => {
            await app1.portalController.closeEnableDesktopNotification();
            await app2.portalController.closeEnableDesktopNotification();
        });

        await test.step(`Browser 1 - Send grcp request to reset chat to unmute`, async () => {
            const conversationId = await app1.conversationListController.getConversationId(conversationName);
            await GrcpController.unmuteConversation(app1.page, conversationId);
        });

        await test.step(`Browser 1 - User is in SUC feed view and chat-header-menu is open`, async () => {
            await app1.conversationListController.clickOnConversationName(conversationName);
            await app1.chatController.clickChatHeaderMenu();
            await expect(
                app1.chatController.Pom.CHAT_HEADER_MENU_DROP_DOWN.getByText('Mute', { exact: true })
            ).toBeVisible();
        });

        await test.step(`Browser 2 - User is in SUC feed view and chat-header-menu is open`, async () => {
            await app2.conversationListController.clickOnConversationName(conversationName);
            await app2.chatController.clickChatHeaderMenu();
            await expect(
                app2.chatController.Pom.CHAT_HEADER_MENU_DROP_DOWN.getByText('Mute', { exact: true })
            ).toBeVisible();
        });
    });

    await test.step(`WHEN - Browser 1 - User clicks on 'Mute'`, async () => {
        await app1.chatController.selectFromChatHeaderMenu('Mute');
    });

    await test.step(`THEN`, async () => {
        await test.step(`Browser 1 - Open dropdown again and 'Unmute' is displayed in dropdown`, async () => {
            await app1.chatController.clickChatHeaderMenu();
            await expect(
                app1.chatController.Pom.CHAT_HEADER_MENU_DROP_DOWN.getByText('Unmute', { exact: true })
            ).toBeVisible();
        });

        await test.step(`Browser 2 - 'Mute' in chat-header-menu dropdown changes to 'Unmute'`, async () => {
            await expect(
                app2.chatController.Pom.CHAT_HEADER_MENU_DROP_DOWN.getByText('Unmute', { exact: true })
            ).toBeVisible();
        });
    });

    await test.step(`WHEN - Browser 1 - User clicks on 'Unmute'`, async () => {
        await app1.chatController.selectFromChatHeaderMenu('Unmute');
    });

    await test.step(`THEN`, async () => {
        await test.step(`Browser 1 - Open dropdown again and 'Mute' is displayed in dropdown`, async () => {
            await app1.chatController.clickChatHeaderMenu();
            await expect(
                app1.chatController.Pom.CHAT_HEADER_MENU_DROP_DOWN.getByText('Mute', { exact: true })
            ).toBeVisible();
        });

        await test.step(`Browser 2 - 'Unmute' in chat-header-menu dropdown changes to 'Mute'`, async () => {
            await expect(
                app2.chatController.Pom.CHAT_HEADER_MENU_DROP_DOWN.getByText('Mute', { exact: true })
            ).toBeVisible();
        });
    });
});
