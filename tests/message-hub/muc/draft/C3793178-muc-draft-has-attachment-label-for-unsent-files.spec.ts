import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BaseController } from '../../../../controller/base-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;

let company: Company;
let user1 = null;
let user2 = null;
let user3 = null;

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    user3 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);
});

test('@Real C3793178: MUC draft state has file attachment icon and text for unsent files', async () => {
    Log.info(
        `===================== START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName} =====================`
    );
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);

    await app.goToLoginPage();
    // user login
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.closeTooltips();

    // user start 1-1
    await app.startChatButtonController.ClickOnStartMUC();
    const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;
    const user3fullName = `${user3.userInfo.firstName} ${user3.userInfo.lastName}`;
    await app.createChatController.createMUC([user2fullName, user3fullName]);

    // user send message in conversation
    await app.chatController.sendContent();

    // user drafts image in conversation
    const PNG = './asset/download.png';
    await app.chatController.waitForHeader();
    await app.attachmentController.attachFile(PNG);
    await app.messageHubController.clickSideBarChatsButton();

    expect(app.messageHubController.Pom.DRAFT_TEXT_LINE).toBeVisible();
    expect(app.messageHubController.Pom.ATTACHMENT_ICON).toBeVisible();
    expect(app.messageHubController.Pom.ATTACHMENT_TEXT_LINE).toBeVisible();
});

test.afterEach(async () => {
    await company.teardown();
});
