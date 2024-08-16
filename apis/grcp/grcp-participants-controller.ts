import { Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { GrcpBaseController } from './grcp-base-controller';

export class GrcpParticipantsController {
    /**
     * Add user to a restricted/business channel's moderators list via grcp call.
     * Notes: This does NOT send an invite to the user, use 'inviteParticipantToChannel' to send an invite.
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
     * Send a channel invite to a user via grcp call.
     * Notes: For restricted/business channel,
     * use 'addUserToChannelModeratorList/addUserToChannelParticipantList' to add user to the list before sending an invite.
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
     * Add user to a restricted/business channel's participants list via grcp call.
     * Notes: This does NOT send an invite to the user, use 'inviteParticipantToChannel' to send an invite.
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
     * Remove users from a restricted/business channel via grcp call.
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
