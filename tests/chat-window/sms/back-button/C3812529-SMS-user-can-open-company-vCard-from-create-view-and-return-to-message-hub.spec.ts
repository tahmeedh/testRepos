import { test, expect } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let app: BaseController;

const user1 = users.VCARD_1;

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    app = new BaseController(page);

    await test.step('GIVEN', async () => {
        await test.step('Go to login page', async () => {
            await app.goToLoginPage();
        });

        await test.step('Login', async () => {
            await app.loginController.loginToPortal(user1.EMAIL, user1.PASSWORD);
            await app.portalController.closeEnableDesktopNotification();
        });

        await test.step(`User 1 searches for user 2`, async () => {
            await app.hubHeaderController.clickStartChatButton();
            await app.hubHeaderController.selectHeaderMainMenuOption('Text');
            await app.createChatController.SearchSMSUser('vCard 2');
        });
    });

    await test.step('STEP1. User can open vCard', async () => {
        await test.step('WHEN', async () => {
            await app.createChatController.clickRowAvatarByPhoneNumber('+1 604 263 2598');
        });

        await test.step('THEN', async () => {
            await expect(app.vCardController.Pom.COMPANY_NAME_INTERNAL, `vCard is visible`).toHaveText(
                `Vega Static Company`
            );
        });
    });

    await test.step('STEP2. User can open company vCard', async () => {
        await test.step('WHEN', async () => {
            await app.vCardController.Pom.COMPANY_NAME_INTERNAL.click();
        });

        await test.step('THEN', async () => {
            await expect(app.companyVCardController.Pom.COMPANY_NAME, `Company vCard is visible`).toHaveText(
                `Vega Static Company`
            );
        });
    });

    await test.step('STEP3. User can return to user vCard', async () => {
        await test.step('WHEN', async () => {
            await app.companyVCardController.clickOnBackButton();
        });

        await test.step('THEN', async () => {
            await expect(
                app.vCardController.Pom.COMPANY_NAME_INTERNAL,
                `Company vCard is visible`
            ).toHaveText(`Vega Static Company`);
        });
    });

    await test.step('STEP3. User can return to create view', async () => {
        await test.step('WHEN', async () => {
            await app.vCardController.clickOnBackButton();
        });

        await test.step('THEN', async () => {
            await expect(
                app.createChatController.Pom.EXTERNAL_SEARCH_INPUT,
                'User vCard is visible'
            ).toBeVisible();
        });
    });

    await test.step('STEP4. User can return to message hub', async () => {
        await test.step('WHEN', async () => {
            await app.createChatController.clickOnCancelButton();
        });

        await test.step('THEN', async () => {
            await expect(
                app.startChatButtonController.Pom.START_CHAT,
                'message hub start chat button is visible'
            ).toBeVisible();
        });
    });
});
