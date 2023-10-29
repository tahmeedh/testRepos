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

    test('@Real C3792985 : Send, receive and download video file from channel', async () => {
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
            'open',
            [],
            [`${user2.userInfo.firstName} ${user2.userInfo.lastName}`]
        );
        await app.createChatController.CreateChannel();
        const randomContent = StringUtils.generateString();
        await app.chatController.sendContent();
        await app.chatController.typeContent(randomContent);
        await app.chatListController.clickSideBarChatsButton();

        // await expect(page1.getByText(randomContent)).toBeVisible();
        await app.chatListController.Pom.CHAT_NAME.getByText(title).click();
        const messageReceived = app.Pom.MESSAGEIFRAME.getByText(randomContent);
        await expect(messageReceived).toHaveText(randomContent);

        // send video in channel
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
