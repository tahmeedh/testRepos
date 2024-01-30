import { createHmac, createSecretKey } from 'crypto';

interface BodyValue {
    AccountSid: string;
    Body: string;
    MessageSid: string;
    From: string;
    To: string;
    NumMedia: number;
    MediaContentType0?: string;
    MediaUrl0?: string;
}
export class TwilioSignatureUtil {
    static generateTwilioSignature(url: string, body: BodyValue, auth_token: string) {
        let fullUrl = url;
        fullUrl += `AccountSid${body.AccountSid}`;
        fullUrl += `Body${body.Body}`;
        fullUrl += `From${body.From}`;
        if (body.MediaContentType0 && body.MediaUrl0) {
            fullUrl += `MediaContentType0${body.MediaContentType0}`;
            fullUrl += `MediaURL0${body.MediaUrl0}`;
        }
        fullUrl += `MessageSid${body.MessageSid}`;
        fullUrl += `NumMedia${body.MessageSid}`;
        fullUrl += `To${body.To}`;

        // console.log('fullUrl = ', fullUrl)

        const unencodedSignature = createHmac('sha1', auth_token).update(fullUrl).digest('hex');

        // console.log('unencodedSignature = ', unencodedSignature)
        const signature = Buffer.from(unencodedSignature, 'utf8').toString('base64');
        // console.log('signature = ', signature)

        return signature;
    }

    static async _buildSignatureHeader(url, body) {
        const SMS_GATEWAY_TWILIO_AUTH_TOKEN = '_MOCK_AUTH_TOKEN_VALUE_32_CHARS_';
        const ALGORITHM = 'sha1';
        const textEncoder = new TextEncoder();
        const secret = createSecretKey(textEncoder.encode(SMS_GATEWAY_TWILIO_AUTH_TOKEN));
        const signingKey = createHmac(ALGORITHM, secret);
        let data = `${url}AccountSid${body.AccountSid}Body${body.Body}From${body.From}`;
        if (body.MediaContentType0 && body.MediaURL0) {
            data = `${data}MediaContentType0${body.MediaContentType0}MediaURL0${body.MediaURL0}`;
        }
        data = `${data}MessageSid${body.MessageSid}NumMedia${body.NumMedia}To${body.To}`;

        const signatureHeader = signingKey.update(textEncoder.encode(data)).digest('base64');
        return signatureHeader;
    }
}
