import { test } from '@playwright/test';
import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { Company } from 'Apis/company';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { TwilioController } from 'Apis/mds/twilio-controller';
import { WhatsAppController } from 'Apis/mds/whatsApp-controller';
import { BaseController } from 'controller/base-controller';

test('C666', async ({ page }) => {
    let company1: Company;

    try {
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } = EnvUtils.getEndPoints();
        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken('1234', MDS_ENDPOINT);
        // const twilioController = new TwilioController(gskToken, csrfToken, MDS_ENDPOINT);
        // const whatsAppController = new WhatsAppController(gskToken, csrfToken, MDS_ENDPOINT);

        // company1 = await Company.createCompany();
        // const user1 = await company1.createUser();
        // const user2 = await company1.createUser();

        // await Promise.all([
        //     user1.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        //     user1.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD'),
        //     user1.removeEntitlement('FILE_SHARING'),
        //     user2.assignServiceManagerRole('MESSAGE_ADMINISTRATOR'),
        //     user2.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD'),
        //     user2.removeEntitlement('FILE_SHARING')
        // ]);
        // await Promise.all([
        //     user1.requestAndAssignWhatsAppNumber(),
        //     user1.requestAndAssignTwilioNumber(),
        //     user2.requestAndAssignWhatsAppNumber(),
        //     user2.requestAndAssignTwilioNumber()
        // ]);

        // await company1.addUserToEachOthersRoster([user1, user2]);

        // const app = new BaseController(page);
        // await app.goToLoginPage();
        // await app.loginController.loginToPortal(user1.userInfo.email, user1.userInfo.password);
        // await app.page.pause();
    } catch (err) {
        console.error(err);
    } finally {
        // await company1.teardown();
    }
});
