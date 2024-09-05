import { Int64 } from 'node-int64';
import { Log } from './api-helpers/log-utils';
import { ApplicationName } from './sm/platform/thrift-generated/Platform_types';
import { ServiceManagerRoles, DirectoryEntitlments, DirectoryRoles } from './sm/platform/sm-roles';
import type { CompanyType } from './company';
import { GskController } from './gas/gsk-controller';
import { CsrfController } from './mds/csrf-controller';
import { WhatsAppController } from './mds/whatsApp-controller';
import { PhoneNumberUtils } from './api-helpers/phoneNumber-utils';
import { PhoneNumberController } from './mds/phoneNumber-controller';
import { EnvUtils } from './api-helpers/env-utils';

export interface UserType {
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    jobTitle: string;
    mobilePhone: string;
    workPhone: string;
    homePhone: string;
    userId: Int64;
    grcpAlias: string;
    twilioNumber?: string;
    whatsAppNumber?: string;
    entitlements: string[];
    roleName: string;
    roleId: Int64;
    company: CompanyType;
    phoneNumberController?: PhoneNumberController;
    whatsAppController?: WhatsAppController;
}

export interface UserConfigType {
    firstName: string;
    lastName: string;
    password: string;
    jobTitle: string;
    mobilePhone: string;
    workPhone: string;
    homePhone: string;
    entitlements: string[];
    company: CompanyType;
}
export interface CustomUserConfigType {
    firstName?: string;
    lastName?: string;
    password?: string;
    jobTitle?: string;
    mobilePhone?: string;
    workPhone?: string;
    homePhone?: string;
    entitlements?: string[];
    company?: CompanyType;
}
export class User {
    userInfo: UserType;
    constructor(user: UserType) {
        this.userInfo = user;
    }

    static async createUser(userConfig: UserConfigType) {
        Log.info('===================== START: Creating user =====================');
        const result = await userConfig.company.platformController.createUser(
            userConfig.company.companyId,
            userConfig.password,
            userConfig.firstName,
            userConfig.lastName,
            userConfig.company.companyDomain
        );
        const { userId } = result;
        const { grcpAlias } = result;
        const { email } = result.userName;

        const profile = {
            jobTitle: userConfig.jobTitle,
            mobilePhone: userConfig.mobilePhone,
            workPhone: userConfig.workPhone,
            homePhone: userConfig.homePhone
        };

        const roleName = userConfig.lastName;

        await Promise.all([
            await userConfig.company.directoryController.updateProfile(userId, profile),
            await userConfig.company.directoryController.createDirectoryRoleForUser(
                userId,
                userConfig.entitlements,
                roleName
            )
        ]);

        const allDirectoryRoles = await userConfig.company.platformController.getCompanyRoles(
            userConfig.company.companyId,
            ApplicationName.Directory,
            true
        );
        const roleId = allDirectoryRoles[roleName];

        const user = new User({
            firstName: userConfig.firstName,
            lastName: userConfig.lastName,
            password: userConfig.password,
            email,
            jobTitle: userConfig.jobTitle,
            mobilePhone: userConfig.mobilePhone,
            workPhone: userConfig.workPhone,
            homePhone: userConfig.homePhone,
            userId,
            grcpAlias,
            entitlements: userConfig.entitlements,
            roleName,
            roleId,
            company: userConfig.company
        });

        Log.highlight(
            `=== Username: ${email} | Password: ${userConfig.password} | UserId: ${userId} | grcpAlias: ${grcpAlias}===`
        );
        Log.info('===================== END: User created =====================');
        return user;
    }

    async updateProfile(
        field: 'jobTitle' | 'firstName' | 'lastName' | 'workPhone' | 'homePhone' | 'mobilePhone',
        userInput: string
    ) {
        const { userId } = this.userInfo;
        await this.userInfo.company.directoryController.updateProfile(userId, { [field]: userInput });
        this.userInfo[field] = userInput;
    }

    async getUserDirectoryEntitlements() {
        const { userId } = this.userInfo;
        const entitlments = await this.userInfo.company.platformController.getUserDirectoryEntitlements(
            userId
        );
        Log.highlight(`=== User '${userId}' currently has the following entitlments [${entitlments}] ===`);
        return entitlments;
    }

    async getUserProfile() {
        const { userId } = this.userInfo;
        const userProfile = await this.userInfo.company.directoryController.getUserProfile(userId);
        return userProfile;
    }

    async assignServiceManagerRole(role: 'MESSAGE_ADMINISTRATOR') {
        const { userId } = this.userInfo;
        const roleName = ServiceManagerRoles[role];
        const { companyId } = this.userInfo.company;
        const applicationName = ApplicationName.ServiceManager;
        await this.userInfo.company.platformController.assignRoleToUser(
            userId,
            roleName,
            companyId,
            applicationName
        );
    }

    async unassignServiceManagerRole(role: 'MESSAGE_ADMINISTRATOR') {
        const { userId } = this.userInfo;
        const roleName = ServiceManagerRoles[role];
        const { companyId } = this.userInfo.company;
        const applicationName = ApplicationName.ServiceManager;
        await this.userInfo.company.platformController.removeRoleFromUser(
            userId,
            roleName,
            companyId,
            applicationName
        );
    }

