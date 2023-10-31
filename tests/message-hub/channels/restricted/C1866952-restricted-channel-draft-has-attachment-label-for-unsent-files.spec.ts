import { expect, test, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { StringUtils } from 'helper/string-utils';
import { BaseController } from '../../../../controller/base-controller';

test.describe('@Restricted @Channel @Draft', () => {
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

    test('@Real C1866952 : Restricted Channel draft state has file attachment icon and text for unsent files ', async () => {
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
            'Restricted',
            [],
            [`${user2.userInfo.firstName} ${user2.userInfo.lastName}`]
        );
        await app.createChatController.CreateChannel();
        await app.chatController.sendContent();

        // user drafts image in conversation
        const PNG = './asset/download.png';
        await app.chatController.waitForHeader();
        await app.attachmentController.draftAttachment(PNG);
        await app.messageHubController.clickSideBarChatsButton();

        expect(app.messageHubController.Pom.DRAFT_TEXT_LINE).toBeVisible();
        expect(app.messageHubController.Pom.ATTACHMENT_ICON).toBeVisible();
        expect(app.messageHubController.Pom.ATTACHMENT_TEXT_LINE).toBeVisible();

        // send video in channel
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
