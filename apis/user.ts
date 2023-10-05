import { Int64 } from 'node-int64';
import { Log } from './api-helpers/log-utils';
import { ApplicationName } from './sm/platform/thrift-generated/Platform_types';
import { ServiceManagerRoles, DirectoryEntitlments, DirectoryRoles } from './sm/constants/constants';
import type { CompanyType } from './company';
import { GskController } from './gas/gsk-controller';
import { MdsController } from './mds/mds-controller';
import { CsrfController } from './mds/csrf-controller';

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
    entitlements: string[];
    roleName: string;
    roleId: Int64;
    company: CompanyType;
    mdsController?: MdsController;
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
export class User {
    user: UserType;
    constructor(user: UserType) {
        this.user = user;
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
        const { userId } = this.user;
        await this.user.company.directoryController.updateProfile(userId, { [field]: userInput });
        this.user[field] = userInput;
    }

    async getUserDirectoryEntitlements() {
        const { userId } = this.user;
        const entitlments = await this.user.company.platformController.getUserDirectoryEntitlements(userId);
        Log.highlight(`=== User '${userId}' currently has the following entitlments [${entitlments}] ===`);
        return entitlments;
    }

    async getUserProfile() {
        const { userId } = this.user;
        const userProfile = await this.user.company.directoryController.getUserProfile(userId);
        return userProfile;
    }

    async assignServiceManagerRole(role: 'MESSAGE_ADMINISTRATOR') {
        const { userId } = this.user;
        const roleName = ServiceManagerRoles[role];
        const { companyId } = this.user.company;
        const applicationName = ApplicationName.ServiceManager;
        await this.user.company.platformController.assignRoleToUser(
            userId,
            roleName,
            companyId,
            applicationName
        );
    }

    async unassignServiceManagerRole(role: 'MESSAGE_ADMINISTRATOR') {
        const { userId } = this.user;
        const roleName = ServiceManagerRoles[role];
        const { companyId } = this.user.company;
        const applicationName = ApplicationName.ServiceManager;
        await this.user.company.platformController.removeRoleFromUser(
            userId,
            roleName,
            companyId,
            applicationName
        );
    }

    async assignDirectoryRole(role: 'SMS_USER_WITH_CALL_FORWARD') {
        const { userId } = this.user;
        const roleName = DirectoryRoles[role];
        const { companyId } = this.user.company;
        const applicationName = ApplicationName.Directory;
        await this.user.company.platformController.assignRoleToUser(
            userId,
            roleName,
            companyId,
            applicationName
        );
    }

    async unassignDirectoryRole(role: 'SMS_USER_WITH_CALL_FORWARD') {
        const { userId } = this.user;
        const roleName = DirectoryRoles[role];
        const { companyId } = this.user.company;
        const applicationName = ApplicationName.Directory;
        await this.user.company.platformController.removeRoleFromUser(
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
        const { roleId } = this.user;
        const entitlement = DirectoryEntitlments[entitlementName];
        const currentEntitlements = this.user.entitlements;
        await this.user.company.platformController.addEntitlementToRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.user.entitlements = await this.getUserDirectoryEntitlements();
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
        const { roleId } = this.user;
        const entitlement = DirectoryEntitlments[entitlementName];
        const currentEntitlements = this.user.entitlements;
        await this.user.company.platformController.removeEntitlementFromRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.user.entitlements = await this.getUserDirectoryEntitlements();
    }

    async addUserToRoster(targetUser: User) {
        const { userId } = this.user;
        const targetGrcpAlias = targetUser.user.grcpAlias;
        await this.user.company.messageController.addUserToRoster(userId, targetGrcpAlias);
    }

    async removeUserFromRoster(targetUser: User) {
        const { userId } = this.user;
        const targetGrcpAlias = targetUser.user.grcpAlias;
        await this.user.company.messageController.removeUserFromRoster(userId, targetGrcpAlias);
    }

    async requestAndAssignTwilioNumber() {
        await this.assignServiceManagerRole('MESSAGE_ADMINISTRATOR');
        await this.assignDirectoryRole('SMS_USER_WITH_CALL_FORWARD');

        const { env, companyId } = this.user.company;
        const { email, password, userId } = this.user;

        const gskToken = await GskController.getGskToken(email, password, env);
        const csrfToken = await CsrfController.getCsrfToken(gskToken, env);

        const mdsController = new MdsController(gskToken, csrfToken, env);
        this.user.mdsController = mdsController;

        const twilioPhoneNumber = await mdsController.requestTwilioNumber(companyId, 'CA', '604');
        this.user.twilioNumber = twilioPhoneNumber;

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
        await mdsController.setTwilioNumberFeatures(companyId, twilioPhoneNumber, phoneNumerSettings);
        await mdsController.assignTwilioNumber(userId, twilioPhoneNumber);
        this.user.twilioNumber = twilioPhoneNumber;
    }

    async assignTwilioNumber() {
        await this.user.mdsController.unassignTwilioNumber(this.user.userId, this.user.twilioNumber);
    }

    async unassignTwilioNumber() {
        await this.user.mdsController.unassignTwilioNumber(this.user.userId, this.user.twilioNumber);
    }

    async releaseTwilioNumber() {
        await this.user.mdsController.releaseTwilioNumber(
            this.user.company.companyId,
            this.user.twilioNumber
        );
    }

    async unassignAndReleaseTwilioNumber() {
        await this.unassignTwilioNumber();
        await this.releaseTwilioNumber();
    }

    async releaseAllNumbers() {
        await this.user.mdsController.releaseAllNumbers(this.user.company.companyId);
    }
}
