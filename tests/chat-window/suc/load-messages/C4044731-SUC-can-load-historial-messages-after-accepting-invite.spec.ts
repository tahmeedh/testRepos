import { test, expect, BrowserContext } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { Company } from 'Apis/company';
import { User } from 'Apis/user';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
// can be unskipped when VA-6991 is fixed
test.skip(`${testName} ${testTags}`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    let browser1: BrowserContext;
    let browser2: BrowserContext;
    let app1: BaseController;
    let app2: BaseController;
    let company: Company;
    let user1: User;
    let user2: User;

    await test.step(`GIVEN`, async () => {
        await test.step(`Generate company and users`, async () => {
            company = await Company.createCompany();
            [user1, user2] = await Promise.all([company.createUser(), company.createUser()]);
            await company.addUserToEachOthersRoster([user1, user2]);
        });

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
                    await app1.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);
                }),
                test.step(`User2 is logged in`, async () => {
                    await app2.loginAndInitialize(user2.userInfo.email, user2.userInfo.password);
                })
            ]);
        });

        await test.step(`User 1 Create SUC`, async () => {
            await app1.hubHeaderController.clickStartChatButton();
            await app1.hubHeaderController.selectHeaderMainMenuOption('One-to-One');
            await app1.createChatController.clickUserRowInternal(
                `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
            );
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
            await app2.conversationListController.clickOnConversationName(
                `${user1.userInfo.firstName} ${user1.userInfo.lastName}`
            );
            await app2.inviteController.clickFooterButton('Accept');
        });

        await test.step(`User 2 chatbubble count is 49 on initial load`, async () => {
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
