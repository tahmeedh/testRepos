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
}
