import { expect, test } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { Log } from 'Apis/api-helpers/log-utils';
import { User } from 'Apis/user';
import { ConfigUtils } from 'helper/config-utils';
import { GrcpController } from 'Apis/grcp/grcp-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let app: BaseController;

let company: Company;
let user1: User;
let user2: User;

test.beforeAll(async ({ browser }) => {
    test.skip(
        await ConfigUtils.isMessageHubFeatureFlagOff(browser, 'muteEnabled: 1'),
        'Mute feature is enabled by feature flag: muteEnabled.'
    );

    Log.info('======== START TEST SETUP: Create test data + Login. ========');
    const context = await browser.newContext();
    const page = await context.newPage();

    context.clearCookies();

    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);

    app = new BaseController(page);
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.info('Creating conversation via grcp.');
    await GrcpController.createInternalConversation(
        page,
        user1.userInfo.grcpAlias,
        user2.userInfo.grcpAlias,
        'C4044141 Test Content'
    );
    Log.info('======== END TEST SETUP ========');
});

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );

    app = new BaseController(page);
    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    await app.conversationListController.clickOnConversationName(
        `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
    );
    await app.chatController.muteConversation();
    await app.messageHubController.clickSideBarChatsButton();

    await test.step('Verify that Mute icon is shown for muted chat', async () => {
        await expect(app.conversationListController.Pom.MUTE_CHAT_ICON).toBeVisible();
    });

    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
