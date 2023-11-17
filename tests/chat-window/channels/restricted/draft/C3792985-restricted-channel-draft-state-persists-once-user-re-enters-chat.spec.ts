import { expect, test, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { TestUtils } from 'helper/test-utils';
import { BaseController } from '../../../../../controller/base-controller';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);
let browser = null;
let context1 = null;
let app = null;
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
    // user1 login
    context1 = await browser.newContext();
    const page1 = await context1.newPage();
    app = new BaseController(page1);
    await app.goToLoginPage();
    await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
    await app.closeTooltips();

    // user create channel
    await app.startChatButtonController.ClickOnStartChannel();
    const title = StringUtils.generateString(3, 5);
    await app.createChatController.fillOutWhatIsItAboutForm(title, 'sub', 'descri');
    await app.createChatController.fillOutWhoCanPostForm();
    await app.createChatController.fillOutWhoCanJoinForm(
        'restricted',
        [],
        [`${user2.userInfo.firstName} ${user2.userInfo.lastName}`]
    );
    await app.createChatController.CreateChannel();

    const draftText = StringUtils.generateString();
    await app.chatController.sendContent();
    await app.chatController.typeContent(draftText);
    await app.messageHubController.clickSideBarChatsButton();

    await app.messageHubController.clickMessageHubRow.getByText(title);
    const secondaryLine = await app.Pom.MESSAGEIFRAME.getByText(draftText);
    await expect(secondaryLine).toHaveText(draftText);
});

test.afterEach(async () => {
    await company.teardown();
});
