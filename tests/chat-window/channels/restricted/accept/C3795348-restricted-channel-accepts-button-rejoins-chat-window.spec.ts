import { test, expect, BrowserContext, Page } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';
import { GrcpController } from 'Apis/grcp/grcp-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const USER1 = users.CHANNEL_1;
const USER2 = users.CHANNEL_2;
const CONVERSATION_NAME = 'rejoin-channel-restricted';
const channelId = '8f391075-f6cf-414e-9edd-8f2c8162bfd7';
const grId = '1368930@globalrelay.local';

// this test is flaky because of VA-7462, unskip when this is fixed
test.skip(`${testName} ${testTags} @static`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    let browser1: BrowserContext;
    let browser2: BrowserContext;
    let user1Page: Page;
    let user2Page: Page;
    let app1: BaseController;
    let app2: BaseController;

    await test.step(`GIVEN`, async () => {
        await test.step(`Open browsers`, async () => {
            browser1 = await browser.newContext();
            user1Page = await browser1.newPage();
            app1 = new BaseController(user1Page);

            browser2 = await browser.newContext();
            user2Page = await browser2.newPage();
            app2 = new BaseController(user2Page);
        });

        await Promise.all([
            test.step(`Browser1 - User1 is logged in`, async () => {
                await app1.loginAndInitialize(USER1.EMAIL, USER1.PASSWORD);
            }),
            test.step(`Browser2 - User2 is logged in`, async () => {
                await app2.loginAndInitialize(USER2.EMAIL, USER2.PASSWORD);
            })
        ]);

        await test.step(`Browser1 - User1 has conversation opened`, async () => {
            await app1.conversationListController.clickOnConversationName(CONVERSATION_NAME);
            await expect(app1.chatController.Pom.MESSAGE_ROW_CONTAINER).toBeVisible();
        });

        await test.step(`Reset participants list`, async () => {
            //this will cause an error code if the user does not existing in the channel. But this shouldn't cause any issues in our test.
            await GrcpController.removeUserFromChannel(user1Page, channelId, grId);
        });

        await test.step(`Browser1 - User1 in details view`, async () => {
            await app1.chatController.clickChatHeaderMenu();
            await app1.chatController.selectFromChatHeaderMenu('View Details');
            await app1.detailsController.clickMemberRolesButton();
            await expect(
                app1.detailsController.Pom.DROP_DOWN_REMOVE,
                `Participant list is empty`
            ).not.toBeVisible();
        });

        await test.step(`Browser1 - User1 invites User2 as participant of channel`, async () => {
            await app1.detailsController.clickSelectParticipants();
            await app1.detailsController.selectParticipant('channel 2');
            await app1.detailsController.clickFooterButton('Select');
        });
    });
    await test.step(`WHEN - Browser2 - User2 accept invite`, async () => {
        await app2.conversationListController.clickOnConversationName(CONVERSATION_NAME);
        await app2.inviteController.acceptInvite();
    });

    await test.step(`THEN - Browser2 - User2 can see messages`, async () => {
        await expect(app2.chatController.Pom.MESSAGE_ROW_CONTAINER).toBeVisible();
    });
});
