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
            await app.closeTooltips();
        });

        await test.step(`User is in SUC feed view`, async () => {
            await app.conversationListController.clickOnConversationName('ogg WA');
        });
    });

    await test.step(`WHEN - User clicks on play button in voice player`, async () => {
        await app.chatController.clickVoiceNotePlayButton();
    });

    await test.step(`THEN - Voice note is played until timestamp gets to 00:00`, async () => {
        await expect(app.chatController.Pom.VOICE_NOTE_TIMESTAMP).toHaveText('00:00');
    });
});
