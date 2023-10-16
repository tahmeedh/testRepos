import { Log } from '../../api-helpers/log-utils';
import { UserNameStruct, ApplicationInstanceStruct } from './thrift-generated/Platform_types';
import { hashPbkdf2 } from '../sm-helpers/hash-utils';
import { SMClient } from '../client';

export class PlatformController {
    client: SMClient;
    constructor(smClient: SMClient) {
        this.client = smClient;
    }

    async createCompanyWithDomain(companyName: string, domain: string) {
        try {
            Log.info(`...Sending request to create company '${companyName}' with domain '${domain}'`);
            const companyId = await this.client.platform.createCompanyWithDomain(companyName, domain);
            Log.success(
                `SUCCESS: Company '${companyName}' created with domain '${domain}'. CompnayId is '${companyId}'`
            );
            return companyId;
        } catch (error) {
            Log.error(`FAILURE: Unable to create company '${companyName}'`, error.description);
            throw error;
        }
    }

    async deleteCompany(companyId: number) {
        try {
            Log.info(`...Sending request to delete company '${companyId}'`);
            await this.client.platform.deleteCompany(companyId);
            Log.success(`SUCCESS: Company ${companyId} has been deleted`);
        } catch (error) {
            Log.error(`FAILURE: Unable to delete company '${companyId}'`, error.description);
            throw error;
        }
    }

