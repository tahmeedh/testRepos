import { test, expect } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';
import { StringUtils } from 'helper/string-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const USER1 = users.DRAG_AND_DROP_1;
const CONVERSATION_NAME = 'drag-and-drop-channel-restricted';
const FILE = './asset/video.mp4';
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

        await test.step(`User is in feed view`, async () => {
            await app.conversationListController.clickOnConversationName(CONVERSATION_NAME);
        });

        await test.step(`User sent an attachment`, async () => {
            await app.chatController.attachfile(FILE);
            await app.previewAttachmentController.fillCaption(CAPTION1);
            await app.previewAttachmentController.clickSendButton();
            await expect(app.chatController.Pom.LOAD_SPINNER).toBeVisible();
            await expect(app.chatController.Pom.LOAD_SPINNER).not.toBeVisible();
        });

        await test.step(`File is displayed in feed view only once`, async () => {
            await expect(app.chatController.Pom.ALL_CONTENT.getByText(CAPTION1)).toHaveCount(1);
        });

        await test.step(`User drag thumbnail`, async () => {
            await app.chatController.Pom.VIDEO_THUMBNAIL.nth(-1).hover();
            await app.page.mouse.down();
            await app.chatController.Pom.CHAT_INPUT.hover();
            await app.chatController.Pom.CHAT_INPUT.hover();
            await expect(app.chatController.Pom.DROP_ZONE).toBeInViewport();
        });
    });

    await test.step(`STEP1. User can paste copied attachment into chat input`, async () => {
        await test.step(`WHEN - User drop to release`, async () => {
            await app.page.mouse.up();
        });

        await test.step(`THEN - File preview is displayed`, async () => {
            await expect(app.previewAttachmentController.Pom.PREVIEW_SEND_BUTTON).toBeVisible();
            await expect(app.attachmentViewerController.Pom.PLAY_BUTTON).toBeVisible();
        });
    });

    await test.step(`STEP2. User can send copied attachment`, async () => {
        await test.step(`WHEN - User clicks on send in file preview`, async () => {
            await app.previewAttachmentController.fillCaption(CAPTION2);
            await app.previewAttachmentController.clickSendButton();
            await expect(app.chatController.Pom.LOAD_SPINNER).toBeVisible();
            await expect(app.chatController.Pom.LOAD_SPINNER).not.toBeVisible();
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
            await app.chatController.clickVideoThumbnailByRow(-1);
        });

        await test.step(`THEN - File preview is opened`, async () => {
            await expect(app.attachmentViewerController.Pom.CLOSE_BUTTON).toBeVisible();
            await expect(app.attachmentViewerController.Pom.PLAY_BUTTON).toBeVisible();
        });
    });
});
