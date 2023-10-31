import { test, expect, chromium } from '@playwright/test';
import { Company } from 'Apis/company';
import { BaseController } from '../../../controller/base-controller';
import { StringUtils } from '../../../helper/string-utils';

test.describe('@MUC @Draft', () => {
    let browser = null;
    let context1 = null;
    let app: BaseController;

    let company: Company;
    let user1 = null;
    let user2 = null;
    let user3 = null;

    test.beforeEach(async () => {
        browser = await chromium.launch();
        company = await Company.createCompany();
        user1 = await company.createUser();
        user2 = await company.createUser();
        user3 = await company.createUser();
        await company.addUserToEachOthersRoster([user1, user2]);
    });

    test('@Real C3792981: Conversation list displays correct elements of MUC draft state for unsent message', async () => {
        // user1 login
        context1 = await browser.newContext();
        const page1 = await context1.newPage();
        app = new BaseController(page1);

        await app.goToLoginPage();
        // user login
        await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        await app.closeTooltips();

        // user start 1-1
        await app.startChatButtonController.ClickOnStartMUC();
        const user2fullName = `${user2.userInfo.firstName} ${user2.userInfo.lastName}`;
        const user3fullName = `${user3.userInfo.firstName} ${user3.userInfo.lastName}`;
        const subject = await app.createChatController.createMUC([user2fullName, user3fullName]);

        // user send message in conversation
        const draftText = StringUtils.generateString();
        await app.chatController.sendContent();
        await app.chatController.typeContent(draftText);
        await app.chatListController.clickSideBarChatsButton();

        await app.chatListController.Pom.CHAT_NAME.getByText(subject).click();
        const secondaryLine = app.Pom.MESSAGEIFRAME.getByText(draftText);
        await expect(secondaryLine).toHaveText(draftText);
    });

    test.afterEach(async () => {
        await company.teardown();
    });
});