    async enableAllServices(companyId: number) {
        try {
            Log.info(`...Sending request to enable all services for company '${companyId}'`);
            const result = await this.client.platform.enableAllServicesForCompany(companyId);
            Log.success(`SUCCESS: All services enabled for company '${companyId}'`);
            return result;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to enabling all services for company '${companyId}'`,
                error.description
            );
            throw error;
        }
    }

    async enableGrMessage(companyId: number) {
        try {
            Log.info(`...Sending request to enable GR message for company '${companyId}'`);
            const result = await this.client.platform.enableGrMessageForCompany(companyId);
            Log.success(`SUCCESS: GR message enabled for company '${companyId}'`);
            return result;
        } catch (error) {
            Log.error(`FAILURE: Unable to enabling GR message for company '${companyId}'`, error.description);
            throw error;
        }
    }

    async getCompanyRoles(companyId: number, applicationID: number, formatResults: boolean) {
        try {
            Log.info(
                `...Sending request to get roles assigned to company '${companyId}' for application '${applicationID}'`
            );
            const rolesOfCompany = await this.client.platform.getRolesForCompany(companyId, applicationID);
            Log.success(
                `SUCCESS: Roles from Application ID '${applicationID}' for company '${companyId}' obtained`
            );

            if (formatResults) {
                const formattedRoles = {};
                for (const role of rolesOfCompany) {
                    formattedRoles[role.roleName] = role.roleId;
                }
                return formattedRoles;
            }

            return rolesOfCompany;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to retrive roles assigned to company '${companyId}'`,
                error.description
            );
            throw error;
        }
    }

    async getCompanyDomains(companyId: number) {
        try {
            Log.info(`...Sending request to get domains belong to company '${companyId}'`);
            const companyDomains = await this.client.platform.getCompanyDomains(companyId);
            Log.success(`SUCCESS: Domains for company '${companyId}' obtained`);
            return companyDomains;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to retrive domains assigned to company '${companyId}'`,
                error.description
            );
            throw error;
        }
    }

    async createUser(
        companyId: number,
        password: string,
        firstName: string,
        lastName: string,
        domain: string
    ) {
        const passwordHash = hashPbkdf2(password);
        const email = `${lastName}@${domain}`;
        const user = new UserNameStruct({
            firstName,
            lastName,
            email,
            customerUserId: email
        });
        try {
            Log.info(`...Sending request to create user in Company '${companyId}'`);
            const createdUsers = await this.client.platform.createUser(companyId, passwordHash, user);
            Log.success(`SUCCESS: User '${email}' created for company '${companyId}'`);
            return createdUsers;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to create user '${email}' for company '${companyId}'`,
                error.description
            );
            throw error;
        }
    }

    async createRole(roleName: string, companyId: number, applicationName: number) {
        try {
            Log.info(`...Sending request to create role with name '${roleName}'`);
            const createdRole = await this.client.platform.createRole(roleName, companyId, applicationName);
            Log.success(`SUCCESS: Role '${roleName}' has been created for company '${companyId}'`);
            return createdRole;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to create '${roleName}' for company '${companyId}'`,
                error.description
            );
            throw error;
        }
    }

    async setEntitlementsForRole(roleId, entitlements: string[]) {
        try {
            Log.info(`...Sending request to update entitlments of role '${roleId}'`);
            await this.client.platform.setOperationsForRole(roleId, entitlements);
            Log.success(`SUCCESS: Entitlements has been updated '${roleId}'`);
        } catch (error) {
            Log.error(`FAILURE: Unable to set entitlements for ${roleId}`, error.description);
            throw error;
        }
    }

    async addEntitlementToRole(roleId, entitlementToAdd: string, currentEntitlements: string[]) {
        try {
            Log.info(`...Sending request to add entitlements to role '${roleId}'`);
            const newEntitlements = [...currentEntitlements];

            if (!newEntitlements.includes(entitlementToAdd)) {
                newEntitlements.push(entitlementToAdd);
            }

            await this.setEntitlementsForRole(roleId, newEntitlements);
            Log.success(`SUCCESS: '${entitlementToAdd}' has been added to role '${roleId}'`);
            return newEntitlements;
        } catch (error) {
            Log.error(`FAILURE: Unable to add '${entitlementToAdd}' for ${roleId}`, error.description);
            throw error;
        }
    }

    async removeEntitlementFromRole(roleId, entitlementToRemove: string, currentEntitlements: string[]) {
        try {
            Log.info(`...Sending request to remove entitlements to role '${roleId}'`);
            const newCurrentEntitlements = [...currentEntitlements];

            const newEntitlements = newCurrentEntitlements.filter(
                (element) => element !== entitlementToRemove
            );

            await this.setEntitlementsForRole(roleId, newEntitlements);
            Log.success(`SUCCESS: '${entitlementToRemove}' has been removed from role '${roleId}'`);
        } catch (error) {
            Log.error(`FAILURE: Unable to remove '${entitlementToRemove}' for ${roleId}`, error.description);
            throw error;
        }
    }

    async assignRoleToUser(userId: number, roleName: string, companyId: number, applicationID: number) {
        try {
            const retrivedRoles = await this.getCompanyRoles(companyId, applicationID, true);
            const roleId = retrivedRoles[roleName];

            const applicationInstance = new ApplicationInstanceStruct({
                applicationName: applicationID,
                companyId
            });
            Log.info(
                `...Sending request to assign role '${roleName} 'to user '${userId}' for application '${applicationID}'`
            );
            await this.client.platform.addRoleToUser(roleId, userId, applicationInstance);
            Log.success(`SUCCESS: Role '${roleName}' assigned to user '${userId}'`);
        } catch (error) {
            Log.error(`FAILURE: Unable to assign '${roleName}' to user '${userId}'`, error.description);
            throw error;
        }
    }

    async removeRoleFromUser(userId: number, roleName: string, companyId: number, applicationID: number) {
        try {
            const retrivedRoles = await this.getCompanyRoles(companyId, applicationID, true);
            const roleId = retrivedRoles[roleName];

            const applicationInstance = new ApplicationInstanceStruct({
                applicationName: applicationID,
                companyId
            });
            Log.info(
                `...Sending request to add role '${roleName}' to user '${userId}' for application ${applicationID}`
            );
            await this.client.platform.removeRoleFromUser(roleId, userId, applicationInstance);
            Log.success(`SUCCESS: Role '${roleName}' removed from user '${userId}'`);
        } catch (error) {
            Log.error(
                `FAILURE: Unable to remove role '${roleName}' from user '${userId}'`,
                error.description
            );
            throw error;
        }
    }

    async getUserDirectoryEntitlements(userId: number) {
        try {
            Log.info(`...Sending request to get entilements belongs to user : ${userId}`);
            const userEntitlments = await this.client.platform.getOperationsForUserByApplicationName(
                userId,
                3
            );
            Log.success(`SUCCESS: Entitlements for user '${userId}' obtained`);
            return userEntitlments;
        } catch (error) {
            Log.error(`FAILURE: Unable to get entitlements for user '${userId}'`, error.description);
            throw error;
        }
    }
}
