import { Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { GrcpBaseController } from './grcp-base-controller';

export class GrcpParticipantsController {
    /**
     * Add users to channel via grcp call.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param channelId Id of the channel.
     * @param grcpAlias Grcp Alias of the user we want to remove from a channel
     */
    static async addUserToChannelModeratorList(page: Page, channelId: string, grcpAlias: string) {
        const data = {
            channelId,
            clientRequestId: randomUUID(),
            msgType: 'channel.ServerGrantChannelRolesMsg',
            roles: {
                admin: [grcpAlias]
            }
        };
        await GrcpBaseController.sendRequest(page, data);
    }

    /**
     * Add users to channel via grcp call.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param channelId Id of the channel.
     * @param grcpAlias Grcp Alias of the user we want to remove from a channel
     */
    static async inviteParticipantToChannel(page: Page, channelId: string, grcpAlias: string) {
        const data = {
            channelId,
            clientRequestId: randomUUID(),
            msgType: 'channel.ServerInviteToChannelMsg',
            invitees: [grcpAlias]
        };
        await GrcpBaseController.sendRequest(page, data);
    }

    /**
     * Add users to channel via grcp call.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param channelId Id of the channel.
     * @param grcpAlias Grcp Alias of the user we want to remove from a channel
     */
    static async addUserToChannelParticipantList(page: Page, channelId: string, grcpAlias: string) {
        const data = {
            channelId,
            clientRequestId: randomUUID(),
            msgType: 'channel.ServerGrantChannelRolesMsg',
            roles: {
                member: [grcpAlias]
            }
        };
        await GrcpBaseController.sendRequest(page, data);
    }

    /**
     * Remove users from channel via grcp call.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param channelId Id of the channel.
     * @param grcpAlias Grcp Alias of the user we want to remove from a channel
     */
    static async removeUserFromChannel(page: Page, channelId: string, grcpAlias: string) {
        const data = {
            channelId,
            clientRequestId: randomUUID(),
            msgType: 'channel.ServerGrantChannelRolesMsg',
            roles: {
                none: [grcpAlias]
            }
        };
        await GrcpBaseController.sendRequest(page, data);
    }
}
