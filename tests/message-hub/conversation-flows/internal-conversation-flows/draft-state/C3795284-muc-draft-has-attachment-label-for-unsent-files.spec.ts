import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BaseController } from '../../../../../controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;

let company: Company;
let user1 = null;
let user2 = null;
let user3 = null;

test.beforeAll(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    user3 = await company.createUser();
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

    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.info(`Start ${testChatType} chat and send message`);
    await app.hubHeaderController.clickStartChatButton();
    await app.hubHeaderController.selectHeaderMainMenuOption('One-to-One');
    const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;
    const user3fullName = `${user3.userInfo.firstName} ${user3.userInfo.lastName}`;
    await app.createChatController.createMUC([user2fullName, user3fullName]);
    await app.chatController.sendContent();
    Log.success(
        `SUCCESS: ${testChatType} conversation was created with '${user2.userInfo.firstName} ${user2.userInfo.lastName}''`
    );

    Log.info(`${testChatType} chat expects file attachment icon and string in draft state `);
    const PNG = './asset/download.png';
    await app.chatController.waitForHeader();
    await app.previewAttachmentController.attachFile(PNG);
    await app.navigationController.clickSideBarChatsButton();

    expect(app.conversationListController.Pom.DRAFT_TEXT_LINE).toBeVisible();
    expect(app.conversationListController.Pom.ATTACHMENT_ICON).toBeVisible();
    expect(app.conversationListController.Pom.ATTACHMENT_TEXT_LINE).toBeVisible();
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
