import { test, BrowserContext, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { User } from 'Apis/user';
import { BaseController } from '../../../../controllers/base-controller';
/* eslint-disable max-len*/

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let company: Company;
let user1: User;
let user2: User;
let browser1: BrowserContext;
let browser2: BrowserContext;
let app1: BaseController;
let app2: BaseController;

test.beforeEach(async () => {
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);
});

test(`${testName} ${testTags} @static`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;
    await test.step(`GIVEN`, async () => {
        await test.step(`Open browsers`, async () => {
            browser1 = await browser.newContext();
            const user1Page = await browser1.newPage();
            app1 = new BaseController(user1Page);
            await app1.goToLoginPage();

            browser2 = await browser.newContext();
            const user1Page2 = await browser2.newPage();
            app2 = new BaseController(user1Page2);
            await app2.goToLoginPage();
        });

        await Promise.all([
            test.step(`Browser1 - User1 is logged in`, async () => {
                await test.step('Login ', async () => {
                    await app1.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
                    await app1.portalController.closeEnableDesktopNotification();
                });
            }),
            test.step(`Browser2 - User1 is logged in`, async () => {
                await test.step('Login ', async () => {
                    await app2.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
                    await app2.portalController.closeEnableDesktopNotification();
                });
            })
        ]);

        await test.step(`Start ${testChatType} chat and send message`, async () => {
            await app1.startChatButtonController.ClickOnStartOneToOne();
            await app1.createChatController.CreateSUC(user2fullName);
            await app1.chatController.sendContent();
        });

        await test.step('step 1 THEN - See favourite icon and return to conversation and see favourite icon ', async () => {
            await expect(app2.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).not.toBeVisible();
            await app2.messageHubController.clickMessageHubRow(user2fullName);
        });

        await test.step('Step 1 WHEN - Click favourite button and return to chatlist ', async () => {
            await app1.chatController.clickChatFavouriteButton();
            await expect(app1.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
            await app1.chatController.Pom.CHAT_HEADER_BUTTONS.screenshot({
                path: 'tests/chat-window/suc/favourite/C3532164-SUC-favourite-is-reflected-in-concurrent-sessions-when-session-reconnects.spec.ts-snapshots/header_buttons.png'
            });
        });

        await test.step('step 1 THEN - See favourite icon and return to conversation and see favourite icon ', async () => {
            await expect(app2.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
            await expect(app2.chatController.Pom.CHAT_HEADER_BUTTONS).toHaveScreenshot({
                maxDiffPixelRatio: 0.1
            });

            expect(
                await app2.chatController.Pom.CHAT_HEADER_BUTTONS.screenshot({
                    path: 'tests/chat-window/suc/favourite/C3532164-SUC-favourite-is-reflected-in-concurrent-sessions-when-session-reconnects.spec.ts-snapshots/header_buttons.png'
                })
            ).toMatchSnapshot({
                name: `/C3532164-SUC-favourite-is-reflected-in-concurrent-sessions-when-session-reconnects.spec.ts-snapshots/
                C3532164-SUC-favourite-is-reflected-in-concurr-44482-onnects-chat-window-suc-favourite-static-1-Google-Chrome-linux.png`,
                maxDiffPixels: 0.1
            });
        });
    });
});
