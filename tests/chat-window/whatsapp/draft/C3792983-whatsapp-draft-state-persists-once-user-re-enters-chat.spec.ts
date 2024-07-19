import { test, expect } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { users } from 'Constants/users';
import { BaseController } from 'Controllers/base-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);

const USER1 = users.DARFT_1;
const CONVERSATION_NAME = 'draft-wa';
const INPUT_CONTENT = 'test message 1234';

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

        await test.step(`User type in chat input`, async () => {
            await app.chatController.typeContent(INPUT_CONTENT);
            await expect(
                app.chatController.Pom.CHAT_INPUT_DRAFT_EDITOR,
                `Chat input has text '${CONVERSATION_NAME}'`
            ).toHaveText(INPUT_CONTENT);
        });

        await test.step(`User navigate away from conversation`, async () => {
            await app.navigationController.clickSideBarChatsButton();
        });
    });

    await test.step(`WHEN`, async () => {
        await test.step(`User re-open conversation`, async () => {
            await app.conversationListController.clickOnConversationName(CONVERSATION_NAME);
        });
    });

    await test.step(`THEN`, async () => {
        await expect(
            app.chatController.Pom.CHAT_INPUT_DRAFT_EDITOR,
            `Chat input has text '${CONVERSATION_NAME}'`
        ).toHaveText(INPUT_CONTENT);
    });
});
