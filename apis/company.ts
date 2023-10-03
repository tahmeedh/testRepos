import { SMClient } from './sm/client';
import { PlatformController } from './sm/platform/platform-controller';
import { DirectoryController } from './sm/directory/directory-controller';
import { USER_DEFAULT_SETTINGS, COMPANY_DEFAULT_SETTINGS } from '../smconfig.config';
import { User } from './user';
import { ApplicationName } from './sm/platform/thrift-generated/Platform_types';
import { Log } from './api-helpers/log-utils';
import { MessageController } from './sm/message/message-controller';
import { END_POINTS } from './endpoints';

export interface CompanyType {
    client: SMClient;
    platformController: PlatformController;
    directoryController: DirectoryController;
    messageController: MessageController;
    companyName: string;
    companyDomain: string;
    companyId: number;
}
export class Company {
    client: SMClient;
    platformController: PlatformController;
    directoryController: DirectoryController;
    messageController: MessageController;
    companyName: string;
    companyDomain: string;
    companyId: number;
    constructor() {
        this.client = new SMClient(END_POINTS.SM_THRIFT_HOST[process.env.SERVER], 7443);
        this.platformController = new PlatformController(this.client);
        this.directoryController = new DirectoryController(this.client);
        this.messageController = new MessageController(this.client);
        this.companyId = null;
        this.companyDomain = null;
        this.companyName = null;
    }

    async createCompany() {
        Log.info('===================== START: Creating company =====================');
        if (!this.companyId) {
            const companyName = `${COMPANY_DEFAULT_SETTINGS.NAME_PREFIX}${COMPANY_DEFAULT_SETTINGS.NAME()}`;
            const companyDomain = `${companyName}.com`;
            const companyId = await this.platformController.createCompanyWithDomain(
                companyName,
                companyDomain
            );

            await this.platformController.enableAllServices(companyId);
            await Promise.all([
                this.platformController.enableGrMessage(companyId),
                this.directoryController.updateDirectorySettings(
                    companyId,
                    COMPANY_DEFAULT_SETTINGS.DIRCTORY_SETTINGS
                )
            ]);

            this.companyId = companyId;
            this.companyDomain = companyDomain;
            this.companyName = companyName;
            Log.highlight(
                `=== Company Name: ${this.companyName} | Company Domain: ${this.companyDomain} | Company Id:${this.companyId} ===`
            );
            Log.info('===================== END: Company created =====================');
            return this;
        }
        throw new Error(`Company with '${this.companyId}' already exist!`);
    }

    async deleteCompany() {
        if (this.companyId) {
            await this.platformController.deleteCompany(this.companyId);
        } else {
            throw new Error('Company ID is empty. No company were deleted.');
        }
    }

    async getDirectoryRoles(format = true) {
        if (this.companyId) {
            const { companyId } = this;
            const applicationId = ApplicationName.Directory;
            return this.platformController.getCompanyRoles(companyId, applicationId, format);
        }
        throw new Error('Company ID is empty. Please initialize company first.');
    }

    async getServiceManagerRoles(format = true) {
        if (this.companyId) {
            const { companyId } = this;
            const applicationId = ApplicationName.ServiceManager;
            return this.platformController.getCompanyRoles(companyId, applicationId, format);
        }
        throw new Error('Company ID is empty. Please initialize company first.');
    }

    async createUser() {
        if (this.companyId) {
            const defaultUserConfig = {
                firstName: USER_DEFAULT_SETTINGS.FIRST_NAME,
                lastName: USER_DEFAULT_SETTINGS.LAST_NAME(),
                password: USER_DEFAULT_SETTINGS.PASSWORD,
                jobTitle: USER_DEFAULT_SETTINGS.JOB_TITLE,
                mobilePhone: USER_DEFAULT_SETTINGS.MOBILE_PHONE(),
                workPhone: USER_DEFAULT_SETTINGS.WORK_PHONE(),
                homePhone: USER_DEFAULT_SETTINGS.HOME_PHONE(),
                entitlements: USER_DEFAULT_SETTINGS.ENTITLEMENTS,
                userId: null,
                grcpAlias: null,
                email: null,
                roleName: null,
                roleId: null,
                company: this
            };

            const user = new User(defaultUserConfig);
            await user.createUser();
            return user;
        }
        throw new Error('Company ID is empty. Please initialize company first.');
    }
}
