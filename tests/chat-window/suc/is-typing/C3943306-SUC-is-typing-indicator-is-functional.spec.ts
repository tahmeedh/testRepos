import { test, expect, BrowserContext } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.INTERNAL_1ONLY;
const user2 = users.INTERNAL_2ONLY;

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
                    await app1.loginAndInitialize(user1.EMAIL, user1.PASSWORD);
                }),
                test.step(`User2 is logged in`, async () => {
                    await app2.loginAndInitialize(user2.EMAIL, user2.PASSWORD);
                })
            ]);
        });

        await test.step(`User 1 and User 2 has SUC open`, async () => {
            await app1.conversationListController.clickOnConversationName('internal 2only');
            await app2.conversationListController.clickOnConversationName('internal 1only');
        });
    });

    await test.step(`is typing indicator`, async () => {
        await test.step(`Receiver can see is typing indicator when Sender types more than 3 characters `, async () => {
            await test.step(`User 1 types more than 3 characters `, async () => {
                await app1.chatController.typeContent('testing is typing indicator');
            });
            await test.step(`User 2 can see is typing indicator `, async () => {
                await expect(app2.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });
        });

        await test.step(`Is typing indicator can be continuously displayed `, async () => {
            await test.step(`User 1 stops typing for 29 seconds `, async () => {
                await app1.page.waitForTimeout(29000);
                await expect(app2.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });

            await test.step(`User 1 types additional characters `, async () => {
                await app1.chatController.typeContent('additional characters');
            });

            await test.step(`User 2 see is typing indicator for 30 seconds `, async () => {
                await app1.page.waitForTimeout(29000);
                await expect(app2.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });

            await test.step(`User 2 does not see is typing indicator after 30 seconds `, async () => {
                await expect(app2.chatController.Pom.IS_TYPING_INDICATOR).not.toBeVisible({ timeout: 32000 });
            });
        });

        await test.step(`Backspace trigger is typing indicator `, async () => {
            await test.step(`User 1 deletes 3 characters`, async () => {
                await app1.pressKey('Backspace');
                await app1.pressKey('Backspace');
                await app1.pressKey('Backspace');
            });

            await test.step(`User 2 see is typing indicator `, async () => {
                await expect(app2.chatController.Pom.IS_TYPING_INDICATOR).toBeVisible();
            });

            await test.step(`User 2 does not see is typing indicator after 30 seconds `, async () => {
                await expect(app2.chatController.Pom.IS_TYPING_INDICATOR).not.toBeVisible({ timeout: 32000 });
            });
        });
    });
});
