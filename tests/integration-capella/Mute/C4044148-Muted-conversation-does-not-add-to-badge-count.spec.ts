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
    //let newBrowser = await chromium.launch();
    const company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);

    const context = await browser.newContext();
    const page = await context.newPage();

    const app = new BaseController(page);
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.info('Creating conversation via grcp.');
    await GrcpController.createInternalConversation(
        page,
        user1.userInfo.grcpAlias,
        user2.userInfo.grcpAlias,
        'C4044148 Test Content'
    );
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

    Log.info('Mute Chat');
    await appUser1.conversationListController.clickOnConversationName(
        `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
    );
    await appUser1.chatController.muteConversation();
    await appUser1.messageHubController.clickSideBarChatsButton();
    await expect(appUser1.conversationListController.Pom.MUTE_CHAT_ICON).toBeVisible();

    // User 2
    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const appUser2 = new BaseController(page2);
    await appUser2.loginAndInitialize(user2.userInfo.email, user2.userInfo.password);

    Log.info(
        `${user2.userInfo.firstName} ${user2.userInfo.lastName} opens chat with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );

    Log.info(
        `${user2.userInfo.firstName} ${user2.userInfo.lastName} accepts conversation invite & send new message.`
    );
    await appUser2.conversationListController.clickOnConversationName(
        `${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    await appUser2.inviteController.acceptInvite('SUC');
    await appUser2.chatController.sendContent();

    await test.step('Verify that mute icon is shown alongside new message dot', async () => {
        await expect(appUser1.conversationListController.Pom.MUTE_CHAT_ICON).toBeVisible();
        await expect(appUser1.conversationListController.Pom.NEW_MESSAGE_BLUE_DOT).toBeVisible();
    });

    await test.step('Verify that new message should not update badge counter on channel list and Side Bar', async () => {
        await expect(appUser1.messageHubController.Pom.NEW_MESSAGE_RED_BADGE).not.toBeVisible();
        await expect(appUser1.conversationListController.Pom.NEW_MESSAGE_BLUE_BADGE).not.toBeVisible();
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
