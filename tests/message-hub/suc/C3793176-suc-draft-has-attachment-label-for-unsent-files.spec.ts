import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../../controller/base-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;

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

    await app.goToLoginPage();
    // user login
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.closeTooltips();

    // user start 1-1
    await app.startChatButtonController.ClickOnStartOneToOne();
    await app.createChatController.CreateSUC(`${user2.userInfo.firstName} ${user2.userInfo.lastName}`);

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
