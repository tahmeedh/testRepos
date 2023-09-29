import { Int64 } from 'node-int64';
import { consoleColor } from './sm/helpers/console-utils';
import { ApplicationName } from './sm/platform/thrift-generated/Platform_types';
import { ServiceManagerRoles, DirectoryEntitlments, DirectoryRoles } from './sm/constants/constants';
import type { CompanyType } from './company';

export interface UserType {
    firstName: string;
    lastName: string;
    password: string;
    userId: Int64;
    grcpAlias: string;
    email: string;
    jobTitle: string;
    mobilePhone: string;
    workPhone: string;
    homePhone: string;
    entitlements: string[];
    roleName: string;
    roleId: Int64;
    company: CompanyType;
}
export class User {
    firstName: string;
    lastName: string;
    password: string;
    userId: Int64;
    grcpAlias: string;
    email: string;
    jobTitle: string;
    mobilePhone: string;
    workPhone: string;
    homePhone: string;
    entitlements: string[];
    roleName: string;
    roleId: Int64;
    company: CompanyType;

    constructor(user: UserType) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.password = user.password;
        this.jobTitle = user.jobTitle;
        this.mobilePhone = user.mobilePhone;
        this.workPhone = user.workPhone;
        this.homePhone = user.homePhone;
        this.entitlements = user.entitlements;
        this.userId = null;
        this.grcpAlias = null;
        this.email = null;
        this.roleName = this.lastName;
        this.roleId = null;
        this.company = user.company;
    }

    async createUser() {
        console.info('===================== START: Creating user =====================');
        if (!this.userId) {
            const result = await this.company.platformController.createUser(
                this.company.companyId,
                this.password,
                this.firstName,
                this.lastName,
                this.company.companyDomain
            );
            this.userId = result.userId;
            this.grcpAlias = result.grcpAlias;
            this.email = result.userName.email;

            const profile = {
                jobTitle: this.jobTitle,
                mobilePhone: this.mobilePhone,
                workPhone: this.workPhone,
                homePhone: this.homePhone
            };

            await Promise.all([
                await this.company.directoryController.updateProfile(this.userId, profile),
                await this.company.directoryController.createDirectoryRoleForUser(
                    [this.userId],
                    this.entitlements,
                    this.roleName
                )
            ]);

            const allDirectoryRoles = await this.company.platformController.getCompanyRoles(
                this.company.companyId,
                ApplicationName.Directory,
                true
            );
            const roleId = allDirectoryRoles[this.roleName];
            this.roleId = roleId;

            console.info(
                consoleColor.BgGray,
                `=== Username: ${this.email} | Password: ${this.password} | UserId: ${this.userId} | grcpAlias: ${this.grcpAlias}===`
            );
            console.info('===================== END: User created =====================');
            return result;
        }
        throw new Error(
            `User with${this.userId} already exist. Use createUser() in Company class to create additional users.`
        );
    }

    async updateJobTitle(userInput: string) {
        const field = 'jobTitle';
        const { userId } = this;
        await this.company.directoryController.updateProfile(userId, { [field]: userInput });
        this[field] = userInput;
    }

    async updateFirstName(userInput: string) {
        const field = 'firstName';
        const { userId } = this;
        await this.company.directoryController.updateProfile(userId, { [field]: userInput });
        this[field] = userInput;
    }

    async updateLastName(userInput: string) {
        const field = 'lastName';
        const { userId } = this;
        await this.company.directoryController.updateProfile(userId, { [field]: userInput });
        this[field] = userInput;
    }

    async updateWorkPhone(userInput: string) {
        const field = 'workPhone';
        const { userId } = this;
        await this.company.directoryController.updateProfile(userId, { [field]: userInput });
        this[field] = userInput;
    }

    async updateHomePhone(userInput: string) {
        const field = 'homePhone';
        const { userId } = this;
        await this.company.directoryController.updateProfile(userId, { [field]: userInput });
        this[field] = userInput;
    }

    async updateMobilePhone(userInput: string) {
        const field = 'mobilePhone';
        const { userId } = this;
        await this.company.directoryController.updateProfile(userId, { [field]: userInput });
        this[field] = userInput;
    }

    async getUserDirectoryEntitlements() {
        const entitlments = await this.company.platformController.getUserDirectoryEntitlements(this.userId);
        console.info(
            consoleColor.BgBlack,
            `=== User '${this.userId}' currently has the following entitlments [${entitlments}] ===`
        );
        return entitlments;
    }

    async getUserProfile() {
        const { userId } = this;
        const userProfile = await this.company.directoryController.getUserProfile(userId);
        return userProfile;
    }

    async assignMessageAdminRole() {
        const { userId } = this;
        const roleName = ServiceManagerRoles.MESSAGE_ADMINISTRATOR;
        const { companyId } = this.company;
        const applicationName = ApplicationName.ServiceManager;
        await this.company.platformController.assignRoleToUser(userId, roleName, companyId, applicationName);
    }

    async unassignMessageAdminRole() {
        const { userId } = this;
        const roleName = ServiceManagerRoles.MESSAGE_ADMINISTRATOR;
        const { companyId } = this.company;
        const applicationName = ApplicationName.ServiceManager;
        await this.company.platformController.removeRoleFromUser(
            userId,
            roleName,
            companyId,
            applicationName
        );
    }

    async assignSMSUserWithCallForwardRole() {
        const { userId } = this;
        const roleName = DirectoryRoles.SMS_USER_WITH_CALL_FORWARD;
        const { companyId } = this.company;
        const applicationName = ApplicationName.Directory;
        await this.company.platformController.assignRoleToUser(userId, roleName, companyId, applicationName);
    }

    async unassignSMSUserWithCallForwardRole() {
        const { userId } = this;
        const roleName = DirectoryRoles.SMS_USER_WITH_CALL_FORWARD;
        const { companyId } = this.company;
        const applicationName = ApplicationName.Directory;
        await this.company.platformController.removeRoleFromUser(
            userId,
            roleName,
            companyId,
            applicationName
        );
    }

    async addCompanyEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.COMPANY;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.addEntitlementToRole(roleId, entitlement, currentEntitlements);
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async addPublicEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.PUBLIC;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.addEntitlementToRole(roleId, entitlement, currentEntitlements);
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async addFileSharingEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.FILE_SHARING;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.addEntitlementToRole(roleId, entitlement, currentEntitlements);
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async addInstantMessageEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.INSTANT_MESSAGING;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.addEntitlementToRole(roleId, entitlement, currentEntitlements);
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async addManageBusinessChannelsEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.MANAGE_BUSINESS_CHANNELS;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.addEntitlementToRole(roleId, entitlement, currentEntitlements);
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async addManageCompanyChannelsEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.MANAGE_COMPANY_CHANNELS;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.addEntitlementToRole(roleId, entitlement, currentEntitlements);
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async addMessageApplicationEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.MESSAGE_APPLICATION;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.addEntitlementToRole(roleId, entitlement, currentEntitlements);
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async removeCompanyEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.COMPANY;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.removeEntitlementFromRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async removePublicEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.PUBLIC;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.removeEntitlementFromRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async removeFileSharingEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.FILE_SHARING;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.removeEntitlementFromRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async removeInstantMessageEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.INSTANT_MESSAGING;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.removeEntitlementFromRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async removeManageBusinessChannelsEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.MANAGE_BUSINESS_CHANNELS;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.removeEntitlementFromRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async removeManageCompanyChannelsEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.MANAGE_COMPANY_CHANNELS;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.removeEntitlementFromRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async removeMessageApplicationEntitlement() {
        const { roleId } = this;
        const entitlement = DirectoryEntitlments.MESSAGE_APPLICATION;
        const currentEntitlements = this.entitlements;
        await this.company.platformController.removeEntitlementFromRole(
            roleId,
            entitlement,
            currentEntitlements
        );
        this.entitlements = await this.getUserDirectoryEntitlements();
    }

    async addUserToRoster(targetUser: User) {
        const { userId } = this;
        const targetGrcpAlias = targetUser.grcpAlias;
        await this.company.messageController.addUserToRoster(userId, targetGrcpAlias);
    }

    async removeUserFromRoster(targetUser: User) {
        const { userId } = this;
        const targetGrcpAlias = targetUser.grcpAlias;
        await this.company.messageController.removeUserFromRoster(userId, targetGrcpAlias);
    }
}
