import { expect, test, BrowserContext, Page } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { Log } from 'Apis/api-helpers/log-utils';
import { User } from 'Apis/user';
import { FilterType } from 'Controllers/message-hub/conversation-list-controller';
import { GrcpCreateController } from 'Apis/grcp/grcp-create-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let user1: User;
let user2: User;
let context: BrowserContext;
let page: Page;
let app: BaseController;

test.beforeAll(async ({ browser }) => {
    Log.info('======== START TEST SETUP: Create test data + Login. ========');
    const company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);

    context = await browser.newContext();
    page = await context.newPage();

    app = new BaseController(page);
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);
    await app.portalController.closeEnableDesktopNotification();

    Log.info('Creating conversation');
    const createSUCData = {
        senderGrcpAlias: user1.userInfo.grcpAlias,
        receiverGrcpAlias: user2.userInfo.grcpAlias,
        content: 'C4235140 Test Content'
    };
    await GrcpCreateController.createSUC(page, createSUCData);
    Log.info('======== END TEST SETUP ========');
});

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );

    // await app.portalController.closeEnableDesktopNotification();
    await app.conversationListController.clickOnConversationName(
        `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
    );

    await app.chatController.hideChat();
    await app.navigationController.clickSideBarChatsButton();

    await app.page.reload();
    await app.portalController.closeEnableDesktopNotification();
    await app.conversationListController.filterConversations(FilterType.HIDDEN);

    await test.step('Check that hidden chat is showns in the conversation list', async () => {
        await expect(app.conversationListController.Pom.FILTER_TAG).toBeVisible();
        await expect(app.conversationListController.Pom.CONVERSATION_NAME).toBeVisible();
    });

    await test.step('Check that conversation list consist of the hidden row', async () => {
        await expect(
            await app.conversationListController.Pom.CONVERSATION_ROW.filter({
                hasText: `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
            })
        ).toHaveCount(1);
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
