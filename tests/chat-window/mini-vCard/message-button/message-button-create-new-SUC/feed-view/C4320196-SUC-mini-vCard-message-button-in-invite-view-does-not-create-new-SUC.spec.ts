import { test, expect } from '@playwright/test';
import { Company } from 'Apis/company';
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

        await test.step(`User is in SUC create view`, async () => {
            const sucCreateData = {
                senderGrcpAlias: user2.userInfo.grcpAlias,
                receiverGrcpAlias: user1.userInfo.grcpAlias,
                content: 'Hello test message'
            };
            await GrcpCreateController.createSUC(user2Page, sucCreateData);
            const conversationID = await app1.conversationListController.getConversationId('Test-MUC');
            await GrcpInviteController.acceptSUCInvite(user1Page, conversationID);
            await app1.conversationListController.clickOnConversationName(
                `${user2.userInfo.firstName} ${user2.userInfo.lastName}`
            );
            await app1.inviteController.hoverHeaderAvatar();
        });
    });

    await test.step(`WHEN - User clicks on Message Button`, async () => {
        await app1.miniVCardController.clickMessageBtn();
    });

    await test.step(`THEN - User is in draft mode`, async () => {
        await expect(app1.chatController.Pom.CHAT_INTRO).toHaveText('Invitation to connect');
    });

    await test.step(`WHEN - User send a message`, async () => {
        await expect(app1.chatController.Pom.CHAT_BACK_BUTTON).toBeVisible();
        await expect(app1.chatController.Pom.CHAT_FAVOURITE_BUTTON).toBeVisible();
        await expect(app1.chatController.Pom.CHAT_FLAG_BUTTON).toBeVisible();
        await expect(app1.chatController.Pom.CHAT_HEADER_MENU).not.toBeVisible();
    });
});
