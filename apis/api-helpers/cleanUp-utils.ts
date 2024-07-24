import 'dotenv/config';
import { WhatsAppController } from 'Apis/mds/whatsApp-controller';
import { PhoneNumberController } from 'Apis/mds/phoneNumber-controller';
import { EnvUtils } from './env-utils';
import { Log } from './log-utils';

export class CleanUpUtils {
    static async releaseAllPhoneNumbersFromCompany(companyId: number, gskToken: string, csrfToken: string) {
        Log.info(
            `===================== START: Releasing all phone numbers from company =====================`
        );
        const { MDS_ENDPOINT } = EnvUtils.getEndPoints();
        const phoneNumberController = new PhoneNumberController(gskToken, csrfToken, MDS_ENDPOINT);
        const whatsAppController = new WhatsAppController(gskToken, csrfToken, MDS_ENDPOINT);

        const twilioNumbers = await phoneNumberController.getAllNumbersFromCompany(companyId);
        const whatsAppProviders = await whatsAppController.getAllWhatsAppAccountFromCompany(companyId);

        // MDS will unassign number from user automatically when we release/remove Twilio/WhatsApp number from a company.
        // Hence, no need to unassign number from user before releasing.
        Log.highlight(`Tearing down: Detected ${twilioNumbers.length} Twilio numbers.`);
        const listOfPromises = [];
        for (const numberObj of twilioNumbers) {
            const { number } = numberObj;
            listOfPromises.push(phoneNumberController.releaseNumberFromCompany(companyId, number));
        }

        Log.highlight(`Tearing down: Detected ${whatsAppProviders.length} WhatsApp numbers.`);
        for (const numberObj of whatsAppProviders) {
            const { accountId } = numberObj;
            listOfPromises.push(whatsAppController.removeWhatsAppProviderFromCompany(companyId, accountId));
        }

        await Promise.all(listOfPromises);
        Log.info(
            `===================== END: All phone numbers have been released from company =====================`
        );
    }
}
