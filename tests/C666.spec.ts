import { test } from '@playwright/test';
import { PhoneNumberUtils } from 'Apis/api-helpers/phoneNumber-utils';
import { TwilioWireMockController } from 'Apis/twilio-wiremock/twilio-wiremock-controller';

test('C666', async () => {
    const fromPhoneNumber = `+1${PhoneNumberUtils.randomPhone()}`;
    const toPhoneNumber = '+17786811012';
    await TwilioWireMockController.sendText(664543, 'testing message', fromPhoneNumber, toPhoneNumber);
});
