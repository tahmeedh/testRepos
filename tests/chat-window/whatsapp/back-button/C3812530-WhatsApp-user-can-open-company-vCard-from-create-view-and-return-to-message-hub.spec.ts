import { test, expect } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { Log } from 'Apis/api-helpers/log-utils';
import { users } from 'Constants/users';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let app: BaseController;

const user1 = users.VCARD_1;

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(`START TEST`);
    app = new BaseController(page);

    await test.step('GIVEN - User has an existing SMS conversation', async () => {
        await test.step('Go to login page', async () => {
            await app.goToLoginPage();
        });

        await test.step('Login', async () => {
            await app.loginController.loginToPortal(user1.EMAIL, user1.PASSWORD);
            await app.portalController.closeEnableDesktopNotification();
        });

        await test.step(`User 1 searches for user 2`, async () => {
            await app.hubHeaderController.clickStartChatButton();
            await app.hubHeaderController.selectHeaderMainMenuOption('WhatsApp');
            await app.createChatController.SearchSMSUser('vCard 2');
        });

        await test.step(`User 1 clicks on the avatar of the internal vCard`, async () => {
            await app.createChatController.clickRowAvatarByPhoneNumber('+1 604 263 2598');
            await expect(app.vCardController.Pom.COMPANY_NAME_INTERNAL, `vCard is visible`).toHaveText(
                `Vega Static Company`
            );
        });

        await test.step('Company vCard is displayed when user clicks on company name', async () => {
            await app.vCardController.Pom.COMPANY_NAME_INTERNAL.click();
            await app.page.pause();
            await expect(app.companyVCardController.Pom.COMPANY_NAME, `Company vCard is visible`).toHaveText(
                `Vega Static Company`
            );
        });
    });

    await test.step('User can navigate to back to message hub from company vCard', async () => {
        await test.step('User vCard is displayed when user clicks on back button', async () => {
            await app.companyVCardController.clickOnBackButton();
            await expect(app.vCardController.Pom.COMPANY_NAME_INTERNAL, `vCard is visible`).toHaveText(
                `Vega Static Company`
            );
        });

        await test.step('Create view is displayed when user clicks on back button', async () => {
            await app.vCardController.clickOnBackButton();
            await expect(app.createChatController.Pom.EXTERNAL_SEARCH_INPUT).toBeVisible();
        });

        await test.step('Message hub displayed when user clicks on cancel button', async () => {
            await app.createChatController.clickOnCancelButton();
            await expect(app.startChatButtonController.Pom.START_CHAT).toBeVisible();
        });
    });
});
