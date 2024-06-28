import { Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { GrcpBaseController } from './grcp-base-controller';

export class GrcpController {
    /**
     * Unmute the given conversationId via grcp call.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param conversationId Id of the conversation to mute.
     */
    static async unmuteConversation(page: Page, conversationId: string) {
        const data = {
            conversationId,
            clientRequestId: randomUUID(),
            msgType: 'conversation.ServerUnmuteConversationMsg'
        };
        await GrcpBaseController.sendRequest(page, data);
    }

    /**
     * Mute the given conversationId via grcp call.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param conversationId Id of the conversation to mute.
     */
    static async muteConversation(page: Page, conversationId: string) {
        const data = {
            conversationId,
            clientRequestId: randomUUID(),
            msgType: 'conversation.ServerMuteConversationMsg'
        };
        await GrcpBaseController.sendRequest(page, data);
    }

    /**
     * Create a new one-to-one conversation between a pair of users via grcp calls.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param sendingUser grcpAlias of the user starting the conversation.
     * @param receivingUser grcpAlias of the user
     * @param content Text content to start the conversation.
     */
    static async createInternalConversation(
        page: Page,
        sendingUser: string,
        receivingUser: string,
        content: string
    ) {
        const guid = randomUUID();

        //Establish default conversation between the pair of users.
        const resolveDefaultConvoData = {
            clientRequestId: guid,
            otherParty: `${receivingUser}`,
            msgType: 'conversation.ServerResolveDefaultConversationMsg'
        };
        await GrcpBaseController.sendRequest(page, resolveDefaultConvoData);

        // Sending a new content message to the receiving user.
        const sendContentData = {
            clientRequestId: guid,
            conversationId: `d:${sendingUser}:${receivingUser}:`,
            content: `${content}`,
            msgType: 'conversation.ServerSendContentMsg'
        };
        await GrcpBaseController.sendRequest(page, sendContentData);
    }
}
