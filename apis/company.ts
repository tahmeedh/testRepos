import { SMClient } from './sm/client';
import { PlatformController } from './sm/platform/platform-controller';
import { DirectoryController } from './sm/directory/directory-controller';
import { COMPANY_DEFAULT_SETTINGS, USER_DEFAULT_SETTINGS } from '../smconfig.config';
import { User } from './user';
import { ApplicationName } from './sm/platform/thrift-generated/Platform_types';
import { Log } from './api-helpers/log-utils';
import { MessageController } from './sm/message/message-controller';
import { END_POINTS } from './endpoints';

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
    company: CompanyType;

    constructor(company: CompanyType) {
        this.company = company;
    }

    static async createCompany(
        companyName = `${COMPANY_DEFAULT_SETTINGS.NAME_PREFIX}${COMPANY_DEFAULT_SETTINGS.NAME()}`
    ) {
        const companyDomain = `${companyName}.com`;
        const env = process.env.SERVER;
        const smClient = new SMClient(END_POINTS.SM_THRIFT_HOST[env], 7443);
        const platformController = new PlatformController(smClient);
        const directoryController = new DirectoryController(smClient);
        const messsageController = new MessageController(smClient);

        Log.info('===================== START: Creating company =====================');
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
        const { companyId } = this.company;
        await this.company.platformController.deleteCompany(companyId);
    }

    async getRoles(applicationName: 'Directory' | 'ServiceManager', format = true) {
        const { companyId } = this.company;
        const applicationId = ApplicationName[applicationName];
        return this.company.platformController.getCompanyRoles(companyId, applicationId, format);
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
            company: this.company
        };
        const user: User = await User.createUser(defaultUserConfig);
        return user;
    }
}
