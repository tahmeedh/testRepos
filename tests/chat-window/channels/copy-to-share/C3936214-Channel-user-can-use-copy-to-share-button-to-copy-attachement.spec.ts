import { test, expect } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';
import { StringUtils } from 'helper/string-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const USER1 = users.COPY_TO_SHARE_1;
const CONVERSATION_NAME = 'copy-to-share-restricted-channel';
const FILE = './asset/download.png';
const CAPTION1 = StringUtils.generateString();
const CAPTION2 = StringUtils.generateString();

test(`${testName} ${testTags} @static`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    const app = new BaseController(page);

    await test.step(`GIVEN`, async () => {
        await test.step(`User is logged in`, async () => {
            await app.goToLoginPage();
            await app.loginController.loginToPortal(USER1.EMAIL, USER1.PASSWORD);
            await app.portalController.closeEnableDesktopNotification();
        });

        await test.step(`User is in SUC feed view`, async () => {
            await app.conversationListController.clickOnConversationName(CONVERSATION_NAME);
        });

        await test.step(`User sent an attachment`, async () => {
            await app.chatController.attachfile(FILE);
            await app.previewAttachmentController.fillCaption(CAPTION1);
            await app.previewAttachmentController.clickSendButton();
        });

        await test.step(`File is displayed in feed view only once`, async () => {
            await expect(app.chatController.Pom.ALL_CONTENT.getByText(CAPTION1)).toHaveCount(1);
        });

        await test.step(`User clicks on 'Copy to share' option`, async () => {
            await app.chatController.hoverOverMessageRow(CAPTION1);
            await app.chatController.clickOnChatBubbleMenu();
            await app.chatController.selectFromChatBubbleMenu('Copy to Share');
        });

        await test.step(`User focus on chat input`, async () => {
            await app.chatController.clickChatInput();
        });
    });

    await test.step(`STEP1. User can paste copied attachment into chat input`, async () => {
        await test.step(`WHEN - User presses 'control+v' to paste`, async () => {
            await app.pressKey('Control+V');
        });

        await test.step(`THEN - File preview is displayed`, async () => {
            await expect(app.previewAttachmentController.Pom.PREVIEW_SEND_BUTTON).toBeVisible();
        });
    });

    await test.step(`STEP2. User can send copied attachment`, async () => {
        await test.step(`WHEN - User clicks on send in file preview`, async () => {
            await app.previewAttachmentController.fillCaption(CAPTION2);
            await app.previewAttachmentController.clickSendButton();
        });

        await test.step(`THEN - File is displayed in feed view as the latest message`, async () => {
            await expect(app.chatController.Pom.ALL_CONTENT.nth(-1)).toHaveText(CAPTION2);
        });
        await test.step(`AND - File is displayed in feed view only once`, async () => {
            await expect(app.chatController.Pom.ALL_CONTENT.getByText(CAPTION2)).toHaveCount(1);
        });
    });

    await test.step(`STEP3. Attachment can be opened`, async () => {
        await test.step(`WHEN - User clicks on thumbnail`, async () => {
            await app.chatController.clickThumbnailByRow(-1);
        });

        await test.step(`THEN - File preview is opened`, async () => {
            await expect(app.attachmentViewerController.Pom.CLOSE_BUTTON).toBeVisible();
        });
    });
});
