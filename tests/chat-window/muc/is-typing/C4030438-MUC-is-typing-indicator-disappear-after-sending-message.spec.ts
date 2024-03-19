import { test, expect, BrowserContext } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.ISTYPING_1;
const user2 = users.ISTYPING_2;
const user3 = users.ISTYPING_3;

test(`${testName} ${testTags} @static`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    let browser1: BrowserContext;
    let browser2: BrowserContext;
    let browser3: BrowserContext;
    let app1: BaseController;
    let app2: BaseController;
    let app3: BaseController;

    await test.step(`GIVEN`, async () => {
        await test.step(`Open browsers`, async () => {
            browser1 = await browser.newContext();
            const user1Page = await browser1.newPage();
            app1 = new BaseController(user1Page);

            browser2 = await browser.newContext();
            const user2Page = await browser2.newPage();
            app2 = new BaseController(user2Page);

            browser3 = await browser.newContext();
            const user3Page = await browser3.newPage();
            app3 = new BaseController(user3Page);
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
                }),
                test.step(`User3 is logged in`, async () => {
                    await expect(async () => {
                        await browser3.clearCookies();
                        await app3.goToLoginPage();
                        await app3.loginController.loginToPortal(user3.EMAIL, user3.PASSWORD);
                        await expect(
                            app3.conversationListController.Pom.EMPTY_HUB_CHANNEL_MESSAGE
                        ).toHaveText('No channels');
                    }).toPass();
                })
            ]);
        });

        await test.step(`Close desktop notification`, async () => {
            return Promise.all([
                app1.portalController.closeEnableDesktopNotification(),
                app2.portalController.closeEnableDesktopNotification(),
                app3.portalController.closeEnableDesktopNotification()
            ]);
        });

        await test.step(`User 1-3 has isTyping MUC open`, async () => {
            return Promise.all([
                app1.conversationListController.clickOnConversationName('isTyping MUC'),
                app2.conversationListController.clickOnConversationName('isTyping MUC'),
                app3.conversationListController.clickOnConversationName('isTyping MUC')
            ]);
        });

        await test.step(`STEP1`, async () => {
            await test.step(`WHEN - User 2 types in chat input `, async () => {
                await app2.chatController.typeContent('testing is typing indicator');
            });

            await test.step(`THEN - User1 see 1 and is typing indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(1);
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP2`, async () => {
            await test.step(`WHEN - User 3 types in chat input `, async () => {
                await app3.chatController.typeContent('testing is typing indicator');
            });

            await test.step(`THEN - User1 see 2 avatar and is typing indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(2);
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP3`, async () => {
            await test.step(`WHEN - User 2 clicks on send button `, async () => {
                await app2.chatController.clickSendButton();
            });

            await test.step(`THEN - User1 see 1 avatar and is typing indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(1);
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP3`, async () => {
            await test.step(`WHEN - User 3 clicks on send button `, async () => {
                await app3.chatController.clickSendButton();
            });

            await test.step(`THEN - User1 does not see isTyping avatar and indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(0);
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).not.toBeVisible();
            });
        });
    });
});
