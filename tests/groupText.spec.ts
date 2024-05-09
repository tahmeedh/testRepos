import { test, expect, chromium } from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { Company } from 'Apis/company';
import { BandwidthUtils } from 'Apis/api-helpers/bandwidth-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';
import { StringUtils } from 'helper/string-utils';

test.describe.configure({ mode: 'default' });
let bandwidthUtils: BandwidthUtils;
let context1 = null;
let browser = null;

test.beforeEach(async () => {
    bandwidthUtils = new BandwidthUtils(
        '+17786819999',
        721495,
        users.ADMIN_VEGA_AUTOMATION.EMAIL,
        users.ADMIN_VEGA_AUTOMATION.PASSWORD
    );
    await bandwidthUtils.removeNonBanwidthNumbersFromCompany();
    await bandwidthUtils.removeTestUsersFromBandwidthCompany();
});

test(`C3868089-sms-updating-the-subject-should-update-the-subject-in-the-conversation-hub @GroupText @rename`, async () => {
    Log.info(`===================== START: Running C3868089 =====================`);
    try {
        browser = await chromium.launch();
        const company = await Company.importCompany(721495);
        const user1 = await company.createUser();
        await user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD');
        await bandwidthUtils.assignBandwidthNumber(user1.userInfo.userId);
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        const testChatType = 'Group SMS';

        Log.starDivider(
            `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
        );

        const app = new BaseController(page1);
        await app.page.pause();
        await app.goToLoginPage();
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.portalController.closeEnableDesktopNotification();

        Log.info(`Start ${testChatType} chat and send message`);
        await app.startChatButtonController.ClickOnStartSMS();

        const randonNumbers = [StringUtils.generatePhoneNumber(), StringUtils.generatePhoneNumber()];

        await app.createChatController.CreateGroupText(randonNumbers);
        await app.chatController.sendContent();
        Log.success(
            `SUCCESS: ${testChatType} conversation was created with '${randonNumbers}' and random text string was sent '`
        );

        const subjectText = StringUtils.generateString();
        await app.chatController.openChatDetails();
        await app.detailsController.renameGroupChat(subjectText);

        Log.info(`${testChatType} chat expects ${subjectText} string in Group SMS Chat title state`);
        await app.messageHubController.clickSideBarChatsButton();
        const secondaryLine = await app.Pom.MESSAGEIFRAME.getByText(subjectText);
        await expect(secondaryLine).toHaveText(subjectText);
        Log.starDivider(`END TEST: Test Execution Commpleted`);
    } catch (error) {
        Log.error(`FAILURE: An error occured`, error);
        test.fail();
    }
    Log.info(`===================== END: C3868089 ENDED =====================`);
});
