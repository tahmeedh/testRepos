import { test, BrowserContext, expect } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';
import { StringUtils } from 'helper/string-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.READRECEIPT_1;
const user2 = users.READRECEIPT_2;
const messageContent = StringUtils.generateString();
const conversationName = 'muc-readreceipt-already-focus';

test(`${testName} ${testTags} @static`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    let browser1: BrowserContext;
    let browser2: BrowserContext;
    let app1: BaseController;
    let app2: BaseController;

    await test.step(`GIVEN`, async () => {
        await test.step(`Launch Browsers`, async () => {
            return Promise.all([
                test.step(`launch browser 1`, async () => {
                    browser1 = await browser.newContext();
                    const user1Page = await browser1.newPage();
                    app1 = new BaseController(user1Page);
                }),
                test.step(`launch browser 2`, async () => {
                    browser2 = await browser.newContext();
                    const user2Page = await browser2.newPage();
                    app2 = new BaseController(user2Page);
                })
            ]);
        });

        await test.step(`Users are logged in`, async () => {
            return Promise.all([
                test.step(`User1 is logged in`, async () => {
                    await app1.goToLoginPage();
                    await app1.loginController.loginToPortal(user1.EMAIL, user1.PASSWORD);
                    await app1.portalController.closeEnableDesktopNotification();
                }),
                test.step(`User2 is logged in`, async () => {
                    await app2.goToLoginPage();
                    await app2.loginController.loginToPortal(user2.EMAIL, user2.PASSWORD);
                    await app2.portalController.closeEnableDesktopNotification();
                })
            ]);
        });

        await test.step(`Users have conversations opened`, async () => {
            await app1.conversationListController.clickOnConversationName(conversationName);
            await app2.conversationListController.clickOnConversationName(conversationName);
        });
    });

    await test.step(`WHEN`, async () => {
        await test.step(`User 1 sends message to user 2`, async () => {
            await app1.chatController.typeContent(messageContent);
            await app1.chatController.clickSendButton();
            await expect(
                app1.chatController.Pom.MESSAGE_ROW_CONTAINER.last().locator('.m-auto-message-content')
            ).toHaveText(messageContent);
        });
    });

    await test.step(`THEN`, async () => {
        await test.step(`User 1 sees read icon`, async () => {
            await expect(
                app1.chatController.Pom.MESSAGE_ROW_CONTAINER.last().locator('.m-auto-message-content')
            ).toHaveText(messageContent);
            await expect(
                app1.chatController.Pom.MESSAGE_ROW_CONTAINER.last().locator('.icon-read')
            ).toBeVisible();
        });
    });
});
