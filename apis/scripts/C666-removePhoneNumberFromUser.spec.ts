import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { MdsController } from 'Apis/mds/mds-controller';
import { PhoneNumberController } from 'Apis/mds/phoneNumber-controller';

test('C666', async () => {
    Log.info(`===================== START: Running Twilio number removal script =====================`);
    try {
        const userEmail = 'test.user18@vega.com';
        const companyId = 664543; // CPQA2: 664543 for vega, 665764 for Capella

        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } = EnvUtils.getEndPoints();

        // Validate grid and companyId exist
        if (!userEmail || !companyId) {
            throw new Error(`FAILURE: User grId and Company Id cannot be empty`);
        }

        // get gsk and csrf token
        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);

        // get user's phone number
        const mdsController = new MdsController(gskToken, csrfToken, MDS_ENDPOINT);
        const userMdsProfile = await mdsController.getUserFromCompanyByEmail(companyId, userEmail);

        const userListOfEndPoints = userMdsProfile.endpoints;

        const getUserNumber = (listOfEndPoints) => {
            const result = listOfEndPoints.filter((endpoint) => endpoint.type === 'SMS_SERVICE');
            if (result.length === 0 || !result[0].address) {
                throw new Error('User has no number assigned. Aborting script.');
            }
            return result[0].address;
        };
        const userNumber = getUserNumber(userListOfEndPoints);

        // release phone number from company
        const phoneNumberController = new PhoneNumberController(gskToken, csrfToken, MDS_ENDPOINT);
        await phoneNumberController.releaseNumberFromCompany(companyId, userNumber);

        Log.success(`Number has been successfully removed from user with email '${userEmail}'`);
    } catch (error) {
        Log.error(`An error occured when removing Twilio number from user`, error);
        test.fail();
    }
    Log.info(`===================== END: Twilio number removal script ended =====================`);
});
