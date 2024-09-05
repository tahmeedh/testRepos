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
     * Update group text subject via grcp call.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param conversationId Id of the Group text.
     * @param subject Subject name of the Group text
     */
    static async updateGroupTextSubject(page: Page, conversationId: string, subject: string) {
        const data = {
            conversationId,
            clientRequestId: randomUUID(),
            msgType: 'external.ServerUpdateExternalConversationHeadersMsg',
            updates: [
                {
                    name: 'name',
                    newValue: subject
                }
            ]
        };
        await GrcpBaseController.sendRequest(page, data);
    }

    /**
     * Send content to a conversation.
     * @param page Page object that contains the message-iframe for use to make the grcp call.
     * @param conversationId Id of the Conversation.
     * @param content Content to send.
     */
    static async sendContent(page: Page, conversationId: string, content: string) {
        const data = {
            conversationId,
            clientRequestId: randomUUID(),
            msgType: 'conversation.ServerSendContentMsg',
            content
        };
        await GrcpBaseController.sendRequest(page, data);
    }

    static async sendContentToChannel(page: Page, channelId: string, content: string) {
        const data = {
            channelId,
            clientRequestId: randomUUID(),
            msgType: 'channel.ServerSendChannelTextMsg',
            text: content
        };
        await GrcpBaseController.sendRequest(page, data);
    }
}
