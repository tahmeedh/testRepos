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
let app1: BaseController;

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
            await app1.createChatController.clickAvatarByRow(0);
        });

        await test.step('Phase 1 WHEN - Click Add to Contacts button ', async () => {
            await app1.vCardController.clickOnAddToContactsButton();
        });

        await test.step('Phase 2 THEN - Add to contacts button disappear and user is contact ', async () => {
            await expect(app1.vCardController.Pom.ADD_CONTACT).not.toBeVisible();
        });
    });
});
