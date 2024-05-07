import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { MdsController } from 'Apis/mds/mds-controller';
import { PhoneNumberController } from 'Apis/mds/phoneNumber-controller';

test('C555', async () => {
    Log.info(`===================== START: Running phone number assign script =====================`);
    try {
        const userEmail = 'test.user18@vega.com';
        const companyId = 664543; // CPQA2: 664543 for vega, 665764 for Capella

        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } = EnvUtils.getEndPoints();

        // Validate grid and companyId exist
        if (!userEmail || !companyId) {
            throw new Error(`FAILURE: User email and Company Id cannot be empty`);
        }

        // get gsk and csrf token
        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);

        // check if user already has a number
        const mdsController = new MdsController(gskToken, csrfToken, MDS_ENDPOINT);
        const userMdsProfile = await mdsController.getUserFromCompanyByEmail(companyId, userEmail);
        const userMdsId = userMdsProfile.id;

        const userListOfEndPoints = userMdsProfile.endpoints;
        const result = userListOfEndPoints.filter((endpoint) => endpoint.type === 'SMS_SERVICE');
        if (result.length > 0 && result[0].address) {
            throw new Error(
                `User already has phone number '${result[0].address}' assigned. Please remove existing phone number and re-run this script.`
            );
        }
        Log.info('User has no number assigned.');

        // assign phone number to user
        const phoneNumberController = new PhoneNumberController(gskToken, csrfToken, MDS_ENDPOINT);
        const phoneNumber = await phoneNumberController.purchaseNumberForCompany(companyId, 'CA', '604');

        // setting features for the phone number
        const phoneNumerSettings = {
            disclaimerRequired: false,
            forwardingAllowed: true,
            mmsAllowed: true,
            recordingRequired: false,
            smsAllowed: true,
            voiceAllowed: true,
            location: 'LOCAL',
            voicemailAllowed: true
        };
        await phoneNumberController.setNumberFeatures(companyId, phoneNumber, phoneNumerSettings);

        await phoneNumberController.assignNumberToUser(userMdsId, phoneNumber);
        Log.success(`Number '${phoneNumber}' has been assigned to user with email '${userEmail}'`);
    } catch (error) {
        Log.error(`An error occured when assigning a phone number to user`, error);
        test.fail();
    }
    Log.info(`===================== END: phone number assign script ended =====================`);
});
