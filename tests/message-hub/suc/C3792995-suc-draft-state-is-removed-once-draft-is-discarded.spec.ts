import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { BaseController } from '../../../controller/base-controller';
import { StringUtils } from '../../../helper/string-utils';

test.describe('@SUC @Draft', () => {
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

    test('@Real C3792995: SUC draft state is removed from Message Hub after chat input is discarded', async () => {
        // user1 login
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);

        await app.goToLoginPage();
        // user login
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.closeTooltips();

        // user start 1-1
        await app.startChatButtonController.ClickOnStartOneToOne();
        await app.createChatController.CreateSUC(`${user2.userInfo.firstName} ${user2.userInfo.lastName}`);

        // user send message in conversation
        const draftState = StringUtils.generateString();
        await app.chatController.sendContent();
        await app.chatController.typeContent(draftState);
        await app.messageHubController.clickSideBarChatsButton();

        await app.messageHubController.Pom.CHAT_NAME.getByText(
            `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
        ).click();
        await app.chatController.removeContent();
        await app.messageHubController.clickSideBarChatsButton();
        const secondaryLine = app.Pom.MESSAGEIFRAME.getByText(draftState);
        await expect(secondaryLine).toHaveCount(0);
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
