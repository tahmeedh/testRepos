import { test } from '@playwright/test';
import {
    MockInboundMessageController,
    MockInboundMessageType
} from 'Apis/mock-inbound-message/mock-inbound-message-controller';
import { StringUtils } from 'helper/string-utils';

test('C333', async () => {
    const mockTwilioMessage: MockInboundMessageType = {
        senderPhoneNumber: StringUtils.generatePhoneNumber(),
        receipientGrId: 785551,
        message: 'hello test message',
        type: 'TWILIO',
        attachmentId: '5263eb4a-bbdd-4172-9bf2-c8de58770ff2'
    };
    await MockInboundMessageController.sendInboundMessage(mockTwilioMessage);
});
