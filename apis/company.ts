/* eslint-disable no-await-in-loop */

import { SMClient } from './sm/client';
import { PlatformController } from './sm/platform/platform-controller';
import { DirectoryController } from './sm/directory/directory-controller';
import { COMPANY_DEFAULT_SETTINGS, USER_DEFAULT_SETTINGS } from './smconfig.config';
import { User } from './user';
import { ApplicationName } from './sm/platform/thrift-generated/Platform_types';
import { Log } from './api-helpers/log-utils';
import { MessageController } from './sm/message/message-controller';
import 'dotenv/config';
import { EndpointsType, EnvUtils } from './api-helpers/env-utils';
import { CleanUpUtils } from './api-helpers/cleanUp-utils';

export interface CompanyType {
    smClient: SMClient;
    platformController: PlatformController;
    directoryController: DirectoryController;
    messageController: MessageController;
    companyName: string;
    companyDomain: string;
    companyId: number;
    endpoints: EndpointsType;
}
export class Company {
    companyInfo: CompanyType;

    constructor(company: CompanyType) {
        this.companyInfo = company;
    }

    static async createCompany(
        companyName = `${COMPANY_DEFAULT_SETTINGS.NAME_PREFIX}${COMPANY_DEFAULT_SETTINGS.NAME()}`
    ) {
        const END_POINTS = EnvUtils.getEndPoints();
        const { ENV, SM_THRIFT_HOST, SM_THRIFT_PORT } = END_POINTS;

        const companyDomain = `${companyName}.com`;
        const smClient = new SMClient(SM_THRIFT_HOST, SM_THRIFT_PORT);
        const platformController = new PlatformController(smClient);
        const directoryController = new DirectoryController(smClient);
        const messsageController = new MessageController(smClient);

        Log.info(`===================== START: Creating company on ${ENV} enviroment =====================`);
        const companyId = await platformController.createCompanyWithDomain(companyName, companyDomain);
        await platformController.enableAllServices(companyId);
        await Promise.all([
            platformController.enableGrMessage(companyId),
            directoryController.updateDirectorySettings(companyId, COMPANY_DEFAULT_SETTINGS.DIRCTORY_SETTINGS)
        ]);

        const company: Company = new Company({
            smClient,
            platformController,
            directoryController,
            messageController: messsageController,
            companyName,
            companyDomain,
            companyId,
            endpoints: END_POINTS
        });

        Log.highlight(
            `=== Company Name: ${companyName} | Company Domain: ${companyDomain} | Company Id:${companyId} ===`
        );
        Log.info('===================== END: Company created =====================');
        return company;
    }

    async deleteCompany() {
        const { companyId } = this.companyInfo;
        await this.companyInfo.platformController.deleteCompany(companyId);
    }

    async getRoles(applicationName: 'Directory' | 'ServiceManager', format = true) {
        const { companyId } = this.companyInfo;
        const applicationId = ApplicationName[applicationName];
        return this.companyInfo.platformController.getCompanyRoles(companyId, applicationId, format);
    }

    async createUser() {
        const defaultUserConfig = {
            firstName: USER_DEFAULT_SETTINGS.FIRST_NAME,
            lastName: USER_DEFAULT_SETTINGS.LAST_NAME(),
            password: USER_DEFAULT_SETTINGS.PASSWORD,
            entitlements: USER_DEFAULT_SETTINGS.ENTITLEMENTS,
            jobTitle: USER_DEFAULT_SETTINGS.JOB_TITLE,
            mobilePhone: USER_DEFAULT_SETTINGS.MOBILE_PHONE(),
            workPhone: USER_DEFAULT_SETTINGS.WORK_PHONE(),
            homePhone: USER_DEFAULT_SETTINGS.HOME_PHONE(),
            company: this.companyInfo
        };
        const user: User = await User.createUser(defaultUserConfig);
        return user;
    }

    async addUserToEachOthersRoster(arrayOfUsers: User[]) {
        const arrayOfPromises = [];
        for (let x = 0; x < arrayOfUsers.length; x++) {
            for (let y = 0; y < arrayOfUsers.length; y++) {
                if (x !== y) {
                    arrayOfPromises.push(arrayOfUsers[x].addUserToRoster(arrayOfUsers[y]));
                }
            }
        }
        await Promise.all(arrayOfPromises);
    }

    async teardown() {
        Log.info(`===================== START: Tearing down company =====================`);
        const { companyId } = this.companyInfo;
        await CleanUpUtils.releaseAllPhoneNumbersFromCompany(companyId);
        await this.deleteCompany();
        Log.info('===================== END: Tear down completed =====================');
    }
}
