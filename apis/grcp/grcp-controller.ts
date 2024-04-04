import { Page } from '@playwright/test';
import { randomUUID } from 'crypto';
import { GrcpBaseController } from './grcp-base-controller';

export class GrcpController {
    static async unmuteConversation(page: Page, conversationId: string) {
        const data = {
            conversationId,
            clientRequestId: randomUUID(),
            msgType: 'conversation.ServerUnmuteConversationMsg'
        };
        GrcpBaseController.getRequest(page, data);
    }
}
