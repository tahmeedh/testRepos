import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { MdsController } from 'Apis/mds/mds-controller';
import { TwilioController } from 'Apis/mds/twilio-controller';

test('C555', async () => {
    Log.info(`===================== START: Running Twilio number assign script =====================`);
    try {
        const userGrId = 785549;
        const companyId = 664543; // CPQA2: 664543 for vega, 665764 for Capella

        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } = EnvUtils.getEndPoints();

        // Validate grid and companyId exist
        if (!userGrId || !companyId) {
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

        // check if user already has a Twilio number
        const mdsController = new MdsController(gskToken, csrfToken, MDS_ENDPOINT);
        const userMdsProfile = await mdsController.getUserByGrId(userGrId);
        const userMdsId = userMdsProfile.id;

        const userListOfEndPoints = userMdsProfile.endpoints;
        const result = userListOfEndPoints.filter((endpoint) => endpoint.type === 'SMS_SERVICE');
        if (result.length > 0 && result[0].address) {
            throw new Error(
                `User already have a Twilio phone number '${result[0].address}' assigned. Please remove Twilio phone number and re-run this script.`
            );
        }
        Log.info('User has no Twilio number assigned.');

        // assign phone number to user
        const twilioController = new TwilioController(gskToken, csrfToken, MDS_ENDPOINT);
        const twilioPhoneNumber = await twilioController.requestTwilioNumberToCompany(companyId, 'CA', '604');

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
        await twilioController.setTwilioNumberFeatures(companyId, twilioPhoneNumber, phoneNumerSettings);

        await twilioController.assignTwilioNumberToUser(userMdsId, twilioPhoneNumber);
        Log.success(`Twilio number has been assigned to user with grid '${userGrId}'`);
    } catch (error) {
        Log.error(`An error occured when assigning Twilio number to user`, error);
        test.fail();
    }
    Log.info(`===================== END: Twilio number assign script ended =====================`);
});
