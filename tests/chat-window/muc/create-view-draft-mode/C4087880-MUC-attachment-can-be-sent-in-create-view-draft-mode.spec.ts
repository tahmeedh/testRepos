import { test, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { User } from 'Apis/user';
import { BaseController } from 'Controllers/base-controller';
import { StringUtils } from 'helper/string-utils';
import { TestUtils } from 'helper/test-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);

const file = './asset/download.png';
const caption = StringUtils.generateString();

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    const app = new BaseController(page);
    let user1: User;
    let user2: User;

    await test.step(`GIVEN`, async () => {
        await test.step(`User is created`, async () => {
            const company = await Company.createCompany();
            [user1, user2] = await Promise.all([company.createUser(), company.createUser()]);
            await company.addUserToEachOthersRoster([user1, user2]);
        });

        await test.step(`User is logged in`, async () => {
            await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);
        });

        await test.step(`User is in SUC feed view`, async () => {
            await app.hubHeaderController.clickStartChatButton();
            await app.hubHeaderController.selectHeaderMainMenuOption('Multi-Party');
            await app.createChatController.clickUserRowInternal(
                `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
            );
            await app.createChatController.clickFooterButton('Next');
            await app.createChatController.clickFooterButton('Next');
        });
    });

    await test.step(`WHEN`, async () => {
        await test.step(`WHEN - User starts`, async () => {
            await expect(app.chatController.Pom.CHAT_INTRO).toHaveText(
                'Post a message to start conversation'
            );
            await app.previewAttachmentController.attachFile(file);
            await app.previewAttachmentController.fillCaption(caption);
            await app.previewAttachmentController.clickSendButton();
        });
    });

    await test.step(`THEN`, async () => {
        await test.step(`File is sent once`, async () => {
            await expect(
                app.chatController.Pom.MESSAGE_ROW_CONTAINER.last().locator('.m-auto-message-content')
            ).toHaveText(caption);
            await expect(
                app.chatController.Pom.MESSAGE_ROW_CONTAINER.last().getByTestId('loading')
            ).not.toBeVisible();
            await expect(app.chatController.Pom.MESSAGE_ROW_CONTAINER).toHaveCount(1);
        });
    });
});
