import { getErrorDescription } from '../helpers/error-utils';
import { Log } from '../helpers/log-utils';
import { UserNameStruct, ApplicationInstanceStruct } from './thrift-generated/Platform_types';
import { hashPbkdf2 } from '../helpers/hash-utils';
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
            Log.suscess(
                `SUSCESS: Company '${companyName}' created with domain '${domain}'. CompnayId is '${companyId}'`
            );
            return companyId;
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to create company '${companyName}'`, description);
            throw err;
        }
    }

    async deleteCompany(companyId: number) {
        try {
            Log.info(`...Sending request to delete company '${companyId}'`);
            await this.client.platform.deleteCompany(companyId);
            Log.info(`SUSCESS: Company ${companyId} has been deleted`);
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to delete company '${companyId}'`, description);
            throw err;
        }
    }

    async enableAllServices(companyId: number) {
        try {
            Log.info(`...Sending request to enable all services for company '${companyId}'`);
            const result = await this.client.platform.enableAllServicesForCompany(companyId);
            Log.info(`SUSCESS: All services enabled for company '${companyId}'`);
            return result;
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to enabling all services for company '${companyId}'`, description);
            throw err;
        }
    }

    async enableGrMessage(companyId: number) {
        try {
            Log.info(`...Sending request to enable GR message for company '${companyId}'`);
            const result = await this.client.platform.enableGrMessageForCompany(companyId);
            Log.info(`SUSCESS: GR message enabled for company '${companyId}'`);
            return result;
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to enabling GR message for company '${companyId}'`, description);
            throw err;
        }
    }

    async getCompanyRoles(companyId: number, applicationID: number, formatResults: boolean) {
        try {
            Log.info(
                `...Sending request to get roles assigned to company '${companyId}' for application '${applicationID}'`
            );
            const rolesOfCompany = await this.client.platform.getRolesForCompany(companyId, applicationID);
            Log.info(
                `SUSCESS: Roles from Application ID '${applicationID}' for company '${companyId}' obtained`
            );

            if (formatResults) {
                const formattedRoles = {};
                for (const role of rolesOfCompany) {
                    formattedRoles[role.roleName] = role.roleId;
                }
                return formattedRoles;
            }

            return rolesOfCompany;
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to retrive roles assigned to company '${companyId}'`, description);
            throw err;
        }
    }

    async getCompanyDomains(companyId: number) {
        try {
            Log.info(`...Sending request to get domains belong to company '${companyId}'`);
            const companyDomains = await this.client.platform.getCompanyDomains(companyId);
            Log.info(`SUSCESS: Domains for company '${companyId}' obtained`);
            return companyDomains;
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to retrive domains assigned to company '${companyId}'`, description);
            throw err;
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
            Log.info(`SUSCESS: User '${email}' created for company '${companyId}'`);
            return createdUsers;
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to create user '${email}' for company '${companyId}'`, description);
            throw err;
        }
    }

    async createRole(roleName: string, companyId: number, applicationName: number) {
        try {
            Log.info(`...Sending request to create role with name '${roleName}'`);
            const createdRole = await this.client.platform.createRole(roleName, companyId, applicationName);
            Log.info(`SUSCESS: Role '${roleName}' has been created for company '${companyId}'`);
            return createdRole;
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to create '${roleName}' for company '${companyId}'`, description);
            throw err;
        }
    }

    async setEntitlementsForRole(roleId, entitlements: string[]) {
        try {
            Log.info(`...Sending request to update entitlments of role '${roleId}'`);
            await this.client.platform.setOperationsForRole(roleId, entitlements);
            Log.info(`SUSCESS: Entitlements has been updated '${roleId}'`);
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to set entitlements for ${roleId}`, description);
            throw err;
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
            Log.info(`SUSCESS: '${entitlementToAdd}' has been added to role '${roleId}'`);
            return newEntitlements;
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to add '${entitlementToAdd}' for ${roleId}`, description);
            throw err;
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
            Log.info(`SUSCESS: '${entitlementToRemove}' has been removed from role '${roleId}'`);
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to remove '${entitlementToRemove}' for ${roleId}`, description);
            throw err;
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
            Log.info(`SUSCESS: Role '${roleName}' assigned to user '${userId}'`);
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to assign '${roleName}' to user '${userId}'`, description);
            throw err;
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
            Log.info(`SUSCESS: Role '${roleName}' removed from user '${userId}'`);
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to remove role '${roleName}' from user '${userId}'`, description);
            throw err;
        }
    }

    async getUserDirectoryEntitlements(userId: number) {
        try {
            Log.info(`...Sending request to get entilements belongs to user : ${userId}`);
            const userEntitlments = await this.client.platform.getOperationsForUserByApplicationName(
                userId,
                3
            );
            Log.info(`SUSCESS: Entitlements for user '${userId}' obtained`);
            return userEntitlments;
        } catch (err) {
            const description = getErrorDescription(err);
            Log.error(`FAILURE: Unable to get entitlements for user '${userId}'`, description);
            throw err;
        }
    }
}
