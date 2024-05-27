import { expect, test, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { User } from 'Apis/user';
import { ConfigUtils } from 'helper/config-utils';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let newBrowser = null;
let context1 = null;
let app: BaseController;
let context2 = null;
let app1: BaseController;
let company: Company;
let user1: User;
let user2: User;

test.beforeAll(async ({ browser }) => {
    test.skip(
        await ConfigUtils.isMessageHubFeatureFlagOff(browser, 'muteEnabled: 1'),
        'Mute feature is enabled by feature flag: muteEnabled.'
    );
});

test.beforeEach(async () => {
    newBrowser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);
});
test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    context1 = await newBrowser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.info(`Start ${testChatType} chat and send message`);
    await app.startChatButtonController.ClickOnStartChannel();
    const title = StringUtils.generateString(3, 5);
    await app.createChatController.fillOutWhatIsItAboutForm(title, 'sub', 'descri');
    await app.createChatController.fillOutWhoCanPostForm();
    await app.createChatController.fillOutWhoCanJoinForm(
        'open',
        [],
        [`${user2.userInfo.firstName} ${user2.userInfo.lastName}`]
    );
    await app.createChatController.CreateChannel();

    Log.info(`${user1.userInfo.firstName} ${user1.userInfo.lastName} sends message`);
    await app.chatController.sendContent();

    await app.chatController.muteConversation();
    await app.messageHubController.clickSideBarChatsButton();

    await test.step('Verify that Mute icon is shown for muted channel', async () => {
        await expect(app.conversationListController.Pom.MUTE_CHAT_ICON).toBeVisible();
    });

    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    context2 = await newBrowser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.loginAndInitialize(user2.userInfo.email, user2.userInfo.password);

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} accepts invite`);
    await app1.open(title);
    await app1.inviteController.acceptInvite('Channel');

    await test.step('Reply to the channel by the participant', async () => {
        await app1.chatController.sendContent();
    });

    Log.info('Unmute the Channel');
    await app.open(title);
    await app.chatController.unMuteConversation();
    await app.messageHubController.clickSideBarChatsButton();

    await test.step('Reply to the channel by the participant ', async () => {
        await app1.chatController.sendContent();
    });

    await test.step('Verify that Mute icon is not shown for channel', async () => {
        await expect(app.conversationListController.Pom.MUTE_CHAT_ICON).not.toBeVisible();
    });

    await test.step('Verify that new message should update badge counter on the channel list and Side Bar', async () => {
        await expect(app.messageHubController.Pom.NEW_MESSAGE_RED_BADGE).toBeVisible();
        await expect(app.conversationListController.Pom.NEW_MESSAGE_BLUE_BADGE).toBeVisible();
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
