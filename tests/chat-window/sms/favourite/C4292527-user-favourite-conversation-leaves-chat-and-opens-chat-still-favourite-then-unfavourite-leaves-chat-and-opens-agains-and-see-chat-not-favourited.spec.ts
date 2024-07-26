import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../../../controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app = null;
let context2 = null;
let app1 = null;
let title = null;

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

    await test.step('GIVEN - User has MUC opened', async () => {
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);
        await app.goToLoginPage();
    });

    await test.step('Login ', async () => {
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.portalController.closeEnableDesktopNotification();
    });

    await test.step(`Start ${testChatType} chat and send message`, async () => {
        await app.startChatButtonController.ClickOnStartMUC();
        const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;
        title = await app.createChatController.createMUC([user2fullName]);
        const randomContent = StringUtils.generateString();
        await app.chatController.sendContent(randomContent);
    });

    await test.step('Click favourite button and return from chatlist ', async () => {
        await app.chatController.clickChatFavouriteButton();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
        await app.chatController.clickOnBackButton();
        await expect(app.messageHubController.Pom.CHAT_FAVOURITE_INDICATOR).toBeVisible();
        await app.open(title);
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON_FILLED).toBeVisible();
        await app1.page.pause();
    });

    Log.info(`login with ${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    context2 = await browser.newContext();
    const page2 = await context2.newPage();
    app1 = new BaseController(page2);
    await app1.goToLoginPage();
    await app1.loginController.loginToPortal(user2.userInfo.email, user2.userInfo.password);
    await app1.portalController.closeEnableDesktopNotification();

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} accepts invite`);
    await app1.open(title);
    await app1.page.pause();
    await app1.inviteController.acceptInvite('MUC');

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} receives message`);
    const messageReceived = app1.Pom.CHATIFRAME.getByText(randomContent);
    await expect(messageReceived).toHaveText(randomContent);

    Log.info(`${user2.userInfo.firstName} ${user2.userInfo.lastName} receives system event`);
    const systemEvent = app1.Pom.CHATIFRAME.getByText('You joined');
    await expect(systemEvent).toHaveText('You joined');

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
