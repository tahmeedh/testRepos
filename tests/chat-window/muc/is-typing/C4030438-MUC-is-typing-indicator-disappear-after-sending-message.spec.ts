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
                    await app1.loginAndInitialize(user1.EMAIL, user1.PASSWORD);
                }),
                test.step(`User2 is logged in`, async () => {
                    await app2.loginAndInitialize(user2.EMAIL, user2.PASSWORD);
                }),
                test.step(`User3 is logged in`, async () => {
                    await app3.loginAndInitialize(user3.EMAIL, user3.PASSWORD);
                }),
                test.step(`User4 is logged in`, async () => {
                    await app4.loginAndInitialize(user4.EMAIL, user4.PASSWORD);
                }),
                test.step(`User5 is logged in`, async () => {
                    await app5.loginAndInitialize(user5.EMAIL, user5.PASSWORD);
                }),
                test.step(`User6 is logged in`, async () => {
                    await app6.loginAndInitialize(user6.EMAIL, user6.PASSWORD);
                }),
                test.step(`User7 is logged in`, async () => {
                    await app7.loginAndInitialize(user7.EMAIL, user7.PASSWORD);
                })
            ]);
        });

        await test.step(`User 1-7 has isTyping MUC open`, async () => {
            await Promise.all([
                app1.conversationListController.clickOnConversationName('isTyping Send'),
                app2.conversationListController.clickOnConversationName('isTyping Send'),
                app3.conversationListController.clickOnConversationName('isTyping Send'),
                app4.conversationListController.clickOnConversationName('isTyping Send'),
                app5.conversationListController.clickOnConversationName('isTyping Send'),
                app6.conversationListController.clickOnConversationName('isTyping Send'),
                app7.conversationListController.clickOnConversationName('isTyping Send')
            ]);
        });

        await test.step(`STEP1`, async () => {
            await test.step(`WHEN - User 2,3,4,5,6,7 types in chat input `, async () => {
                await Promise.all([
                    await app2.chatController.typeContent('Type content'),
                    await app3.chatController.typeContent('Type content'),
                    await app4.chatController.typeContent('Type content'),
                    await app5.chatController.typeContent('Type content'),
                    await app6.chatController.typeContent('Type content'),
                    await app7.chatController.typeContent('Type content')
                ]);
            });

            await test.step(`THEN - User1 see 5 avatars, overflow avatar and is typing indicator `, async () => {
                // expect 5 avatar, but don't know which 5 as this is returned randomly from backend
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(5);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR_OVERFLOW).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP2`, async () => {
            await test.step(`WHEN - User2 clicks on send`, async () => {
                await app2.chatController.clickSendButton();
            });

            await test.step(`THEN - User1 see user3, 4, 5, 6, 7's avatars, no overflow avatar and is typing indicator`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(5);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I3')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I4')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I5')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I6')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I7')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR_OVERFLOW).not.toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP3`, async () => {
            await test.step(`WHEN - User3 clicks on send`, async () => {
                await app3.chatController.clickSendButton();
            });

            await test.step(`THEN - User1 see user4, 5, 6, 7 avatars, no overflow avatar and is typing indicator`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(4);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I4')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I5')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I6')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I7')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP4`, async () => {
            await test.step(`WHEN - User4 clicks on send`, async () => {
                await app4.chatController.clickSendButton();
            });

            await test.step(`THEN - User1 see user5, 6, 7 avatars, no overflow avatar and is typing indicator`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(3);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I5')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I6')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I7')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP5`, async () => {
            await test.step(`WHEN - User5 clicks on send`, async () => {
                await app5.chatController.clickSendButton();
            });

            await test.step(`THEN - User1 see user6, 7 avatars, no overflow avatar and is typing indicator`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(2);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I6')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I7')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP6`, async () => {
            await test.step(`WHEN - User6 clicks on send`, async () => {
                await app6.chatController.clickSendButton();
            });

            await test.step(`THEN - User1 see user7's avatar, no overflow avatar and is typing indicator`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(1);
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR.getByText('I7')).toBeVisible();
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`STEP7`, async () => {
            await test.step(`WHEN - User7 clicks on send`, async () => {
                await app7.chatController.clickSendButton();
            });

            await test.step(`THEN - User1 see no avatar, no overflow avatar and no is typing indicator`, async () => {
                await expect(app1.chatController.Pom.IS_TYPING_AVATAR).toHaveCount(0);
                await expect(app1.chatController.Pom.IS_TYPING_INDICATOR).not.toBeVisible();
            });
        });
    });
});
