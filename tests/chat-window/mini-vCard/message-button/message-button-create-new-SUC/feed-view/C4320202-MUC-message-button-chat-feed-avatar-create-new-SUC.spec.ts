import { test, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { GrcpController } from 'Apis/grcp/grcp-controller';
import { GrcpCreateController } from 'Apis/grcp/grcp-create-controller';
import { GrcpInviteController } from 'Apis/grcp/grcp-invite-controller';
import { User } from 'Apis/user';
import { BaseController } from 'Controllers/base-controller';
import { TestUtils } from 'helper/test-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);

test(`${testName} ${testTags}`, async ({ browser }) => {
    test.info().annotations.push(testAnnotation);
    const browser1 = await browser.newContext();
    const user1Page = await browser1.newPage();
    const app1 = new BaseController(user1Page);

    const browser2 = await browser.newContext();
    const user2Page = await browser2.newPage();
    const app2 = new BaseController(user2Page);
    let user1: User;
    let user2: User;

    await test.step(`GIVEN`, async () => {
        await test.step(`User is created`, async () => {
            const company = await Company.createCompany();
            [user1, user2] = await Promise.all([company.createUser(), company.createUser()]);
        });

        await test.step(`User is logged in`, async () => {
            await Promise.all([
                app1.loginAndInitialize(user1.userInfo.email, user1.userInfo.password),
                app2.loginAndInitialize(user2.userInfo.email, user2.userInfo.password)
            ]);
        });

        await test.step(`User is in MUC invite view`, async () => {
            const createMucData = {
                subject: 'Test-MUC',
                participantsGrcpAliases: [user1.userInfo.grcpAlias]
            };
            await GrcpCreateController.createMUC(user2Page, createMucData);
            const conversationID = await app1.conversationListController.getConversationId('Test-MUC');
            await GrcpController.sendContent(user2Page, conversationID, 'Test message 1234');
            await GrcpInviteController.acceptMUCInvite(user1Page, conversationID);
            await app1.conversationListController.clickOnConversationName('Test-MUC');
            await app1.chatController.hoverOverMessageRowAvatar(0);
        });
    });

    await test.step(`WHEN - User clicks on Message Button`, async () => {
        await app1.miniVCardController.clickMessageBtn();
    });

    await test.step(`THEN - User is in draft mode`, async () => {
        await expect(app1.chatController.Pom.CHAT_INTRO).toHaveText('Post a message to start conversation');
    });

    await test.step(`WHEN - User send a message`, async () => {
        await expect(app1.chatController.Pom.CHAT_BACK_BUTTON).toBeVisible();
        await expect(app1.chatController.Pom.CHAT_FAVOURITE_BUTTON).not.toBeVisible();
        await expect(app1.chatController.Pom.CHAT_FLAG_BUTTON).not.toBeVisible();
        await expect(app1.chatController.Pom.CHAT_HEADER_MENU).not.toBeVisible();
        await app1.chatController.typeContent('hello test message');
        await app1.chatController.clickSendButton();
    });

    await test.step(`THEN - Conversation is created`, async () => {
        await expect(app1.chatController.Pom.CHAT_INTRO).not.toBeVisible();
        await expect(app1.chatController.Pom.CHAT_BACK_BUTTON).toBeVisible();
        await expect(app1.chatController.Pom.CHAT_FAVOURITE_BUTTON).toBeVisible();
        await expect(app1.chatController.Pom.CHAT_FLAG_BUTTON).toBeVisible();
        await expect(app1.chatController.Pom.CHAT_HEADER_MENU).toBeVisible();
        await expect(app1.chatController.Pom.ALL_CONTENT.last()).toHaveText('hello test message');
    });
});
