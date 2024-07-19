/* eslint-disable no-await-in-loop */

import { SMClient } from 'Apis/sm/client';
import { PlatformController } from 'Apis/sm/platform/platform-controller';
import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { CleanUpUtils } from 'Apis/api-helpers/cleanUp-utils';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';

test('C999', async () => {
    Log.info(`===================== START: Running company cleanup script =====================`);
    test.setTimeout(0);
    try {
        const stringToSearch = 'zebra-';
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const { SM_THRIFT_HOST, SM_THRIFT_PORT, MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL } =
            EnvUtils.getEndPoints();

        //check string query is not empty
        if (!stringToSearch) {
            throw new Error(`FAILURE: String to Search cannot be empty`);
        }

        const smClient = new SMClient(SM_THRIFT_HOST, SM_THRIFT_PORT);
        const platformController = new PlatformController(smClient);

        //get list of company names contain the specific string
        const listOfCompanies = await platformController.getCompanies(stringToSearch);
        Log.highlight(`${listOfCompanies.length} companies found`);

        // if no companies were found, end script
        if (listOfCompanies.length === 0) {
            Log.highlight(`0 company found. Aborting script.`);
            return;
        }

        // get a list of companyIDs that need to be deleted
        const listOfCompanyIds = listOfCompanies.map((element) => {
            return element.companyId;
        });

        // delete all companies in list
        Log.highlight(`Deleting the following companies: ${listOfCompanyIds}`);
        const deletedCompanies = [];
        const ignoredCompanies = [];

        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );

        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);

        for (const companyId of listOfCompanyIds) {
            try {
                await CleanUpUtils.releaseAllPhoneNumbersFromCompany(companyId, gskToken, csrfToken);
                await platformController.deleteCompany(companyId);
                deletedCompanies.push(companyId);
            } catch (e) {
                Log.error(`Failed to delete ${companyId}. Ignoring this company.`, e);
                ignoredCompanies.push(companyId);
            }
        }
        Log.success(` ${deletedCompanies.length} companies have been deleted. ${deletedCompanies}`);
        Log.success(` ${ignoredCompanies.length} companies have been skipped. ${ignoredCompanies}`);
    } catch (error) {
        Log.error(`FAILURE: An error occured when deleting companies`, error);
        test.fail();
    }
    Log.info(`===================== END: Company cleanup complete =====================`);
});
