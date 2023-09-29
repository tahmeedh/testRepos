import { getErrorDescription } from '../helpers/error-utils';
import { consoleColor } from '../helpers/console-utils';
import { SMClient } from '../client';
import {
    DirectorySettingsStruct,
    UserProfileAttributeValueStruct,
    UserProfileUserSetAttributesStruct
} from './thrift-generated/Directory_types';

export class DirectoryController {
    client: SMClient;
    directoryTypes;
    constructor(smClient: SMClient) {
        this.client = smClient;
    }

    async updateDirectorySettings(companyId: number, directorySettings: DirectorySettingsStruct) {
        try {
            const directorySettingWithId = structuredClone(directorySettings);
            directorySettingWithId.companyId = companyId;
            console.info(`...Sending request to update directory settings for company '${companyId}'`);
            const result = await this.client.directory.updateDirectorySettings(directorySettingWithId);
            console.info(
                consoleColor.FgGreen,
                `SUSCESS: Profile Policy is updated for company '${companyId}'`
            );
            return result;
        } catch (err) {
            const description = getErrorDescription(err);
            console.error(
                consoleColor.FgRed,
                `FAILURE: Unable to update Profile Policy for company '${companyId}'`,
                description
            );
            throw err;
        }
    }

    async updateProfile(userId: number, profileInput: any) {
        try {
            const keys = Object.keys(profileInput);

            const profileObj = {};
            // Construct update profile object
            Object.keys(profileInput).forEach((attr) => {
                profileObj[attr] = new UserProfileAttributeValueStruct({ profileValue: profileInput[attr] });
            });

            console.info(`...Sending request to update user profile '${keys}' for user '${userId}'`);
            const profileStruct = new UserProfileUserSetAttributesStruct(profileObj);
            const result = await this.client.directory.updateUserProfile(userId, profileStruct);
            console.info(consoleColor.FgGreen, `SUSCESS: Profile '${keys}' is updated for user '${userId}'`);
            return result;
        } catch (err) {
            const description = getErrorDescription(err);
            console.error(
                consoleColor.FgRed,
                `FAILURE: Unable to update user profile for user '${userId}'`,
                description
            );
            throw err;
        }
    }

    async createDirectoryRoleForUser(userIds: number[], operations: string[], roleName: string) {
        try {
            console.info(`...Sending request to create role '${roleName}' in directory`);
            const result = await this.client.directory.setUserDirectoryOperations(
                userIds,
                operations,
                roleName
            );
            console.info(
                consoleColor.FgGreen,
                `SUSCESS: Role '${roleName}' has been created and assigned to user`
            );
            return result;
        } catch (err) {
            const description = getErrorDescription(err);
            console.error(consoleColor.FgRed, `FAILURE: Role ${roleName} NOT created`, description);
            throw err;
        }
    }

    async getUserProfile(userId: number) {
        try {
            console.info(`...Sending request to get profile of user '${userId}'`);
            const result = await this.client.directory.getUserProfile(userId, userId);
            console.info(consoleColor.FgGreen, `SUSCESS: User profile of '${userId}' has been obtained`);
            return result;
        } catch (err) {
            const description = getErrorDescription(err);
            console.error(
                consoleColor.FgRed,
                `FAILURE: Unable to obtain user profile of user '${userId}'`,
                description
            );
            throw err;
        }
    }
}
