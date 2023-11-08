import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../controller/base-controller';

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
    await app.goToLoginPage();
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.closeTooltips();

    Log.info(`Start ${testChatType} chat and send message`);
    await app.startChatButtonController.ClickOnStartChannel();
    const title = StringUtils.generateString(3, 5);
    await app.createChatController.fillOutWhatIsItAboutForm(title, 'sub', 'descri');
    await app.createChatController.fillOutWhoCanPostForm();
    await app.createChatController.fillOutWhoCanJoinForm(
        'restricted',
        [`${user2.userInfo.firstName} ${user2.userInfo.lastName}`],
        [`${user3.userInfo.firstName} ${user3.userInfo.lastName}`]
    );
    await app.createChatController.CreateChannel();
    const randomContent = StringUtils.generateString();
    await app.chatController.sendContent(randomContent);

    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    context2 = await browser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.goToLoginPage();
    await app1.loginController.loginToPortal(user2.userInfo.email, user2.userInfo.password);
    await app1.closeTooltips();

    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    await app1.open(title);
    await app1.inviteController.acceptInvite('Channel');

    // assert receive message
    const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContent);
    await expect(messageReceived).toHaveText(randomContent);

    Log.info(`login with ${user3.userInfo.firstName} ${user3.userInfo.lastName}`);
    context3 = await browser.newContext();
    const page3 = await context3.newPage();
    app2 = new BaseController(page3);
    await app2.goToLoginPage();
    await app2.loginController.loginToPortal(user3.userInfo.email, user3.userInfo.password);
    await app2.closeTooltips();

    Log.info(`${user3.userInfo.firstName} ${user3.userInfo.lastName} declines invite`);
    await app2.open(title);
    await app2.inviteController.declineInvite('Channel');
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});

test.afterEach(async () => {
    await company.teardown();
});
