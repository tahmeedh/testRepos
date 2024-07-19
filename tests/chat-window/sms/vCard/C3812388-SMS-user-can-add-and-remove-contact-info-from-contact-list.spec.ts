import { test, expect } from '@playwright/test';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { users } from 'Constants/users';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
const USER1 = users.VCARD_2;

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    const app = new BaseController(page);

    await test.step('GIVEN - User has vCard opened', async () => {
        await test.step('Go to login page', async () => {
            await app.goToLoginPage();
        });

        await test.step('Login', async () => {
            await app.loginController.loginToPortal(USER1.EMAIL, USER1.PASSWORD);
            await app.portalController.closeEnableDesktopNotification();
        });

        await test.step('Go to contact list view', async () => {
            await app.messageHubController.clickSideBarContactsButton();
        });

        await test.step('vCard is opened', async () => {
            await app.contactListController.clickContactRowAvatarByPhoneNumber(`+1 778 681 3761`);
        });
    });

    await test.step('Step1 - User remove info from external vCard', async () => {
        await test.step('WHEN - User clicks on the edit button', async () => {
            await app.vCardController.clickOnEditButton();
        });

        await test.step('AND - User remove content in all fields', async () => {
            await app.vCardEditController.fillFirstNameField(``);
            await app.vCardEditController.fillLastNameField(``);
            await app.vCardEditController.fillCompanyField(``);
            await app.vCardEditController.fillEmailField(``);
            await app.vCardEditController.fillJobTitleField(``);
        });

        await test.step('AND - User clicks on the save button', async () => {
            await app.vCardEditController.clickOnSaveButton();
        });

        await test.step('THEN - vCard only contain phone number', async () => {
            await expect(app.vCardController.Pom.FIRST_LAST_NAME).toBeHidden();
            await expect(app.vCardController.Pom.PHONE_NUMBER).toHaveText('+1 778 681 3761');
            await expect(app.vCardController.Pom.COMPANY).toBeHidden();
            await expect(app.vCardController.Pom.EMAIL).toBeHidden();
            await expect(app.vCardController.Pom.JOB_TITLE).toBeHidden();
        });
    });

    await test.step('Step3 - User add info to external vCard', async () => {
        await test.step('WHEN - User clicks on the edit button', async () => {
            await app.vCardController.clickOnEditButton();
        });

        await test.step('AND - User fill in the fields', async () => {
            await app.vCardEditController.fillFirstNameField(`first`);
            await app.vCardEditController.fillLastNameField(`last`);
            await app.vCardEditController.fillCompanyField(`company`);
            await app.vCardEditController.fillEmailField(`email@email.com`);
            await app.vCardEditController.fillJobTitleField(`jobtitle`);
        });

        await test.step('AND - User clicks on the save button', async () => {
            await app.vCardEditController.clickOnSaveButton();
        });

        await test.step('THEN - User info are updated on vCard', async () => {
            await expect(app.vCardController.Pom.FIRST_LAST_NAME).toHaveText(`first last`);
            await expect(app.vCardController.Pom.PHONE_NUMBER).toHaveText(`+1 778 681 3761`);
            await expect(app.vCardController.Pom.COMPANY).toHaveText(`company`);
            await expect(app.vCardController.Pom.EMAIL).toHaveText(`email@email.com`);
            await expect(app.vCardController.Pom.JOB_TITLE).toHaveText(`jobtitle`);
            await expect(app.vCardController.Pom.TEXT_ICON).toBeVisible();
            await expect(app.vCardController.Pom.CALL_ICON).toBeVisible();
        });
    });

    await test.step('Step4 - User info is displayed in vCard edit view', async () => {
        await test.step('WHEN - User clicks on the edit button', async () => {
            await app.vCardController.clickOnEditButton();
        });

        await test.step('User info fields are populated', async () => {
            await expect(app.vCardEditController.Pom.FIELD_FIRST_NAME).toHaveValue(`first`);
            await expect(app.vCardEditController.Pom.FIELD_LAST_NAME).toHaveValue(`last`);
            await expect(app.vCardEditController.Pom.FIELD_COMPANY).toHaveValue(`company`);
            await expect(app.vCardEditController.Pom.FIELD_EMAIL).toHaveValue(`email@email.com`);
            await expect(app.vCardEditController.Pom.FIELD_JOB_TITLE).toHaveValue(`jobtitle`);
        });
    });
});
