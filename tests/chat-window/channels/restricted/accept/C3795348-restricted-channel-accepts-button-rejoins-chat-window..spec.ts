import { expect, test, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app = null;
let context2 = null;
let app1 = null;
let company: Company;
let user1 = null;
let user2 = null;

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
    await app.closeTooltips();

    Log.info(`Start ${testChatType} chat and send message`);
    await app.startChatButtonController.ClickOnStartChannel();
    const title = StringUtils.generateString(3, 5);
    await app.createChatController.fillOutWhatIsItAboutForm(title, 'sub', 'descri');
    await app.createChatController.fillOutWhoCanPostForm();
    await app.createChatController.fillOutWhoCanJoinForm(
        'restricted',
        [],
        [`${user2.userInfo.firstName} ${user2.userInfo.lastName}`]
    );
    await app.createChatController.CreateChannel();

    Log.info(`${user1.userInfo.firstName} ${user1.userInfo.lastName} sends message`);
    await app.chatController.sendContent();

    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    context2 = await browser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.goToLoginPage();
    await app1.loginController.loginToPortal(user2.userInfo.email, user2.userInfo.password);
    await app1.closeTooltips();

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} accepts invite`);
    await app1.open(title);
    await app1.inviteController.acceptInvite('Channel');

    const user2Message = await app1.chatController.sendContent();
    await app1.chatController.leaveChat();

    Log.info(`Re-invite ${user2.userInfo.firstName} ${user2.userInfo.lastName} to ${testChatType}`);
    await app.inviteParticipants([`${user2.userInfo.firstName} ${user2.userInfo.lastName}`], 'channel');

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} rejoins channel`);
    await app1.open(title);
    await app1.inviteController.acceptInvite('Channel');

    Log.info('Chat Window is visible');
    await expect(app1.chatController.Pom.CHAT_WINDOW).toBeVisible();

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} sees their previous message`);
    const previousMessage = app1.Pom.CHATIFRAME.getByText(user2Message);
    await expect(previousMessage).toHaveText(user2Message);

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});

test.afterEach(async () => {
    await company.teardown();
});
