import { test } from '@playwright/test';
import { MockWhatsAppController } from 'Apis/whatsapp-mock/whatsapp-mock-controller';
import { StringUtils } from 'helper/string-utils';

test('C222', async () => {
    const mockWhatsAppMessage = {
        senderPhoneNumber: StringUtils.generatePhoneNumber(),
        receipientGrId: 785549,
        message: 'hello test message'
    };
    await MockWhatsAppController.sendInboundWhatsApp(mockWhatsAppMessage);
});
