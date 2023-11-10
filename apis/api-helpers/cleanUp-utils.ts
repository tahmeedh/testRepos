import 'dotenv/config';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { TwilioController } from 'Apis/mds/twilio-controller';
import { WhatsAppController } from 'Apis/mds/whatsApp-controller';
import { EnvUtils } from './env-utils';
import { Log } from './log-utils';

export class CleanUpUtils {
    static async releaseAllPhoneNumbersFromCompany(companyId: number) {
        Log.info(
            `===================== START: Releasing all phone numbers from company =====================`
        );
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } = EnvUtils.getEndPoints();
        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);
        const twilioController = new TwilioController(gskToken, csrfToken, MDS_ENDPOINT);
        const whatsAppController = new WhatsAppController(gskToken, csrfToken, MDS_ENDPOINT);

        const twilioNumbers = await twilioController.getAllTwilioNumbersFromCompany(companyId);
        const whatsAppProviders = await whatsAppController.getAllWhatsAppAccountFromCompany(companyId);

        // MDS will unassign number from user automatically when we release/remove Twilio/WhatsApp number from a company.
        // Hence, no need to unassign number from user before releasing.
        Log.highlight(`Tearing down: Detected ${twilioNumbers.length} Twilio number.`);
        const listOfPromises = [];
        for (const numberObj of twilioNumbers) {
            const { number } = numberObj;
            listOfPromises.push(twilioController.releaseTwilioNumberFromCompany(companyId, number));
        }

        Log.highlight(`Tearing down: Detected ${whatsAppProviders.length} WhatsApp number.`);
        for (const numberObj of whatsAppProviders) {
            const { accountId } = numberObj;
            listOfPromises.push(whatsAppController.removeWhatsAppProviderFromCompany(companyId, accountId));
        }

        await Promise.all(listOfPromises);
        Log.info(
            `===================== END: All phone number has been released from company =====================`
        );
    }
}
