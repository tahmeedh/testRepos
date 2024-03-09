/* eslint-disable no-await-in-loop */

import { SMClient } from 'Apis/sm/client';
import { PlatformController } from 'Apis/sm/platform/platform-controller';
import test from '@playwright/test';
import { Log } from 'Apis/api-helpers/log-utils';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { CleanUpUtils } from 'Apis/api-helpers/cleanUp-utils';

test('C999', async () => {
    Log.info(`===================== START: Running company cleanup script =====================`);
    test.setTimeout(0);
    try {
        const stringToSearch = 'zebra-';
        const { SM_THRIFT_HOST, SM_THRIFT_PORT } = EnvUtils.getEndPoints();

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

        // slice array into chunks
        const chunkSize = 5;
        const chunksOfCompanies = [];
        for (let i = 0; i < listOfCompanyIds.length; i += chunkSize) {
            const chunk = listOfCompanyIds.slice(i, i + chunkSize);
            chunksOfCompanies.push(chunk);
        }

        // delete all companies in list
        Log.highlight(`Deleteing the following companies: ${listOfCompanyIds}`);

        const releaseNumbersAndDeleteCompany = async (companyId) => {
            try {
                await CleanUpUtils.releaseAllPhoneNumbersFromCompany(companyId);
                await platformController.deleteCompany(companyId);
            } catch (e) {
                Log.error(`Failed to delete ${companyId}. Ignoring this company.`, e);
            }
        };

        const listOfPromises = [];
        for (const companies of chunksOfCompanies) {
            for (const companyId of companies) {
                listOfPromises.push(releaseNumbersAndDeleteCompany(companyId));
            }
            // delete this batch of companies
            await Promise.allSettled(listOfPromises);
        }
        Log.success(` ${listOfCompanies.length} companies have been deleted`);
    } catch (error) {
        Log.error(`FAILURE: An error occured when deleting companies`, error);
        test.fail();
    }
    Log.info(`===================== END: Company cleanup complete =====================`);
});
