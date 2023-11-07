import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BaseController } from '../../../../controller/base-controller';
import { StringUtils } from '../../../../helper/string-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;

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
    await company.addUserToEachOthersRoster([user1, user2]);
});

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
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
    const subject = await app.createChatController.createMUC([user2fullName, user3fullName]);

    // user send message in conversation
    const draftText = StringUtils.generateString();
    await app.chatController.sendContent();
    await app.chatController.typeContent(draftText);
    await app.messageHubController.clickSideBarChatsButton();

    await app.messageHubController.clickMessageHubRow(subject);
    await app.chatController.removeContent();
    await app.messageHubController.clickSideBarChatsButton();
    const secondaryLine = await app.Pom.MESSAGEIFRAME.getByText(draftText);
    await expect(secondaryLine).toHaveCount(0);
});

test.afterEach(async () => {
    await company.teardown();
});
