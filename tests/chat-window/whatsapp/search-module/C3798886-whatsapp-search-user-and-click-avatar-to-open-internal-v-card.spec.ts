import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BaseController } from '../../../../controller/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
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

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD'),
        user2.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user2.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignWhatsAppNumber();
    await user2.requestAndAssignWhatsAppNumber();
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

    Log.info(
        `Start ${testChatType} chat and search for ${user2.userInfo.firstName} ${user2.userInfo.lastName}`
    );
    await app.startChatButtonController.ClickOnStartWhatsapp();
    await app.createChatController.SearchSMSUser(`${user2.userInfo.firstName} ${user2.userInfo.lastName}`);

    Log.info(`click ${user2.userInfo.firstName} ${user2.userInfo.lastName} avatar and expect v-card`);
    await app.clickAvatar('1');
    await expect(app.vCardController.Pom.VCARD_CONTAINER).toBeVisible();
    await app.messageHubController.clickSideBarChatsButton();
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});

test.afterEach(async () => {
    await company.teardown();
});
