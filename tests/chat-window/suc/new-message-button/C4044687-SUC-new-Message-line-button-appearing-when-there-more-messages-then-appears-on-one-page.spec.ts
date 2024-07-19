import { test, expect, BrowserContext } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';
import { StringUtils } from 'helper/string-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.NEWMESSAGE_1;
const user2 = users.NEWMESSAGE_2;

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

        await test.step(`User 1 has SUC open and send long content twice`, async () => {
            await app1.conversationListController.clickOnConversationName('newmessage 2');
            await app1.chatController.typeContent(StringUtils.repeatString('a', 8192));
            await app1.chatController.clickSendButton();
            await app1.chatController.typeContent(StringUtils.repeatString('b', 8192));
            await app1.chatController.clickSendButton();
        });
    });

    await test.step(`STEP1. New message button should be visible when user 2 opens conversation`, async () => {
        await test.step(`WHEN - User 2 opens conversation`, async () => {
            await app2.conversationListController.clickOnConversationName('newmessage 1');
        });
        await test.step(`THEN - New Messages button should be visible`, async () => {
            await expect(app2.chatController.Pom.NEW_MESSAGE_BUTTON).toBeVisible();
        });
    });

    await test.step(`STEP2. New message line should be visible when user clicks on New Messages button`, async () => {
        await test.step(`WHEN - User 2 clicks on New Messages button`, async () => {
            await app2.chatController.clickNewMessagesButton();
        });
        await test.step(`THEN - New message button should be visible`, async () => {
            await expect(app2.chatController.Pom.NEW_MESSAGE_LINE).toBeVisible();
        });
    });
});
