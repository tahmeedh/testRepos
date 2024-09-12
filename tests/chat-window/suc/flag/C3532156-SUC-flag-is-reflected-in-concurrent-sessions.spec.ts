import { test, BrowserContext, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { User } from 'Apis/user';
import { GrcpCreateController } from 'Apis/grcp/grcp-create-controller';
import { BaseController } from '../../../../controllers/base-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
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

test(`${testName} ${testTags} @VA-7592`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;
    await test.step(`GIVEN`, async () => {
        await test.step(`Login`, async () => {
            browser1 = await browser.newContext();
            const user1Page = await browser1.newPage();
            app1 = new BaseController(user1Page);
            await app1.goToLoginPage();
            await app1.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

            const createSUCData = {
                senderGrcpAlias: user1.userInfo.grcpAlias,
                receiverGrcpAlias: user2.userInfo.grcpAlias,
                content: 'C3532164 Test Content'
            };
            await test.step('Creating conversation via grcp.', async () => {
                await GrcpCreateController.createSUC(user1Page, createSUCData);
            });
            await app1.conversationListController.clickOnConversationName(user2fullName);
        });
        await test.step(`Login concurrent sessions`, async () => {
            browser2 = await browser.newContext();
            const user1Page2 = await browser2.newPage();
            app2 = new BaseController(user1Page2);
            await app2.goToLoginPage();
        });

        await Promise.all([
            test.step(`Browser2 - User1 is logged in`, async () => {
                await test.step('Login ', async () => {
                    await app2.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
                    await app2.portalController.closeEnableDesktopNotification();
                });
            })
        ]);

        await test.step('Step 1 WHEN - Click flag button and flag button filled', async () => {
            await app1.chatController.clickChatFlagButton();
            await expect(app1.chatController.Pom.CHAT_FLAG_BUTTON_FILLED).toBeVisible();
        });

        await test.step('step 1 THEN - See flag icon and return to conversation in concurrent session ', async () => {
            await app2.conversationListController.clickOnConversationName(user2fullName);
            await expect(app2.chatController.Pom.CHAT_FLAG_BUTTON_FILLED).toBeVisible();
            await expect(app2.chatController.Pom.CHAT_HEADER_BUTTONS).toHaveScreenshot({
                maxDiffPixelRatio: 0.1
            });
        });

        await test.step('Phase 2 WHEN - Click flag button and flag button unfilled ', async () => {
            await app1.chatController.clickChatFlagButton();
            await expect(app1.chatController.Pom.CHAT_FLAG_BUTTON).toBeVisible();
        });

        await test.step('Phase 2 THEN - Flag icon not visible and return to conversation in concurrent session ', async () => {
            await expect(app2.chatController.Pom.CHAT_HEADER_BUTTONS).toHaveScreenshot({
                maxDiffPixelRatio: 0.1
            });
        });
    });
});
