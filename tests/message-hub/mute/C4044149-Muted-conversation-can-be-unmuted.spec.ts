import { expect, test } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { Log } from 'Apis/api-helpers/log-utils';
import { User } from 'Apis/user';
import { ConfigUtils } from 'helper/config-utils';
import { GrcpController } from 'Apis/grcp/grcp-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let user1: User;
let user2: User;

test.beforeAll(async ({ browser }) => {
    test.skip(
        await ConfigUtils.isMessageHubFeatureFlagOff(browser, 'muteEnabled: 1'),
        'Mute feature is enabled by feature flag: muteEnabled.'
    );

    Log.info('======== START TEST SETUP: Create test data + Login. ========');
    const company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);

    const context = await browser.newContext();
    const page = await context.newPage();

    const app = new BaseController(page);
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.info('Creating conversation + mute conversation via grcp');
    await GrcpController.createInternalConversation(
        page,
        user1.userInfo.grcpAlias,
        user2.userInfo.grcpAlias,
        'C4044149 Test Content'
    );
    await page.reload();
    const convoId = await app.conversationListController.getConversationId(
        `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
    );
    await GrcpController.muteConversation(page, convoId);
    Log.info('======== END TEST SETUP ========');
});

test(`${testName} ${testTags}`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    const appUser1 = new BaseController(page1);
    // user login
    await appUser1.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.info('Unmute Chat');
    await appUser1.conversationListController.clickOnConversationName(
        `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
    );
    await appUser1.chatController.unMuteConversation();
    await appUser1.conversationListController.clickSideBarChatsButton();

    // User 2
    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const appUser2 = new BaseController(page2);
    await appUser2.loginAndInitialize(user2.userInfo.email, user2.userInfo.password);

    Log.info(
        `${user2.userInfo.firstName} ${user2.userInfo.lastName} opens chat with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} accepts invite & sends message`);
    await appUser2.conversationListController.clickOnConversationName(
        `${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    await appUser2.inviteController.acceptInvite('SUC');
    await appUser2.chatController.sendContent();

    await test.step('Verify that Mute icon is not shown for SUC chat', async () => {
        await expect(appUser1.conversationListController.Pom.MUTE_CHAT_ICON).not.toBeVisible();
    });

    await test.step('Verify that new message should update badge counter on the conversation list and Side Bar', async () => {
        await expect(appUser1.navigationController.Pom.NEW_MESSAGE_RED_BADGE).toBeVisible();
        await expect(appUser1.conversationListController.Pom.NEW_MESSAGE_BLUE_BADGE).toBeVisible();
        await expect(appUser1.conversationListController.Pom.NEW_MESSAGE_BLUE_BADGE).toHaveText('1');
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
