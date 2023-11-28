import { test, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from 'Controllers/base-controller';
import { User } from 'Apis/user';
import { UidUtils } from 'Apis/api-helpers/uid-Utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let app: BaseController;

let company: Company;
let user1: User = null;

test.beforeAll(async () => {
    company = await Company.createCompany();
    user1 = await company.createUser();

    await Promise.all([
        user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD')
    ]);

    await user1.requestAndAssignTwilioNumber();
});

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);

    app = new BaseController(page);
    let phoneNumber: string;
    const uniqueFirstName = UidUtils.generateStringbyBytes(4);
    let userName: string;
    await test.step('GIVEN - User has an existing SMS conversation', async () => {
        await test.step('Go to login page', async () => {
            await app.goToLoginPage();
        });

        await test.step('Login', async () => {
            await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
            await app.closeTooltips();
        });

        await test.step('Starts a SMS conversation', async () => {
            await app.startChatButtonController.ClickOnStartSMS();
            phoneNumber = await app.createChatController.CreateSMS();
            userName = `${uniqueFirstName} lastname`;
            await app.chatController.fillRecipientInfoModal(uniqueFirstName, 'lastname');
        });

        await test.step('Return to conversations view', async () => {
            await app.messageHubController.clickSideBarChatsButton();
        });

        await test.step('User search for the contact by name', async () => {
            await app.globalSearchController.fillSearchField(userName);
            //Sometimes the external user won't show up in global search results if we search immideiately after creating the conversation
            //Since there are no element to wait for, this is a retry mechinism to overcome the above issue.
            await expect(async () => {
                await app.globalSearchController.clickOnSearchButton();
                await expect(
                    app.globalSearchController.Pom.SEARCH_RESULT_ROW.getByText(userName)
                ).toBeVisible();
            }).toPass();
        });
    });

    await test.step('Step 1 - User can add info to vCard', async () => {
        await test.step('User clicks on avatar on global search result', async () => {
            await app.globalSearchController.clickOnSearchResultRowAvatar(userName);
        });

        await test.step('vCard is displayed', async () => {
            await expect(app.vCardController.Pom.FIRST_LAST_NAME).toHaveText(userName);
            await expect(app.vCardController.Pom.PHONE_NUMBER).toHaveText(phoneNumber);
            await expect(app.vCardController.Pom.TEXT_ICON).toBeVisible();
        });

        await test.step('User clicks on the edit button', async () => {
            await app.vCardController.clickOnEditButton();
        });

        await test.step('User info fields are populated', async () => {
            await expect(app.vCardEditController.Pom.FIELD_FIRST_NAME).toHaveValue(uniqueFirstName);
            await expect(app.vCardEditController.Pom.FIELD_LAST_NAME).toHaveValue(`lastname`);
            await expect(app.vCardEditController.Pom.FIELD_COMPANY).toHaveValue(``);
            await expect(app.vCardEditController.Pom.FIELD_EMAIL).toHaveValue(``);
            await expect(app.vCardEditController.Pom.FIELD_JOB_TITLE).toHaveValue(``);
        });

        await test.step('User fill in the fields', async () => {
            await app.vCardEditController.fillFirstNameField(`first`);
            await app.vCardEditController.fillLastNameField(`last`);
            await app.vCardEditController.fillCompanyField(`company`);
            await app.vCardEditController.fillEmailField(`email@email.com`);
            await app.vCardEditController.fillJobTitleField(`jobtitle`);
        });

        await test.step('User clicks on the save button', async () => {
            await app.vCardEditController.clickOnSaveButton();
        });

        await test.step('User info are updated on vCard', async () => {
            await expect(app.vCardController.Pom.FIRST_LAST_NAME).toHaveText(`first last`);
            await expect(app.vCardController.Pom.PHONE_NUMBER).toHaveText(phoneNumber);
            await expect(app.vCardController.Pom.COMPANY).toHaveText(`company`);
            await expect(app.vCardController.Pom.EMAIL).toHaveText(`email@email.com`);
            await expect(app.vCardController.Pom.JOB_TITLE).toHaveText(`jobtitle`);

            await expect(app.vCardController.Pom.TEXT_ICON).toBeVisible();
            await expect(app.vCardController.Pom.CALL_ICON).toBeVisible();
        });
    });

    await test.step('Step 2 - User can remove info from vCard', async () => {
        await test.step('User clicks on the edit button', async () => {
            await app.vCardController.clickOnEditButton();
        });

        await test.step('User info fields are populated', async () => {
            await expect(app.vCardEditController.Pom.FIELD_FIRST_NAME).toHaveValue(`first`);
            await expect(app.vCardEditController.Pom.FIELD_LAST_NAME).toHaveValue(`last`);
            await expect(app.vCardEditController.Pom.FIELD_COMPANY).toHaveValue(`company`);
            await expect(app.vCardEditController.Pom.FIELD_EMAIL).toHaveValue(`email@email.com`);
            await expect(app.vCardEditController.Pom.FIELD_JOB_TITLE).toHaveValue(`jobtitle`);
        });

        await test.step('User remove content in all fields', async () => {
            await app.vCardEditController.fillFirstNameField(``);
            await app.vCardEditController.fillLastNameField(``);
            await app.vCardEditController.fillCompanyField(``);
            await app.vCardEditController.fillEmailField(``);
            await app.vCardEditController.fillJobTitleField(``);
        });
        await test.step('User clicks on the save button', async () => {
            await app.vCardEditController.clickOnSaveButton();
        });

        await test.step('vCard only contain phone number', async () => {
            await expect(app.vCardController.Pom.FIRST_LAST_NAME).toBeHidden();
            await expect(app.vCardController.Pom.PHONE_NUMBER).toHaveText(phoneNumber);
            await expect(app.vCardController.Pom.COMPANY).toBeHidden();
            await expect(app.vCardController.Pom.EMAIL).toBeHidden();
            await expect(app.vCardController.Pom.JOB_TITLE).toBeHidden();
        });
    });
});

test.afterAll(async () => {
    await company.teardown();
});
