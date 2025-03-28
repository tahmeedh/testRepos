import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { Log } from 'Apis/api-helpers/log-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../../../controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;
let context2 = null;
let app1 = null;

let company: Company;
let user1 = null;
let user2 = null;
let user3 = null;

test.beforeEach(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    user3 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2, user3]);
});

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.info(`Start ${testChatType} chat and send message`);
    await app.hubHeaderController.clickStartChatButton();
    await app.hubHeaderController.selectHeaderMainMenuOption('Multi-Party');
    const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;
    const title = await app.createChatController.createMUC([user2fullName]);

    await app.chatController.sendContent();
    await app.chatController.clickChatHeaderMenu();
    await app.chatController.selectFromChatHeaderMenu('Invite Participants');
    await app.createChatController.inviteMUC([`${user3.userInfo.firstName} ${user3.userInfo.lastName}`]);

    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    context2 = await browser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.loginAndInitialize(user2.userInfo.email, user2.userInfo.password);

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} accepts invite`);
    await app1.conversationListController.clickOnConversationName(title);
    await app1.inviteController.acceptInvite('MUC');

    const user2Message = await app1.chatController.sendContent();
    await app1.chatController.leaveChat();

    Log.info(`Re-invite ${user2.userInfo.firstName} ${user2.userInfo.lastName} to ${testChatType}`);
    await app.chatController.sendContent();
    await app.chatController.clickChatHeaderMenu();
    await app.chatController.selectFromChatHeaderMenu('Invite Participants');
    await app.createChatController.inviteMUC([`${user2.userInfo.firstName} ${user2.userInfo.lastName}`]);

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} rejoins ${testChatType}`);
    await app1.conversationListController.clickOnConversationName(title);
    await app1.Pom.CHATIFRAME.getByRole('button', { name: 'Accept' }).nth(0).click();

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} sees their previous message`);
    const previousMessage = app1.Pom.CHATIFRAME.getByText(user2Message);
    await expect(previousMessage).toHaveText(user2Message);

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} receives system event`);
    const systemEvent1 = app1.Pom.CHATIFRAME.getByText('You left');
    await expect(systemEvent1).toHaveText('You left');

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} receives system event`);
    const systemEvent2 = app1.Pom.CHATIFRAME.getByText('You joined').nth(1);
    await expect(systemEvent2).toHaveText('You joined');

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
