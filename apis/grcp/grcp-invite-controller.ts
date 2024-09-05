import { Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { GrcpBaseController } from './grcp-base-controller';

export class GrcpInviteController {
    /**
     * Accept an invite to a MUC conversation
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param conversationId Conversation id of the MUC.
     */
    static async acceptMUCInvite(page: Page, conversationId: string) {
        const acceptMucData = {
            clientRequestId: randomUUID(),
            conversationId,
            msgType: 'conversation.ServerAcceptConversationMsg'
        };
        await GrcpBaseController.sendRequest(page, acceptMucData);
    }

    /**
     * Accept an invite to a SUC conversation
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param conversationId Conversation id of the SUC.
     */
    static async acceptSUCInvite(page: Page, conversationId: string) {
        const acceptSucData = {
            clientRequestId: randomUUID(),
            conversationId,
            msgType: 'conversation.ServerAcceptConversationMsg'
        };
        await GrcpBaseController.sendRequest(page, acceptSucData);
    }

    /**
     * Accept an invite to a Channel conversation
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param channelId Channel id of the Channel.
     */
    static async acceptChannelInvite(page: Page, channelId: string) {
        const acceptSucData = {
            clientRequestId: randomUUID(),
            channelId,
            msgType: 'channel.ServerJoinChannelMsg'
        };
        await GrcpBaseController.sendRequest(page, acceptSucData);
    }
}
