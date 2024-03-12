import { test, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
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
    await app.startChatButtonController.ClickOnStartOneToOne();
    await app.createChatController.CreateSUC(`${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    const randomContent = StringUtils.generateString();
    await app.chatController.sendContent(randomContent);

    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    context2 = await browser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.goToLoginPage();
    await app1.loginController.loginToPortal(user2.userInfo.email, user2.userInfo.password);
    await app1.portalController.closeEnableDesktopNotification();

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} accepts invite`);
    await app1.startChatButtonController.ClickOnStartOneToOne();
    await app1.createChatController.CreateSUC(`${user1.userInfo.firstName} ${user1.userInfo.lastName}`);
    await app1.inviteController.acceptInvite('SUC');

    Log.info(`${user1.userInfo.firstName} ${user1.userInfo.lastName} sends image`);
    const PNG = './asset/download.png';
    await app.chatController.waitForHeader();
    await app.previewAttachmentController.sendAttachment(PNG);

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} downloads image`);
    await app1.chatController.waitForHeader();
    await app1.chatController.downloadLastMedia();
    await page2.waitForEvent('download');
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});

test.afterEach(async () => {
    await company.teardown();
});
