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
            fullUrl += `MediaUrl0${body.MediaUrl0}`;
        }
        fullUrl += `MessageSid${body.MessageSid}`;
        fullUrl += `NumMedia${body.NumMedia}`;
        fullUrl += `To${body.To}`;

        const textEncoder = new TextEncoder();
        const secret = createSecretKey(textEncoder.encode(auth_token));
        const signingKey = createHmac('sha1', secret);
        const signatureHeader = signingKey.update(textEncoder.encode(fullUrl)).digest('base64');
        return signatureHeader;
    }
}
