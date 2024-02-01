import { test } from '@playwright/test';
import { TwilioWireMockController } from 'Apis/twilio-wiremock/twilio-wiremock-controller';
import { StringUtils } from 'helper/string-utils';
import { TWILIO_WIREMOCK_FILE } from 'Apis/twilio-wiremock/twilio-wiremock-files';

test('C333', async () => {
    const companyId = 664543; // 664543 for vega, 665764 for Capella
    const mockSMSMessage = 'test message'; // mock message to receive
    const fromPhoneNumber = `+${StringUtils.generatePhoneNumber()}`; // sender's phone number, any valid number would work
    const toPhoneNumber = '+17786811012'; // receiver's phone number
    const file = TWILIO_WIREMOCK_FILE.JPEG; // see twilio-wiremock-files.ts for avaliable files. Dummy file cannot be previewed and opened.
    await TwilioWireMockController.sendTwilioSMS(companyId, mockSMSMessage, fromPhoneNumber, toPhoneNumber);
    await TwilioWireMockController.sendTwilioSMS(
        companyId,
        mockSMSMessage,
        fromPhoneNumber,
        toPhoneNumber,
        file
    );
});
