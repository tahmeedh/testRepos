import { expect, test, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../../../controller/base-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app = null;
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
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.closeTooltips();

    // user create channel
    await app.startChatButtonController.ClickOnStartChannel();
    const title = StringUtils.generateString(3, 5);
    await app.createChatController.fillOutWhatIsItAboutForm(title, 'sub', 'descri');
    await app.createChatController.fillOutWhoCanPostForm();
    await app.createChatController.fillOutWhoCanJoinForm(
        'Restricted',
        [],
        [`${user2.userInfo.firstName} ${user2.userInfo.lastName}`]
    );
    await app.createChatController.CreateChannel();
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
