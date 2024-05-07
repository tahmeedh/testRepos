import { GskController } from 'Apis/gas/gsk-controller';
import { BandwidthController } from 'Apis/mds/bandwidth-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { users } from 'Constants/users';
import { WhatsAppController } from 'Apis/mds/whatsApp-controller';
import { SMClient } from 'Apis/sm/client';
import { PlatformController } from 'Apis/sm/platform/platform-controller';
import { PhoneNumberController } from 'Apis/mds/phoneNumber-controller';
import { Log } from './log-utils';
import { EnvUtils } from './env-utils';

export class BandwidthUtils {
    groupTextPhoneNumber: string;
    companyId: number;
    admin_email: string;
    admin_password: string;

    constructor(
        groupTextPhoneNumber: string,
        companyId: number,
        admin_email: string,
        admin_password: string
    ) {
        this.groupTextPhoneNumber = groupTextPhoneNumber;
        this.companyId = companyId;
        this.admin_email = admin_email;
        this.admin_password = admin_password;
    }

    async assignBandwidthNumber(userId: number) {
        const { ADMIN_VEGA_AUTOMATION } = users;

        const groupTextNumber = this.groupTextPhoneNumber;
        const ADMIN_USERNAME = ADMIN_VEGA_AUTOMATION.EMAIL;
        const ADMIN_PASSWORD = ADMIN_VEGA_AUTOMATION.PASSWORD;
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } = EnvUtils.getEndPoints();

        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);

        const bandwidthController = new BandwidthController(gskToken, csrfToken, MDS_ENDPOINT);
        await bandwidthController.assignBandwidthNumberToUser(userId, groupTextNumber);
    }

    async unassignBandwidthNumber(userId: number) {
        const { ADMIN_VEGA_AUTOMATION } = users;

        const groupTextNumber = this.groupTextPhoneNumber;
        const ADMIN_USERNAME = ADMIN_VEGA_AUTOMATION.EMAIL;
        const ADMIN_PASSWORD = ADMIN_VEGA_AUTOMATION.PASSWORD;
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } = EnvUtils.getEndPoints();

        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);

        const bandwidthController = new BandwidthController(gskToken, csrfToken, MDS_ENDPOINT);
        await bandwidthController.unassignBandwidthNumberFromUser(userId, groupTextNumber);
    }

    async removeNonBanwidthNumbersFromCompany() {
        const { ADMIN_VEGA_AUTOMATION } = users;

        const groupTextNumber = this.groupTextPhoneNumber;
        const { companyId } = this;
        const ADMIN_USERNAME = ADMIN_VEGA_AUTOMATION.EMAIL;
        const ADMIN_PASSWORD = ADMIN_VEGA_AUTOMATION.PASSWORD;
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } = EnvUtils.getEndPoints();

        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);

        const phoneNumberController = new PhoneNumberController(gskToken, csrfToken, MDS_ENDPOINT);
        const whatsAppController = new WhatsAppController(gskToken, csrfToken, MDS_ENDPOINT);
        const bandwidthController = new BandwidthController(gskToken, csrfToken, MDS_ENDPOINT);

        const twilioNumbers = await phoneNumberController.getAllNumbersFromCompany(companyId);
        const whatsAppProviders = await whatsAppController.getAllWhatsAppAccountFromCompany(companyId);

        const filteredTwilioNumbers = await twilioNumbers.filter(
            (numberObj) => numberObj.number !== groupTextNumber
        );
        const filteredgroupTextNumber = await twilioNumbers.filter(
            (numberObj) => numberObj.number === groupTextNumber
        );

        if (filteredgroupTextNumber[0].user) {
            try {
                await bandwidthController.unassignBandwidthNumberFromUser(
                    filteredgroupTextNumber[0].user.id,
                    groupTextNumber
                );
            } catch (error) {
                Log.error(`FAILURE: Failed to unassign group text number from user': `, error);
                throw error(error);
            }
        }

        Log.highlight(`Tearing down: Detected ${twilioNumbers.length} Twilio number.`);
        const listOfPromises = [];
        for (const numberObj of filteredTwilioNumbers) {
            const { number } = numberObj;
            listOfPromises.push(phoneNumberController.releaseNumberFromCompany(companyId, number));
        }

        Log.highlight(`Tearing down: Detected ${whatsAppProviders.length} WhatsApp number.`);
        for (const numberObj of whatsAppProviders) {
            const { accountId } = numberObj;
            listOfPromises.push(whatsAppController.removeWhatsAppProviderFromCompany(companyId, accountId));
        }
        await Promise.all(listOfPromises);
    }

    async removeTestUsersFromBandwidthCompany() {
        const { SM_THRIFT_HOST, SM_THRIFT_PORT } = EnvUtils.getEndPoints();
        const { companyId } = this;
        const smClient = new SMClient(SM_THRIFT_HOST, SM_THRIFT_PORT);
        const platformController = new PlatformController(smClient);

        const listOfUsersToBeRemoved = await platformController.searchForUserInCompany(companyId, 'auto');

        const listOfPromises = [];

        Log.highlight(`Tearing down: Detected ${listOfUsersToBeRemoved.length} users.`);
        for (const user of listOfUsersToBeRemoved) {
            listOfPromises.push(platformController.deleteUser(user.userId));
        }
        await Promise.all(listOfPromises);
    }
}
