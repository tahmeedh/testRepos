import { SMClient } from '../client';
import { Log } from '../../api-helpers/log-utils';
import {
    PresenceSharingLevel,
    RosterEntryStruct,
    RosterEntryDeltaStruct,
    RosterEntryOperation
} from './thrift-generated/Message_types';

export class MessageController {
    client: SMClient;
    constructor(smClient: SMClient) {
        this.client = smClient;
    }

    async _modifyRoster(userId: number, targetGrcpAlias: string, entryOperation: RosterEntryOperation) {
        try {
            const presenceShare = PresenceSharingLevel.FULL;
            const entryStruct = new RosterEntryStruct({
                grcpOrSipId: targetGrcpAlias,
                presenceSharing: presenceShare
            });
            const deltaStruct = new RosterEntryDeltaStruct({
                rosterEntry: entryStruct,
                operation: entryOperation
            });
            Log.info(`Sending request to modify roster for user '${userId}'`);
            await this.client.message.updateRoster(userId, [deltaStruct]);
            Log.success(`Roster has been modified for user '${userId}'`);
        } catch (error) {
            Log.error(`FAILURE: Unable to modify roster of '${userId}'`, error.description);
            throw error;
        }
    }

    async addUserToRoster(userId: number, targetGrcpAlias: string) {
        try {
            const entryOperation = RosterEntryOperation.ADD;
            Log.info(`...Sending request to add '${targetGrcpAlias}' to the roster of '${userId}'`);
            await this._modifyRoster(userId, targetGrcpAlias, entryOperation);
            Log.success(`User '${targetGrcpAlias}' has been added to the roster of '${userId}'`);
        } catch (error) {
            Log.error(
                `FAILURE: Unable to add ${targetGrcpAlias} to roster of '${userId}'`,
                error.description
            );
            throw error;
        }
    }

    async removeUserFromRoster(userId: number, targetGrcpAlias: string) {
        try {
            const entryOperation = RosterEntryOperation.DELETE;
            Log.info(`...Sending request to add '${targetGrcpAlias}' to the roster of '${userId}'`);
            await this._modifyRoster(userId, targetGrcpAlias, entryOperation);
            Log.success(`User '${targetGrcpAlias}' has been added to the roster of '${userId}'`);
        } catch (error) {
            Log.error(
                `FAILURE: Unable to remove ${targetGrcpAlias} to roster of '${userId}'`,
                error.description
            );
            throw error;
        }
    }
}
