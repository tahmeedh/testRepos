/* eslint-disable no-await-in-loop, max-depth*/

import { SMClient } from 'Apis/sm/client';
import { PlatformController } from 'Apis/sm/platform/platform-controller';
import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { CleanUpUtils } from 'Apis/api-helpers/cleanUp-utils';

test('C999', async () => {
    Log.info(`===================== START: Running company cleanup script =====================`);
    try {
        const stringToSearch = 'zebra-';
        const { SM_THRIFT_HOST, SM_THRIFT_PORT } = EnvUtils.getEndPoints();

        if (!stringToSearch) {
            throw new Error(`FAILURE: String to Search cannot be empty`);
        }

        const smClient = new SMClient(SM_THRIFT_HOST, SM_THRIFT_PORT);
        const platformController = new PlatformController(smClient);

        const listOfCompanies = await platformController.getCompanies(stringToSearch);
        Log.highlight(`${listOfCompanies.length} companies found`);

        if (listOfCompanies.length === 0) {
            Log.highlight(`0 company found. Aborting script.`);
            return;
        }

        const listOfCompanyIds = listOfCompanies.map((element) => {
            return element.companyId;
        });

        Log.highlight(`Deleteing the following companies: ${listOfCompanyIds}`);
        for (const companyId of listOfCompanyIds) {
            await CleanUpUtils.releaseAllPhoneNumbersFromCompany(companyId);
            await platformController.deleteCompany(companyId);
        }

        Log.success(`SUCCESS: ${listOfCompanies.length} companies has been deleted`);
    } catch (error) {
        Log.error(`FAILURE: An error occured when deleting companies`, error);
        test.fail();
    }
    Log.info(`===================== END: Company cleanup complete =====================`);
});
