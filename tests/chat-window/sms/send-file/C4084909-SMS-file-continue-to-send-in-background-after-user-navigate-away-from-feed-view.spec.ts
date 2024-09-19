import { test, expect, Route } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';
import { StringUtils } from 'helper/string-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const user1 = users.SENDFILE_1;
const conversationName = 'send-file-sms';
const file = './asset/download.png';
const caption = StringUtils.generateString();

// Unskip when VA-7412 is fixed
test.skip(`${testName} ${testTags} @static`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    const app = new BaseController(page);
    let mfsroute: Route;

    await test.step(`GIVEN`, async () => {
        await test.step(`Prevent MFS from returning a response to keep spinner spinning`, async () => {
            await page.route('**/mfsapi/v1/files?', (route) => {
                mfsroute = route;
            });
        });

        await test.step(`User is logged in`, async () => {
            await app.loginAndInitialize(user1.EMAIL, user1.PASSWORD);
        });

        await test.step(`User in feed view`, async () => {
            await app.conversationListController.clickOnConversationName(conversationName);
        });

        await test.step(`User sent a file`, async () => {
            await app.previewAttachmentController.attachFile(file);
            await app.previewAttachmentController.fillCaption(caption);
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
                app.chatController.Pom.MESSAGE_ROW_CONTAINER.last().locator('.m-auto-message-content')
            ).toHaveText(caption);
            await expect(
                app.chatController.Pom.MESSAGE_ROW_CONTAINER.last().getByTestId('loading')
            ).toBeVisible();
        });

        await test.step(`Resume MFS request`, async () => {
            await mfsroute.continue();
        });

        await test.step(`File is sent`, async () => {
            await expect(
                app.chatController.Pom.MESSAGE_ROW_CONTAINER.last().locator('.m-auto-message-content')
            ).toHaveText(caption);
            await expect(
                app.chatController.Pom.MESSAGE_ROW_CONTAINER.last().getByTestId('loading')
            ).not.toBeVisible();
        });
    });
});
