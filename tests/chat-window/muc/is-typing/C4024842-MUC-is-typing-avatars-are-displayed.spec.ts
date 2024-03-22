import { test, expect, BrowserContext } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.INTERNAL_1ONLY;
const user2 = users.INTERNAL_2ONLY;
const user3 = users.INTERNAL_3ONLY;
const user4 = users.INTERNAL_4ONLY;
const user5 = users.INTERNAL_5ONLY;
const user6 = users.INTERNAL_6ONLY;
const user7 = users.INTERNAL_7ONLY;

test(`${testName} ${testTags} @static`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    let browser1: BrowserContext;
    let browser2: BrowserContext;
    let browser3: BrowserContext;
    let browser4: BrowserContext;
    let browser5: BrowserContext;
    let browser6: BrowserContext;
    let browser7: BrowserContext;
    let app1: BaseController;
    let app2: BaseController;
    let app3: BaseController;
    let app4: BaseController;
    let app5: BaseController;
    let app6: BaseController;
    let app7: BaseController;

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

            browser4 = await browser.newContext();
            const user4Page = await browser4.newPage();
            app4 = new BaseController(user4Page);

            browser5 = await browser.newContext();
            const user5Page = await browser5.newPage();
            app5 = new BaseController(user5Page);

            browser6 = await browser.newContext();
            const user6Page = await browser6.newPage();
            app6 = new BaseController(user6Page);

            browser7 = await browser.newContext();
            const user7Page = await browser7.newPage();
            app7 = new BaseController(user7Page);
        });

        await test.step(`Users Login`, async () => {
            await Promise.all([
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
                }),
                test.step(`User4 is logged in`, async () => {
                    await expect(async () => {
                        await browser4.clearCookies();
                        await app4.goToLoginPage();
                        await app4.loginController.loginToPortal(user4.EMAIL, user4.PASSWORD);
                        await expect(
                            app4.conversationListController.Pom.EMPTY_HUB_CHANNEL_MESSAGE
                        ).toHaveText('No channels');
                    }).toPass();
                }),
                test.step(`User5 is logged in`, async () => {
                    await expect(async () => {
                        await browser5.clearCookies();
                        await app5.goToLoginPage();
                        await app5.loginController.loginToPortal(user5.EMAIL, user5.PASSWORD);
                        await expect(
                            app5.conversationListController.Pom.EMPTY_HUB_CHANNEL_MESSAGE
                        ).toHaveText('No channels');
                    }).toPass();
                }),
                test.step(`User6 is logged in`, async () => {
                    await expect(async () => {
                        await browser6.clearCookies();
                        await app6.goToLoginPage();
                        await app6.loginController.loginToPortal(user6.EMAIL, user6.PASSWORD);
                        await expect(
                            app6.conversationListController.Pom.EMPTY_HUB_CHANNEL_MESSAGE
                        ).toHaveText('No channels');
                    }).toPass();
                }),
                test.step(`User7 is logged in`, async () => {
                    await expect(async () => {
                        await browser7.clearCookies();
                        await app7.goToLoginPage();
                        await app7.loginController.loginToPortal(user7.EMAIL, user7.PASSWORD);
                        await expect(
                            app7.conversationListController.Pom.EMPTY_HUB_CHANNEL_MESSAGE
                        ).toHaveText('No channels');
                    }).toPass();
                })
            ]);
        });

        await test.step(`Close desktop notification`, async () => {
            return Promise.all([
                app1.portalController.closeEnableDesktopNotification(),
                app2.portalController.closeEnableDesktopNotification(),
                app3.portalController.closeEnableDesktopNotification(),
                app4.portalController.closeEnableDesktopNotification(),
                app5.portalController.closeEnableDesktopNotification(),
                app6.portalController.closeEnableDesktopNotification(),
                app7.portalController.closeEnableDesktopNotification()
            ]);
        });

        await test.step(`User 1-7 has isTyping MUC open`, async () => {
            return Promise.all([
                app1.conversationListController.clickOnConversationName('isTyping Timeout'),
                app2.conversationListController.clickOnConversationName('isTyping Timeout'),
                app3.conversationListController.clickOnConversationName('isTyping Timeout'),
                app4.conversationListController.clickOnConversationName('isTyping Timeout'),
                app5.conversationListController.clickOnConversationName('isTyping Timeout'),
                app6.conversationListController.clickOnConversationName('isTyping Timeout'),
                app7.conversationListController.clickOnConversationName('isTyping Timeout')
            ]);
        });

        await test.step(`STEP1`, async () => {
            await test.step(`WHEN - User 2 types in chat input `, async () => {
                await app2.chatController.typeContent('testing is typing indicator');
            });

            await test.step(`THEN - User1 see 1 and is typing indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(1);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP2`, async () => {
            await test.step(`WHEN - User 3 types in chat input `, async () => {
                await app3.chatController.typeContent('testing is typing indicator');
            });

            await test.step(`THEN - User1 see 2 avatar and is typing indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(2);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I3')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP3`, async () => {
            await test.step(`WHEN - User 4 types in chat input `, async () => {
                await app4.chatController.typeContent('testing is typing indicator');
            });

            await test.step(`THEN - User1 see 3 avatar and is typing indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(3);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I3')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I4')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP4`, async () => {
            await test.step(`WHEN - User 5 types in chat input `, async () => {
                await app5.chatController.typeContent('testing is typing indicator');
            });

            await test.step(`THEN - User1 see 4 avatar and is typing indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(4);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I3')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I4')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I5')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP5`, async () => {
            await test.step(`WHEN - User 6 types in chat input `, async () => {
                await app6.chatController.typeContent('testing is typing indicator');
            });

            await test.step(`THEN - User1 see 5 avatar and is typing indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(5);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I3')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I4')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I5')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I6')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP6`, async () => {
            await test.step(`WHEN - User 7 types in chat input `, async () => {
                await app7.chatController.typeContent('testing is typing indicator');
            });

            await test.step(`THEN - User1 see overflow avatar, 5 avatar and is typing indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(5);
                // expect 5 avatar, but don't know which 5 as this is returned randomly from backend
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR_OVERFLOW).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP7`, async () => {
            await test.step(`WHEN - After 15seconds, User 2,3,4,5,6 types in chat input `, async () => {
                await app2.page.waitForTimeout(15000);
                await Promise.all([
                    app2.chatController.typeContent('Type content again'),
                    app3.chatController.typeContent('Type content again'),
                    app4.chatController.typeContent('Type content again'),
                    app5.chatController.typeContent('Type content again'),
                    app6.chatController.typeContent('Type content again')
                ]);
            });
            await test.step(`THEN - User1 see 5 avatar and is typing indicator, no overflow avatar`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(5, { timeout: 31000 });
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I3')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I4')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I5')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I6')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR_OVERFLOW).not.toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP8`, async () => {
            await test.step(`WHEN - After 15seconds, User 2,3,4,5 types in chat input `, async () => {
                await app2.page.waitForTimeout(15000);
                await Promise.all([
                    app2.chatController.typeContent('Type content'),
                    app3.chatController.typeContent('Type content'),
                    app4.chatController.typeContent('Type content'),
                    app5.chatController.typeContent('Type content')
                ]);
            });
            await test.step(`THEN - User1 see 4 avatar and is typing indicator, no overflow avatar`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(4, { timeout: 31000 });
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I3')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I4')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I5')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR_OVERFLOW).not.toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP9`, async () => {
            await test.step(`WHEN - After 15seconds, User 2,3,4 types in chat input `, async () => {
                await app2.page.waitForTimeout(15000);
                await Promise.all([
                    app2.chatController.typeContent('Type'),
                    app3.chatController.typeContent('Type'),
                    app4.chatController.typeContent('Type')
                ]);
            });
            await test.step(`THEN - User1 see 3 avatar and is typing indicator, no overflow avatar`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(3, { timeout: 31000 });
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I3')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I4')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR_OVERFLOW).not.toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP10`, async () => {
            await test.step(`WHEN - After 15seconds, User 2,3 types in chat input `, async () => {
                await app2.page.waitForTimeout(15000);
                await Promise.all([
                    app2.chatController.typeContent('Type content'),
                    app3.chatController.typeContent('Type content')
                ]);
            });
            await test.step(`THEN - User1 see 2 avatar and is typing indicator, no overflow avatar`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(2, { timeout: 31000 });
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I3')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR_OVERFLOW).not.toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP11`, async () => {
            await test.step(`WHEN - After 15seconds, User 2 types in chat input `, async () => {
                await app2.page.waitForTimeout(15000);
                await app2.chatController.typeContent('Type content again');
            });
            await test.step(`THEN - User1 see 1 avatar and is typing indicator, no overflow avatar`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(1, { timeout: 31000 });
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I2')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR_OVERFLOW).not.toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP12`, async () => {
            await test.step(`WHEN - THEN - After 30 seconds, no isTyping avatar and no isTyping indicator `, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(0, { timeout: 31000 });
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR_OVERFLOW).not.toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).not.toBeVisible();
            });
        });
    });
});
