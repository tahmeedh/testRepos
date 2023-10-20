/* eslint-disable no-await-in-loop */

import { SMClient } from './sm/client';
import { PlatformController } from './sm/platform/platform-controller';
import { DirectoryController } from './sm/directory/directory-controller';
import { COMPANY_DEFAULT_SETTINGS, USER_DEFAULT_SETTINGS } from './smconfig.config';
import { User } from './user';
import { ApplicationName } from './sm/platform/thrift-generated/Platform_types';
import { Log } from './api-helpers/log-utils';
import { MessageController } from './sm/message/message-controller';
import { API_ENDPOINTS } from './api-endpoints';
import { ApiEndpointUtils } from './api-helpers/api-endpoint-utils';
import { GskController } from './gas/gsk-controller';
import { CsrfController } from './mds/csrf-controller';
import { TwilioController } from './mds/twilio-controller';
import { WhatsAppController } from './mds/whatsApp-controller';
import 'dotenv/config';

export interface CompanyType {
    smClient: SMClient;
    platformController: PlatformController;
    directoryController: DirectoryController;
    messageController: MessageController;
    companyName: string;
    companyDomain: string;
    companyId: number;
    env: string;
}
export class Company {
    companyInfo: CompanyType;

    constructor(company: CompanyType) {
        this.companyInfo = company;
    }

    static async createCompany(
        companyName = `${COMPANY_DEFAULT_SETTINGS.NAME_PREFIX}${COMPANY_DEFAULT_SETTINGS.NAME()}`
    ) {
        if (!ApiEndpointUtils.isApiEndPointValid(process.env.SERVER)) {
            const error = new Error();
            Log.error(
                `FAILURE: Process.env.SERVER '${process.env.SERVER}' is not valid. Create company aborted`,
                error
            );
            throw error;
        }

        const env = process.env.SERVER;
        const companyDomain = `${companyName}.com`;
        const smClient = new SMClient(API_ENDPOINTS.SM_THRIFT_HOST[env], 7443);
        const platformController = new PlatformController(smClient);
        const directoryController = new DirectoryController(smClient);
        const messsageController = new MessageController(smClient);

        Log.info(`===================== START: Creating company on ${env} enviroment =====================`);
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
            env
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
        await Promise.all([
            this._unassignAndReleaseAllTwilioNumbers(),
            this._unassignAndRemoveAllWhatsAppAccount()
        ]);
        await this.deleteCompany();
        Log.info('===================== END: Tear down completed =====================');
    }

    async _unassignAndReleaseAllTwilioNumbers() {
        const { env, companyId } = this.companyInfo;
        const gskToken = await GskController.getGskToken('slui@gr.net', 'Pwd123*', env);
        const csrfToken = await CsrfController.getCsrfToken(gskToken, env);

        const twilioController = new TwilioController(gskToken, csrfToken, env);
        const twilioNumbers = await twilioController.getAllTwilioNumbersFromCompany(companyId);

        Log.highlight(`Tearing down: Detected ${twilioNumbers.length} Twilio number.`);
        for (const numberObj of twilioNumbers) {
            const { number } = numberObj;
            if (numberObj.user) {
                const { id } = numberObj.user;
                await twilioController.unassignTwilioNumberFromUser(id, number);
            }
            await twilioController.releaseTwilioNumberFromCompany(companyId, number);
        }
    }

    async _unassignAndRemoveAllWhatsAppAccount() {
        const { env, companyId } = this.companyInfo;
        const adminUser = process.env.ADMIN_USERNAME;
        const adminPassword = process.env.ADMIN_PASSWORD;

        const gskToken = await GskController.getGskToken(adminUser, adminPassword, env);
        const csrfToken = await CsrfController.getCsrfToken(gskToken, env);

        const whatsAppController = new WhatsAppController(gskToken, csrfToken, env);
        const whatsAppProviders = await whatsAppController.getAllWhatsAppAccountFromCompany(companyId);

        Log.highlight(`Tearing down: Detected ${whatsAppProviders.length} WhatsApp number.`);
        for (const numberObj of whatsAppProviders) {
            const { accountId } = numberObj;
            if (numberObj.user) {
                const { id } = numberObj.user;
                await whatsAppController.unassignWhatsAppAccountFromUser(id, accountId);
            }
            await whatsAppController.removeWhatsAppProviderFromCompany(companyId, accountId);
        }
    }
}
