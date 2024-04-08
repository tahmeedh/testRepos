import { expect, test, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { User } from 'Apis/user';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser: null;
let context1 = null;
let app: BaseController;
let context2 = null;
let app1: BaseController;
let company: Company;
let user1: User;
let user2: User;

test.beforeEach(async () => {
    browser = await chromium.launch();
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
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);
    await app.goToLoginPage();
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.portalController.closeEnableDesktopNotification();

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

    test.step('Verify that Mute icon is shown for muted channel', async () => {
        await expect(app.conversationListController.Pom.MUTE_CHAT_ICON).toBeVisible();
    });

    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    context2 = await browser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.goToLoginPage();
    await app1.loginController.loginToPortal(user2.userInfo.email, user2.userInfo.password);
    await app1.portalController.closeEnableDesktopNotification();

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} accepts invite`);
    await app1.open(title);
    await app1.inviteController.acceptInvite('Channel');

    test.step('Reply to the channel by the participant', async () => {
        await app1.chatController.sendContent();
    });

    Log.info('Unmute the Channel');
    await app.open(title);
    await app.chatController.unMuteConversation();
    await app.messageHubController.clickSideBarChatsButton();

    test.step('Reply to the channel by the participant ', async () => {
        await app1.chatController.sendContent();
    });

    test.step('Verify that Mute icon is not shown for channel', async () => {
        await expect(app.conversationListController.Pom.MUTE_CHAT_ICON).not.toBeVisible();
    });

    test.step('Verify that new message should update badge counter on the channel list and Side Bar', async () => {
        await expect(app.messageHubController.Pom.NEW_MESSAGE_RED_BADGE).toBeVisible();
        await expect(app.conversationListController.Pom.NEW_MESSAGE_BLUE_BADGE).toBeVisible();
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
