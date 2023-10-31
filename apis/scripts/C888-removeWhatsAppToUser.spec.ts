import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { WhatsAppController } from 'Apis/mds/whatsApp-controller';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { MdsController } from 'Apis/mds/mds-controller';

test('C888', async () => {
    Log.info(`===================== START: Running whatsApp removal script =====================`);
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

        const whatsAppController = new WhatsAppController(gskToken, csrfToken, MDS_ENDPOINT);
        const mdsController = new MdsController(gskToken, csrfToken, MDS_ENDPOINT);

        const user = await mdsController.getUserFromCompanyByEmail(companyId, userEmail);
        const userId = user.id;

        const getUserWhatsAppAccountId = (listOfEndPoints) => {
            const result = listOfEndPoints.endpoints.filter((endpoint) => endpoint.type === 'WHATSAPP');
            if (result.length === 0 || !result[0].address) {
                throw new Error('User has no WhatsApp account assigned. Aborting script.');
            }
            return result[0].address;
        };
        const accountId = getUserWhatsAppAccountId(user);
        await whatsAppController.unassignWhatsAppAccountFromUser(userId, accountId);
        await whatsAppController.removeWhatsAppProviderFromCompany(companyId, accountId);
        Log.success(`SUCCESS: WhatsApp entitlement has been suscessfully removed from user '${userEmail}'`);
    } catch (error) {
        Log.error(`FAILURE: An error occured when removing WhatsApp from user`, error);
        test.fail();
    }
    Log.info(`===================== END: WhatsApp removal script ended =====================`);
});
