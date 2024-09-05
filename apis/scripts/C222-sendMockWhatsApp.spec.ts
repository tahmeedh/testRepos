import { test } from '@playwright/test';
import { PhoneNumberUtils } from 'Apis/api-helpers/phoneNumber-utils';
import {
    MockInboundMessageController,
    MockMsgDataType
} from 'Apis/mock-inbound-message/mock-inbound-message-controller';

test('C222', async () => {
    const GrId = 171642;
    const mockWhatsAppMessage: MockMsgDataType = {
        type: 'WHATSAPP',
        senderPhoneNumber: PhoneNumberUtils.randomPhoneNumber(),
        content: 'hello test message'
    };
    await MockInboundMessageController.receiveInboundExternalMsg(GrId, mockWhatsAppMessage);
});
