import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { StringUtils } from 'helper/string-utils';
import { BandwidthUtils } from 'Apis/api-helpers/bandwidth-utils';
import { users } from 'Constants/users';
import { BaseController } from 'controllers/base-controller';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;
let bandwidthUtils: BandwidthUtils;

test.beforeEach(async () => {
    browser = await chromium.launch();
    bandwidthUtils = new BandwidthUtils(
        '+17786819999',
        721495,
        users.ADMIN_VEGA_AUTOMATION.EMAIL,
        users.ADMIN_VEGA_AUTOMATION.PASSWORD
    );
    await bandwidthUtils.removeNonBanwidthNumbersFromCompany();
    await bandwidthUtils.removeTestUsersFromBandwidthCompany();
});

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    const company = await Company.importCompany(721495);
    const user1 = await company.createUser();
    await user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD');
    await bandwidthUtils.assignBandwidthNumber(user1.userInfo.userId);
    context1 = await browser.newContext();
    const page1 = await context1.newPage();

    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );

    app = new BaseController(page1);
    await app.goToLoginPage();
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.closeTooltips();

    Log.info(`Start ${testChatType} chat and send message`);
    await app.startChatButtonController.ClickOnStartSMS();

    const randonNumbers = [StringUtils.generatePhoneNumber(), StringUtils.generatePhoneNumber()];

    await app.createChatController.CreateGroupSMS(randonNumbers);
    await app.chatController.sendContent();
    Log.success(
        `SUCCESS: ${testChatType} conversation was created with '${randonNumbers}' and random text string was sent '`
    );

    const subjectText = StringUtils.generateString();
    await app.chatController.openChatDetails();
    await app.detailsController.renameSMSChat(subjectText);

    Log.info(`${testChatType} chat expects ${subjectText} string in Group SMS Chat title state`);
    await app.messageHubController.clickSideBarChatsButton();
    const secondaryLine = await app.Pom.MESSAGEIFRAME.getByText(subjectText);
    await expect(secondaryLine).toHaveText(subjectText);
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
