import { AxiosUtils } from 'Apis/api-helpers/axios-utils';

export interface MockWhatsAppMessageDataType {
    senderContactId: number;
    senderAddress: string;
    senderEndpointId: string;
    recipientUserId: number;
    recipientAddress: string;
    recipientEndpointId: string;
    message: string;
}

export interface MockWhatsAppSenderType {
    senderGrid: number;
    senderWhatsAppNumber: string;
}

export class CoreController {
    static async generateMockWhatsAppUser(mockWhatsAppSender: MockWhatsAppSenderType, endpoint: string) {
        const { senderGrid, senderWhatsAppNumber } = mockWhatsAppSender;
        const config = {
            method: 'get',
            url: `${endpoint}/user/${senderGrid}/contacts?addressContext=CA&type=WHATSAPP&address=%2B${senderWhatsAppNumber}`,
            headers: {
                Accept: 'application/json'
            }
        };

        const response = await AxiosUtils.axiosRequest(
            config,
            'request to Core to generate a mock WhatsApp contact'
        );
        return response.data;
    }

    static async sendInboundWhatsAppRequest(
        mockWhatsAppMessageData: MockWhatsAppMessageDataType,
        endpoint: string
    ) {
        const config = {
            method: 'POST',
            url: `${endpoint}/external-conversation/send`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                charset: 'UTF-8'
            },
            data: {
                type: 'WHATSAPP',
                recipientUserId: mockWhatsAppMessageData.recipientUserId,
                recipientAddress: mockWhatsAppMessageData.recipientAddress,
                recipientEndpointId: mockWhatsAppMessageData.recipientEndpointId,
                senderContactId: mockWhatsAppMessageData.senderContactId,
                senderAddress: mockWhatsAppMessageData.senderAddress,
                senderEndpointId: mockWhatsAppMessageData.senderEndpointId,
                content: mockWhatsAppMessageData.message
            }
        };

        const response = await AxiosUtils.axiosRequest(
            config,
            'request to Core to generate a mock WhatsApp contact'
        );
        return response;
    }
}
