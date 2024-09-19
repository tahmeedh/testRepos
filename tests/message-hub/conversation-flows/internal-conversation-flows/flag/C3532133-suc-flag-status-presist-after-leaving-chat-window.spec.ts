import { test, chromium, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../../../../controllers/base-controller';
import { StringUtils } from '../../../../../helper/string-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let context2 = null;
let app: BaseController;
let app1: BaseController;

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
    // user1 login
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);

    // user login
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    // user start 1-1
    await app.hubHeaderController.clickStartChatButton();
    await app.hubHeaderController.selectHeaderMainMenuOption('One-to-One');
    await app.createChatController.CreateSUC(`${user2.userInfo.firstName} ${user2.userInfo.lastName}`);

    // user start conversation with user 2
    const randomContent = StringUtils.generateString();
    await app.chatController.sendContent(randomContent);

    // user 2 login
    context2 = await browser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.loginAndInitialize(user2.userInfo.email, user2.userInfo.password);

    // user 2 accept invitation with user 1
    await app.hubHeaderController.clickStartChatButton();
    await app.hubHeaderController.selectHeaderMainMenuOption('One-to-One');
    await app1.createChatController.CreateSUC(`${user1.userInfo.firstName} ${user1.userInfo.lastName}`);
    await app1.inviteController.acceptInvite('SUC');

    // user 2 flag chat
    await app1.chatController.clickChatFlagButton();

    // to verify that flag icon shows up in the message hub
    await app1.chatController.clickOnBackButton();

    // Verify the flag
    await expect(app1.conversationListController.Pom.CHAT_FLAG_INDICATOR).toBeVisible();
});
