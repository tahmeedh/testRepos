import { test } from '@playwright/test';
import {
    MockInboundMessageController,
    MockInboundMessageType
} from 'Apis/mock-inbound-message/mock-inbound-message-controller';
import { StringUtils } from 'helper/string-utils';

test('C222', async () => {
    const mockWhatsAppMessage: MockInboundMessageType = {
        senderPhoneNumber: StringUtils.generatePhoneNumber(),
        receipientGrId: 785549,
        message: 'hello test message',
        type: 'WHATSAPP',
        attachmentId: 'a46f930c-97ef-4553-b721-75619f287c3e?'
    };
    await MockInboundMessageController.sendInboundMessage(mockWhatsAppMessage);
});
