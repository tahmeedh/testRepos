/* eslint-disable no-await-in-loop, max-depth*/

import { SMClient } from 'Apis/sm/client';
import { PlatformController } from 'Apis/sm/platform/platform-controller';
import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { TwilioController } from 'Apis/mds/twilio-controller';
import { WhatsAppController } from 'Apis/mds/whatsApp-controller';
import { EnvUtils } from 'Apis/api-helpers/env-utils';

test('C999', async () => {
    Log.info(`===================== START: Running company cleanup script =====================`);
    try {
        const stringToSearch = 'zebra-';
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL, SM_THRIFT_HOST, SM_THRIFT_PORT } =
            EnvUtils.getEndPoints();

        if (!stringToSearch) {
            throw new Error(`FAILURE: String to Search cannot be empty`);
        }
        const smClient = new SMClient(SM_THRIFT_HOST, SM_THRIFT_PORT);
        const platformController = new PlatformController(smClient);

        const listOfCompanies = await platformController.getCompanies(stringToSearch);
        Log.highlight(`${listOfCompanies.length} companies found`);

        const listOfCompanyIds = listOfCompanies.map((element) => {
            return element.companyId;
        });
        Log.highlight(`Deleteing the following companies: ${listOfCompanyIds}`);

        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);

        const twilioController = new TwilioController(gskToken, csrfToken, MDS_ENDPOINT);
        const whatsAppController = new WhatsAppController(gskToken, csrfToken, MDS_ENDPOINT);

        for (const companyId of listOfCompanyIds) {
            Log.highlight(`Deleteing the following company: ${companyId}`);

            const twilioNumbers = await twilioController.getAllTwilioNumbersFromCompany(companyId);
            const whatsAppProviders = await whatsAppController.getAllWhatsAppAccountFromCompany(companyId);

            Log.highlight(`Tearing down: Detected ${twilioNumbers.length} Twilio number.`);
            for (const numberObj of twilioNumbers) {
                const { number } = numberObj;
                if (numberObj.user) {
                    const { id } = numberObj.user;
                    await twilioController.unassignTwilioNumberFromUser(id, number);
                }
                await twilioController.releaseTwilioNumberFromCompany(companyId, number);
            }

            Log.highlight(`Tearing down: Detected ${whatsAppProviders.length} WhatsApp number.`);
            for (const numberObj of whatsAppProviders) {
                const { accountId } = numberObj;
                if (numberObj.user) {
                    const { id } = numberObj.user;
                    await whatsAppController.unassignWhatsAppAccountFromUser(id, accountId);
                }
                await whatsAppController.removeWhatsAppProviderFromCompany(companyId, accountId);
            }
            await platformController.deleteCompany(companyId);
        }
        Log.success(`SUCCESS: ${listOfCompanies.length} companies has been deleted`);
    } catch (error) {
        Log.error(`FAILURE: An error occured when deleting companies`, error);
    }
    Log.info(`===================== END: Company cleanup complete =====================`);
});
