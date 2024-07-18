import { test, expect, BrowserContext } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.ACCEPT_1INVITE;
const user2 = users.ACCEPT_2INVITE;

test(`${testName} ${testTags} @static`, async ({ browser }) => {
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

        await test.step(`Users Login`, async () => {
            return Promise.all([
                test.step(`User1 is logged in`, async () => {
                    await expect(async () => {
                        await browser1.clearCookies();
                        await app1.goToLoginPage();
                        await app1.loginController.loginToPortal(user1.EMAIL, user1.PASSWORD);
                        await expect(
                            app1.conversationListController.Pom.EMPTY_HUB_CHANNEL_MESSAGE
                        ).toHaveText('No channels');
                    }).toPass();
                }),
                test.step(`User2 is logged in`, async () => {
                    await expect(async () => {
                        await browser2.clearCookies();
                        await app2.goToLoginPage();
                        await app2.loginController.loginToPortal(user2.EMAIL, user2.PASSWORD);
                        await expect(
                            app2.conversationListController.Pom.EMPTY_HUB_CHANNEL_MESSAGE
                        ).toHaveText('No channels');
                    }).toPass();
                })
            ]);
        });

        await test.step(`Close desktop notification`, async () => {
            await app1.portalController.closeEnableDesktopNotification();
            await app2.portalController.closeEnableDesktopNotification();
        });

        await test.step(`User 1 Create MUC`, async () => {
            await app1.hubHeaderController.clickStartChatButton();
            await app1.hubHeaderController.selectHeaderMainMenuOption('Multi-Party');
            await app1.createChatController.clickUserRowInternal('accept 2invite');
            await app1.createChatController.clickFooterButton('Next');
            await app1.createChatController.clickFooterButton('Next');
            const messageCount = 60;

            for (let x = 0; x < messageCount; x++) {
                // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-loop-func
                await expect(async () => {
                    await app1.chatController.typeContent(`test message ${x}`);
                    await app1.chatController.clickSendButton();
                }).toPass();
            }
        });

        await test.step(`User 2 Accept MUC`, async () => {
            await app2.conversationListController.clickOnConversationName('accept 1Invite');
            await app2.inviteController.clickFooterButton('Accept');
        });

        await test.step(`User 2 chat bubble count is 49 on initial load`, async () => {
            await expect(app2.chatController.Pom.CHAT_BUBBLE_ROW).toHaveCount(49);
        });
    });

    await test.step(`WHEN - User scrolls to top of chat feed`, async () => {
        await expect(async () => {
            await app2.chatController.Pom.CHAT_BUBBLE_ROW.getByText(
                'test message 12'
            ).scrollIntoViewIfNeeded();
            await expect(
                app2.chatController.Pom.CHAT_BUBBLE_ROW.getByText('test message 12')
            ).toBeInViewport();
        }).toPass();
    });

    await test.step(`THEN - Historical messages are loaded`, async () => {
        await expect(async () => {
            await app2.chatController.Pom.CHAT_BUBBLE_ROW.getByText('test message 0', {
                exact: true
            }).scrollIntoViewIfNeeded();
            await expect(
                app2.chatController.Pom.CHAT_BUBBLE_ROW.getByText('test message 0', { exact: true })
            ).toBeInViewport();
        }).toPass();
        await expect(app2.chatController.Pom.CHAT_BUBBLE_ROW).toHaveCount(60);
    });
});
