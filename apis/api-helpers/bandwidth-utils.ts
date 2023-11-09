/* eslint-disable no-await-in-loop */

import { GskController } from 'Apis/gas/gsk-controller';
import { BandwidthController } from 'Apis/mds/bandwidth-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { users } from 'Constants/users';
import { TwilioController } from 'Apis/mds/twilio-controller';
import { WhatsAppController } from 'Apis/mds/whatsApp-controller';
import { SMClient } from 'Apis/sm/client';
import { PlatformController } from 'Apis/sm/platform/platform-controller';
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

        const twilioController = new TwilioController(gskToken, csrfToken, MDS_ENDPOINT);
        const whatsAppController = new WhatsAppController(gskToken, csrfToken, MDS_ENDPOINT);
        const bandwidthController = new BandwidthController(gskToken, csrfToken, MDS_ENDPOINT);

        const twilioNumbers = await twilioController.getAllTwilioNumbersFromCompany(companyId);
        const whatsAppProviders = await whatsAppController.getAllWhatsAppAccountFromCompany(companyId);

        const filteredTwilioNumbers = await twilioNumbers.filter(
            (numberObj) => numberObj.number !== groupTextNumber
        );
        const groupTextNumberItem = await twilioNumbers.filter(
            (numberObj) => numberObj.number === groupTextNumber
        );

        if (groupTextNumberItem[0].user) {
            try {
                await bandwidthController.unassignBandwidthNumberFromUser(
                    groupTextNumberItem[0].user.id,
                    groupTextNumber
                );
            } catch {
                throw new Error(`FAILURE: Releasing phone number ${groupTextNumber} failed.`);
            }
        }

        Log.highlight(`Tearing down: Detected ${filteredTwilioNumbers.length} Twilio number.`);
        for (const numberObj of filteredTwilioNumbers) {
            const { number } = numberObj;
            await twilioController.releaseTwilioNumberFromCompany(companyId, number);
        }

        Log.highlight(`Tearing down: Detected ${whatsAppProviders.length} WhatsApp number.`);
        for (const numberObj of whatsAppProviders) {
            const { accountId } = numberObj;
            await whatsAppController.removeWhatsAppProviderFromCompany(companyId, accountId);
        }
    }

    async removeTestUsersFromBandwidthCompany() {
        const { SM_THRIFT_HOST, SM_THRIFT_PORT } = EnvUtils.getEndPoints();
        const { companyId } = this;
        const smClient = new SMClient(SM_THRIFT_HOST, SM_THRIFT_PORT);
        const platformController = new PlatformController(smClient);

        const listOfUsersToBeRemoved = await platformController.searchForUserInCompany(companyId, 'auto');
        Log.highlight(`Tearing down: Detected ${listOfUsersToBeRemoved.length} users.`);
        for (const user of listOfUsersToBeRemoved) {
            await platformController.deleteUser(user.userId);
        }
    }
}
