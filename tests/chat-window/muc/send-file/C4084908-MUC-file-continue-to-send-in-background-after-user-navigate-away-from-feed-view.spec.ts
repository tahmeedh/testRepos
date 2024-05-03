import { test, expect } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.SENDFILE_1;
const conversationName = 'send-file-muc';
const file = './asset/audio.mp3';

test(`${testName} ${testTags} @static`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    const app = new BaseController(page);

    await test.step(`GIVEN`, async () => {
        await test.step(`User is logged in`, async () => {
            await page.route('**/mfsapi/v1/files?', async (route) => {
                await route.abort();
            });

            await app.goToLoginPage();
            await app.loginController.loginToPortal(user1.EMAIL, user1.PASSWORD);
            await app.portalController.closeEnableDesktopNotification();
        });

        await test.step(`User in feed view`, async () => {
            await app.conversationListController.clickOnConversationName(conversationName);
        });

        await test.step(`User sent a file`, async () => {
            await app.previewAttachmentController.attachFile(file);
            await app.previewAttachmentController.clickSendButton();
        });

        await test.step(`User navigated away from conversation`, async () => {
            await app.navigationController.clickSideBarChatsButton();
        });
    });

    await test.step(`WHEN`, async () => {
        await test.step(`User re-open conversation`, async () => {
            await app.conversationListController.clickOnConversationName(conversationName);
        });
    });

    await test.step(`THEN`, async () => {
        await test.step(`File is still sending and visible`, async () => {
            await expect(
                app.chatController.Pom.MESSAGE_ROW_CONTAINER.last().locator('.m-auto-file-download-indicator')
            ).toBeVisible();
            await expect(
                app.chatController.Pom.MESSAGE_ROW_CONTAINER.last().locator('.m-auto-primary-text')
            ).toHaveText('audio');
        });
    });
});
