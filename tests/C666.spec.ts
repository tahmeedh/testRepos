import { test } from '@playwright/test';
import { TwilioWireMockController } from 'Apis/twilio-wiremock/twilio-wiremock-controller';
import { StringUtils } from 'helper/string-utils';
import { TWILIO_WIREMOCK_FILE } from 'Apis/twilio-wiremock/twilio-wiremock-files';

test('C666', async () => {
    const fromPhoneNumber = `+${StringUtils.generatePhoneNumber()}`;
    const toPhoneNumber = '+17786811012';
    await TwilioWireMockController.sendTwilioSMS(664543, '1234', fromPhoneNumber, toPhoneNumber);
    await TwilioWireMockController.sendTwilioSMS(
        664543,
        '1234',
        fromPhoneNumber,
        toPhoneNumber,
        TWILIO_WIREMOCK_FILE.JPEG
    );
});
