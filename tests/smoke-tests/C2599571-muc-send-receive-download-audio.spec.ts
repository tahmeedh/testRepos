import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app = null;
let context2 = null;
let app1 = null;
let context3 = null;
let app2 = null;

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
    const title = StringUtils.generateString(3, 5);
    await app.createChatController.createMUC(
        [
            `${user2.userInfo.firstName} ${user2.userInfo.lastName}`,
            `${user3.userInfo.firstName} ${user3.userInfo.lastName}`
        ],
        title
    );

    Log.info(`${user1.userInfo.firstName} ${user1.userInfo.lastName} sends audio file`);
    const audio = './asset/audio.mp3';
    await app.previewAttachmentController.sendAttachment(audio);
    await page1.waitForTimeout(5000);

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} logging in `);
    context2 = await browser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.loginAndInitialize(user2.userInfo.email, user2.userInfo.password);

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} accepts invite`);
    await app1.conversationListController.clickOnConversationName(title);
    await app1.inviteController.acceptInvite('MUC');

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} receives system event`);
    await app1.chatController.waitForHeader();
    const systemEvent = app1.Pom.CHATIFRAME.getByText('You joined');
    await expect(systemEvent).toHaveText('You joined');

    await app1.chatController.waitForHeader();
    await app1.chatController.downloadLastMedia('MUC');
    await page2.waitForEvent('download');

    Log.info(`login with ${user3.userInfo.firstName} ${user3.userInfo.lastName}`);
    context3 = await browser.newContext();
    const page3 = await context3.newPage();
    app2 = new BaseController(page3);
    await app2.loginAndInitialize(user3.userInfo.email, user3.userInfo.password);

    Log.info(`${user3.userInfo.firstName} ${user3.userInfo.lastName} declines invite`);
    await app2.conversationListController.clickOnConversationName(title);
    await app2.inviteController.declineInvite('MUC');
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
