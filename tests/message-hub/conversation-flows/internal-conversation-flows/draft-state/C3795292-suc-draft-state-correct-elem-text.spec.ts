import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { TestUtils } from 'helper/test-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { BaseController } from '../../../../../controllers/base-controller';
import { StringUtils } from '../../../../../helper/string-utils';

const { testAnnotation, testName, testTags, testChatType } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app: BaseController;

let company: Company;
let user1 = null;
let user2 = null;

test.beforeEach(async () => {
    browser = await chromium.launch();
    company = await Company.createCompany();
    user1 = await company.createUser();
    user2 = await company.createUser();
    await company.addUserToEachOthersRoster([user1, user2]);
});

test(`${testName} ${testTags}`, async () => {
    test.info().annotations.push(testAnnotation);
    Log.starDivider(
        `START TEST: Create browser and login with ${user1.userInfo.firstName} ${user1.userInfo.lastName}`
    );
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);

    await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);

    Log.info(`Start ${testChatType} chat and send message`);
    await app.hubHeaderController.clickStartChatButton();
    await app.hubHeaderController.selectHeaderMainMenuOption('One-to-One');
    await app.createChatController.CreateSUC(`${user2.userInfo.firstName} ${user2.userInfo.lastName}`);
    await app.chatController.sendContent();
    const draftText = StringUtils.generateString();
    Log.success(
        `SUCCESS: ${testChatType} conversation was created with '${user2.userInfo.firstName} ${user2.userInfo.lastName}''`
    );

    Log.info(`${testChatType} chat expects ${draftText} string in draft state `);
    await app.chatController.typeContent(draftText);
    await app.navigationController.clickSideBarChatsButton();

    const secondaryLine = await app.Pom.MESSAGEIFRAME.getByText(draftText);
    await expect(secondaryLine).toHaveText(draftText);
    Log.starDivider(`END TEST: Test Execution Commpleted`);
});
