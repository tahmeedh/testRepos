import { test, expect } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.OGG_PLYAER;

test(`${testName} ${testTags} @static`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    const app = new BaseController(page);

    await test.step(`GIVEN`, async () => {
        await test.step(`User is logged in`, async () => {
            await app.goToLoginPage();
            await app.loginController.loginToPortal(user1.EMAIL, user1.PASSWORD);
            await app.portalController.closeEnableDesktopNotification();
        });

        await test.step(`User is in SUC feed view`, async () => {
            await app.conversationListController.clickOnConversationName('ogg channel');
        });

        await test.step(`User clicks on 'Copy to share' option`, async () => {
            await app.chatController.hoverOverMessageRow('ogg file');
            await app.chatController.clickOnChatBubbleMenu();
            await app.chatController.selectFromChatBubbleMenu('Copy to Share');
        });

        await test.step(`User focus on chat input`, async () => {
            await app.chatController.clickChatInput();
        });
    });

    await test.step(`WHEN - User presses 'control+v' to paste`, async () => {
        await app.pressKey('Control+V');
    });

    await test.step(`THEN - File preview is displayed`, async () => {
        await expect(app.previewAttachmentController.Pom.PREVIEW_SEND_BUTTON).toBeVisible();
    });
});
