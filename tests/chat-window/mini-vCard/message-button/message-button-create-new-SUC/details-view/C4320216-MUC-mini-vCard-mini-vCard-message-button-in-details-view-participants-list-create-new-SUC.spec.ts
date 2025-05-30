import { test, expect } from '@playwright/test';
import { Company } from 'Apis/company';
import { GrcpCreateController } from 'Apis/grcp/grcp-create-controller';
import { GrcpInviteController } from 'Apis/grcp/grcp-invite-controller';
import { User } from 'Apis/user';
import { BaseController } from 'Controllers/base-controller';
import { TestUtils } from 'helper/test-utils';

const { testAnnotation, testName, testTags } = TestUtils.getTestInfo(__filename);

test(`${testName} ${testTags}`, async ({ page }) => {
    test.info().annotations.push(testAnnotation);
    const app = new BaseController(page);
    let user1: User;
    let user2: User;

    await test.step(`GIVEN`, async () => {
        await test.step(`User is created`, async () => {
            const company = await Company.createCompany();
            [user1, user2] = await Promise.all([company.createUser(), company.createUser()]);
        });

        await test.step(`User is logged in`, async () => {
            await app.loginAndInitialize(user1.userInfo.email, user1.userInfo.password);
        });

        await test.step(`User is in MUC details view, and participant list mini-vCard is opened`, async () => {
            const createMucData = {
                subject: 'Test-MUC',
                participantsGrcpAliases: [user1.userInfo.grcpAlias]
            };
            await GrcpCreateController.createMUC(page, createMucData);
            const conversationID = await app.conversationListController.getConversationId('Test-MUC');
            await GrcpInviteController.acceptMUCInvite(page, conversationID);
            await app.conversationListController.clickOnConversationName('Test-MUC');
            await app.chatController.clickChatHeaderMenu();
            await app.chatController.selectFromChatHeaderMenu('View Details');
            await app.detailsController.hoverParticipantListAvatarByName(
                `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
            );
        });
    });

    await test.step(`WHEN - User clicks on Message Button`, async () => {
        await app.miniVCardController.clickMessageBtn();
    });

    await test.step(`THEN - User is in draft mode`, async () => {
        await expect(app.chatController.Pom.CHAT_INTRO).toHaveText('Post a message to start conversation');
    });

    await test.step(`WHEN - User send a message`, async () => {
        await expect(app.chatController.Pom.CHAT_BACK_BUTTON).toBeVisible();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON).not.toBeVisible();
        await expect(app.chatController.Pom.CHAT_FLAG_BUTTON).not.toBeVisible();
        await expect(app.chatController.Pom.CHAT_HEADER_MENU).not.toBeVisible();
        await app.chatController.typeContent('hello test message');
        await app.chatController.clickSendButton();
    });

    await test.step(`THEN - Conversation is created`, async () => {
        await expect(app.chatController.Pom.CHAT_INTRO).not.toBeVisible();
        await expect(app.chatController.Pom.CHAT_BACK_BUTTON).toBeVisible();
        await expect(app.chatController.Pom.CHAT_FAVOURITE_BUTTON).toBeVisible();
        await expect(app.chatController.Pom.CHAT_FLAG_BUTTON).toBeVisible();
        await expect(app.chatController.Pom.CHAT_HEADER_MENU).toBeVisible();
        await expect(app.chatController.Pom.ALL_CONTENT.last()).toHaveText('hello test message');
    });
});
