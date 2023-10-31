import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { WhatsAppController } from 'Apis/mds/whatsApp-controller';
import { PhoneNumberUtils } from 'Apis/api-helpers/phoneNumber-utils';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { MdsController } from 'Apis/mds/mds-controller';

test('C777', async () => {
    Log.info(`===================== START: Running whatsApp assign script =====================`);
    try {
        const userEmail = '';
        const companyId = 664543; // 664543 for vega, 665764 for Capella
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } = EnvUtils.getEndPoints();

        if (!userEmail || !companyId) {
            throw new Error(`FAILURE: User e-mail and Company Id cannot be empty`);
        }

        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);
        const accountId = PhoneNumberUtils.randomPhone();

        const whatsAppController = new WhatsAppController(gskToken, csrfToken, MDS_ENDPOINT);
        const mdsController = new MdsController(gskToken, csrfToken, MDS_ENDPOINT);

        Log.info('Checking if user already has WhatsApp Provider assigned');
        const user = await mdsController.getUserFromCompanyByEmail(companyId, userEmail);
        const userId = user.id;

        const userHasWhatsApp = (listOfEndPoints) => {
            const result = listOfEndPoints.endpoints.filter((endpoint) => endpoint.type === 'WHATSAPP');
            if (result.length > 0 && result[0].address) {
                throw new Error(
                    `User already have a WhatsApp account '${result[0].address}' assigned. Please remove WhatsApp account and re-run this script.`
                );
            }
            Log.info('User has no WhatsApp account assigned.');
            return false;
        };

        if (!userHasWhatsApp(user)) {
            await whatsAppController.addWhatsAppProviderToCompany(companyId, accountId);
            await whatsAppController.setWhatsAppAccountToActive(companyId, accountId);
            await whatsAppController.assignWhatsAppAccountToUser(userId, accountId);
        }

        Log.success(`SUCCESS: WhatsApp entitlement has been suscessfully assigned to user ${userEmail}`);
    } catch (error) {
        Log.error(`FAILURE: An error occured when assigning WhatsApp entitlements`, error);
        test.fail();
    }
    Log.info(`===================== END: WhatsApp assign script ended =====================`);
});
