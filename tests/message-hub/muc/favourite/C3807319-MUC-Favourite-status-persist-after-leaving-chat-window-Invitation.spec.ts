import { test, chromium, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let context2 = null;
let app: BaseController;
let app1: BaseController;

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
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    context1 = await browser.newContext();
    context2 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);
    await app.goToLoginPage();

    // user login
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.closeTooltips();

    await app.startChatButtonController.ClickOnStartMUC();
    const title = StringUtils.generateString(3, 5);
    const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;
    const user3fullName = `${user3.userInfo.firstName} ${user3.userInfo.lastName}`;
    await app.createChatController.createMUC([user2fullName, user3fullName], title);

    // user send message in MUC
    const randomContent = StringUtils.generateString();
    await app.chatController.sendContent(randomContent);

    // user 2 login
    context2 = await browser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.goToLoginPage();
    await app1.loginController.loginToPortal(user2.userInfo.email, user2.userInfo.password);
    await app1.closeTooltips();
    await app1.open(title);

    await app1.chatController.clickChatFavouriteButton();
    await app1.messageHubController.clickSideBarChatsButton();

    await expect(app1.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).toBeVisible();
    // again open the chat again
    await app1.open(title);

    // Unfavourite chat
    await app1.chatController.clickChatFavouriteButton();
    await app1.messageHubController.clickSideBarChatsButton();
    await expect(app1.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).toBeHidden();
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});

test.afterEach(async () => {
    await company.teardown();
});
