/* eslint-disable no-console */

import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
import { SmsGatewayClient } from 'Apis/sms-gateway/sms-gateway-client';
import { SmsGatewayController } from 'Apis/sms-gateway/sms-gateway-controller';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { UidUtils } from 'Apis/api-helpers/uid-Utils';
import { TwilioSignatureUtil } from './helpers/twilio-signature-utils';
import { TwilioMockFileDetails } from './twilio-wiremock-files';

export class TwilioWireMockController {
    static async getAccountSid(companyId: number) {
        const { CASSANDRA_CONTACT_POINTS, CASSANDRA_KEYSPACE, CASSANDRA_LOCAL_DATACENTER } =
            EnvUtils.getEndPoints();
        const smsGateWayClient = new SmsGatewayClient();
        const client = await smsGateWayClient._connect(
            CASSANDRA_CONTACT_POINTS,
            CASSANDRA_KEYSPACE,
            CASSANDRA_LOCAL_DATACENTER
        );
        const smsGatewayController = new SmsGatewayController(client);
        const acccountSid = await smsGatewayController.getAccountSid(companyId);
        await smsGateWayClient._disconnect();
        return acccountSid;
    }

    static async sendTwilioSMS(
        companyId: number,
        message: string,
        fromPhoneNumber: string,
        toPhoneNumber: string,
        file?: TwilioMockFileDetails
    ) {
        const { SMS_GATEWAY, SMS_GATEWAY_WIREMOCK } = EnvUtils.getEndPoints();
        const accountSid = await TwilioWireMockController.getAccountSid(companyId);
        const messageSid = UidUtils.generateStringbyBytes(16);
        const SMS_GATEWAY_TWILIO_AUTH_TOKEN = '_MOCK_AUTH_TOKEN_VALUE_32_CHARS_';
        const body = {
            AccountSid: accountSid,
            Body: message,
            MessageSid: messageSid,
            From: fromPhoneNumber,
            To: toPhoneNumber,
            NumMedia: file ? 1 : 0,
            MediaContentType0: file ? file.mime : null,
            MediaUrl0: file ? `${SMS_GATEWAY_WIREMOCK}${file.path}` : null
        };

        const twilioHeaderSignature = TwilioSignatureUtil.generateTwilioSignature(
            `${SMS_GATEWAY}/sms`,
            body,
            SMS_GATEWAY_TWILIO_AUTH_TOKEN
        );
        const config = {
            method: 'POST',
            url: `${SMS_GATEWAY}/sms`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Twilio-Signature': twilioHeaderSignature
            },
            data: body
        };

        await AxiosUtils.axiosRequest(
            config,
            `request to SMS Gateway to send mock twilio message '${message}' from '${fromPhoneNumber}' to '${toPhoneNumber}'`,
            1
        );
    }
}
