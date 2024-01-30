import { createHmac } from 'crypto';

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
}
