import { test } from '@playwright/test';
import {
    MockInboundMessageController,
    MockInboundMessageBandWidthType
} from 'Apis/mock-inbound-message/mock-inbound-message-controller';
import { StringUtils } from 'helper/string-utils';

test('C111', async () => {
    const mockGroupTextMessage: MockInboundMessageBandWidthType = {
        senderPhoneNumber: StringUtils.generatePhoneNumber(),
        receipientGrId: 785549,
        message: 'hello test message',
        type: 'BANDWIDTH',
        attachmentId: 'a46f930c-97ef-4553-b721-75619f287c3e?',
        additionalParticipants: ['+16046352142']
    };
    await MockInboundMessageController.sendInboundMessage(mockGroupTextMessage);
});
