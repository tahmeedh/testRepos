import { expect, test } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { StringUtils } from 'helper/string-utils';
import { Log } from 'Apis/api-helpers/log-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let app: BaseController;

let company: Company;
let user1 = null;
let user2 = null;

test.beforeEach(async () => {
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);
});

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );

    app = new BaseController(page);
    await app.goToLoginPage();
    // user login
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.portalController.closeEnableDesktopNotification();

    // user start 1-1
    await app.startChatButtonController.ClickOnStartOneToOne();
    await app.createChatController.CreateSUC(`${user2.userInfo.firstName} ${user2.userInfo.lastName}`);

    const randomContent = StringUtils.generateString();
    await app.chatController.sendContent(randomContent);
    await app.chatController.muteChat();
    await app.messageHubController.clickSideBarChatsButton();

    test.step('Verify that Mute icon is shown for muted chat', async () => {
        await expect(app.conversationListController.Pom.MUTE_CHAT_ICON).toBeVisible();
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
