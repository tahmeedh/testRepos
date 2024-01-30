/* eslint-disable no-console */

// import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
import { randomUUID } from 'crypto';
import { SmsGatewayClient } from 'Apis/sms-gateway/sms-gateway-client';
import { SmsGatewayController } from 'Apis/sms-gateway/sms-gateway-controller';
import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { TwilioSignatureUtil } from './helpers/twilio-signature-utils';

const QS = require('qs');

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

    static async sendText(
        companyId: number,
        message: string,
        fromPhoneNumber: string,
        toPhoneNumber: string
    ) {
        const { SMS_GATEWAY } = EnvUtils.getEndPoints();
        const accountSid = await TwilioWireMockController.getAccountSid(companyId);
        const messageSid = randomUUID();
        // const SMS_GATEWAY_TWILIO_AUTH_TOKEN = '_MOCK_AUTH_TOKEN_VALUE_32_CHARS_';
        const body = {
            AccountSid: accountSid,
            Body: message,
            MessageSid: messageSid,
            From: fromPhoneNumber,
            To: toPhoneNumber,
            NumMedia: 0
        };
        // const signature = await TwilioSignatureUtil.generateTwilioSignature(
        //     SMS_GATEWAY,
        //     body,
        //     SMS_GATEWAY_TWILIO_AUTH_TOKEN
        // );
        const signature2 = await TwilioSignatureUtil._buildSignatureHeader(SMS_GATEWAY, body);
        // console.log('signature = ', signature)
        // console.log('signature2 = ', signature2)
        // const config = {
        //     method: 'POST',
        //     url: `${SMS_GATEWAY}/sms`,
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'X-Twilio-Signature': signature2
        //     },
        //     body
        // };

        console.log('body', body);
        // await AxiosUtils.axiosRequest(
        //     config,
        //     `request to SMS Gateway to send mock twilio message '${message}' from '${fromPhoneNumber}' to '${toPhoneNumber}'`
        // );

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Twilio-Signature': signature2
        };
        const response = await fetch(SMS_GATEWAY, {
            headers,
            body: QS.stringify(body),
            method: 'POST'
        });
        console.log('response', response);
    }
}
