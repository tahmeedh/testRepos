export interface TwilioMockFile {
    [key: string]: TwilioMockFileDetails;
}

export interface TwilioMockFileDetails {
    mime: string;
    path: string;
}

export const TWILIO_WIREMOCK_FILE = {
    PNG: {
        mime: 'image/png',
        path: '/v1/local/2010-04-01/Accounts/accountSid/Messages/MessageSid/Media/FileChecklist_icon.png'
    },
    JPEG: {
        mime: 'image/jpeg',
        path: '/v1/local/2010-04-01/Accounts/accountSid/Messages/MessageSid/Media/MESuccess.jpeg'
    },
    VCF: {
        mime: 'text/x-vcard',
        path: '/v1/local/2010-04-01/Accounts/accountSid/Messages/MessageSid/Media/FileTest_MMS_Contact.vcf'
    },
    PDF: {
        mime: 'application/pdf',
        path: '/v1/local/2010-04-01/Accounts/accountSid/Messages/MessageSid/Media/FileMESuccessUTF8_1.pdf'
    }
};