    async assignDirectoryRole(role: 'SMS_USER_WITH_CALL_FORWARD') {
        const { userId } = this.userInfo;
        const roleName = DirectoryRoles[role];
        const { companyId } = this.userInfo.company;
        const applicationName = ApplicationName.Directory;
        await this.userInfo.company.platformController.assignRoleToUser(
            userId,
            roleName,
            companyId,
            applicationName
        );
    }

    async unassignDirectoryRole(role: 'SMS_USER_WITH_CALL_FORWARD') {
        const { userId } = this.userInfo;
        const roleName = DirectoryRoles[role];
        const { companyId } = this.userInfo.company;
        const applicationName = ApplicationName.Directory;
        await this.userInfo.company.platformController.removeRoleFromUser(
            userId,
            roleName,
            companyId,
            applicationName
        );
    }

    async addEntitlement(
        entitlementName:
            | 'COMPANY'
            | 'PUBLIC'
            | 'FILE_SHARING'
            | 'INSTANT_MESSAGING'
            | 'MANAGE_BUSINESS_CHANNELS'
            | 'MANAGE_COMPANY_CHANNELS'
            | 'MESSAGE_APPLICATION'
    ) {
        const { roleId } = this.userInfo;
        const entitlement = DirectoryEntitlments[entitlementName];
        const currentEntitlements = this.userInfo.entitlements;
        await this.userInfo.company.platformController.addEntitlementToRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.userInfo.entitlements = await this.getUserDirectoryEntitlements();
    }

    async removeEntitlement(
        entitlementName:
            | 'COMPANY'
            | 'PUBLIC'
            | 'FILE_SHARING'
            | 'INSTANT_MESSAGING'
            | 'MANAGE_BUSINESS_CHANNELS'
            | 'MANAGE_COMPANY_CHANNELS'
            | 'MESSAGE_APPLICATION'
    ) {
        const { roleId } = this.userInfo;
        const entitlement = DirectoryEntitlments[entitlementName];
        const currentEntitlements = this.userInfo.entitlements;
        await this.userInfo.company.platformController.removeEntitlementFromRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.userInfo.entitlements = await this.getUserDirectoryEntitlements();
    }

    async addUserToRoster(targetUser: User) {
        const { userId } = this.userInfo;
        const targetGrcpAlias = targetUser.userInfo.grcpAlias;
        await this.userInfo.company.messageController.addUserToRoster(userId, targetGrcpAlias);
    }

    async removeUserFromRoster(targetUser: User) {
        const { userId } = this.userInfo;
        const targetGrcpAlias = targetUser.userInfo.grcpAlias;
        await this.userInfo.company.messageController.removeUserFromRoster(userId, targetGrcpAlias);
    }

    async requestAndAssignTwilioNumber() {
        const { endpoints, companyId } = this.userInfo.company;
        const { GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL, MDS_ENDPOINT } = endpoints;
        const { userId } = this.userInfo;
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();

        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);

        const phoneNumberController = new PhoneNumberController(gskToken, csrfToken, MDS_ENDPOINT);
        const phoneNumber = await phoneNumberController.purchaseNumberForCompany(companyId, 'CA', '604');
        const phoneNumerSettings = {
            disclaimerRequired: false,
            forwardingAllowed: true,
            mmsAllowed: true,
            recordingRequired: false,
            smsAllowed: true,
            voiceAllowed: true,
            location: 'LOCAL',
            voicemailAllowed: true
        };

        await phoneNumberController.setNumberFeatures(companyId, phoneNumber, phoneNumerSettings);
        await phoneNumberController.assignNumberToUser(userId, phoneNumber);

        this.userInfo.phoneNumberController = phoneNumberController;
        this.userInfo.twilioNumber = phoneNumber;
    }

    async unassignAndReleaseTwilioNumber() {
        if (this.userInfo.twilioNumber) {
            const { companyId } = this.userInfo.company;
            const { userId, twilioNumber } = this.userInfo;
            await this.userInfo.phoneNumberController.unassignNumberFromUser(userId, twilioNumber);
            await this.userInfo.phoneNumberController.releaseNumberFromCompany(companyId, twilioNumber);
        } else {
            Log.error('User has no assigned Twilio phone number. No requests were sent', new Error());
        }
    }

    async requestAndAssignWhatsAppNumber() {
        const { endpoints, companyId } = this.userInfo.company;
        const { GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL, MDS_ENDPOINT } = endpoints;
        const { userId } = this.userInfo;
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const accountId = PhoneNumberUtils.randomPhoneNumber();
        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);

        const whatsAppController = new WhatsAppController(gskToken, csrfToken, MDS_ENDPOINT);
        await whatsAppController.addWhatsAppProviderToCompany(companyId, accountId);
        await whatsAppController.setWhatsAppAccountToActive(companyId, accountId);
        await whatsAppController.assignWhatsAppAccountToUser(userId, accountId);

        this.userInfo.whatsAppController = whatsAppController;
        this.userInfo.whatsAppNumber = accountId;
    }

    async unasssignAndReleaseWhatAppNumber() {
        const accountId = this.userInfo.whatsAppNumber;

        if (accountId) {
            const { companyId } = this.userInfo.company;
            const { userId } = this.userInfo;
            await this.userInfo.whatsAppController.unassignWhatsAppAccountFromUser(userId, accountId);
            await this.userInfo.whatsAppController.removeWhatsAppProviderFromCompany(companyId, accountId);
        } else {
            Log.error('User has no assigned WhatsApp phone number. No requests were sent', new Error());
        }
    }
}
