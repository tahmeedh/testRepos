/* eslint-disable max-params */

import { createHmac } from 'crypto';

export class TwilioSignatureUtil {
    static generateTwilioSignature(
        url: string,
        accountSid: string,
        message: string,
        messageSid: string,
        fromPhoneNumber: string,
        toPhoneNumber: string,
        auth_token: string
    ) {
        let fullUrl = url;
        fullUrl += `AccountSid${accountSid}`;
        fullUrl += `Body${message}`;
        fullUrl += `From${fromPhoneNumber}`;
        fullUrl += `MessageSid${messageSid}`;
        fullUrl += `To${toPhoneNumber}`;

        // console.log('fullUrl = ', fullUrl)

        const unencodedSignature = createHmac('sha1', auth_token).update(fullUrl).digest('hex');

        // console.log('unencodedSignature = ', unencodedSignature)
        const signature = Buffer.from(unencodedSignature, 'utf8').toString('base64');
        // console.log('signature = ', signature)

        return signature;
    }
}
