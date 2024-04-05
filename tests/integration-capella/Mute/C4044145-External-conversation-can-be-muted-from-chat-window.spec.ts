import { expect, test } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { Log } from 'Apis/api-helpers/log-utils';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let app: BaseController;

let company: Company;
let user1 = null;

test.beforeEach(async () => {
    company = await Company.createCompany();
    user1 = await company.createUser();

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignTwilioNumber();
});

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );

    app = new BaseController(page);
    await app.goToLoginPage();
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.portalController.closeEnableDesktopNotification();

    Log.info(`Start ${testChatType} chat and send message`);
    await app.startChatButtonController.ClickOnStartSMS();
    const randonNumber = await app.createChatController.CreateSMS();
    await app.chatController.skipRecipientInfo();
    await app.chatController.sendContent();
    Log.success(
        `SUCCESS: ${testChatType} conversation was created with '${randonNumber}' and random text string was '`
    );

    await app.chatController.muteConversation();
    await app.messageHubController.clickSideBarChatsButton();

    test.step('Verify that Mute icon is shown for muted chat', async () => {
        await expect(app.conversationListController.Pom.MUTE_CHAT_ICON).toBeVisible();
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
