import { AxiosUtils } from 'Apis/api-helpers/axios-utils';

export interface MockExternalMessageDataType {
    type: 'WHATSAPP' | 'SMS_SERVICE';
    senderContactId: number;
    senderAddress: string;
    senderEndpointId: string;
    recipientUserId: number;
    recipientAddress: string;
    recipientEndpointId: string;
    message: string;
    attachmentId?: string;
}

export interface MockExternalSenderType {
    senderGrid: number;
    senderExternalNumber: string;
    type: 'WHATSAPP' | 'SMS_SERVICE';
}

export class CoreController {
    static async generateMockExternalContact(mockExternalSender: MockExternalSenderType, endpoint: string) {
        const { senderGrid, senderExternalNumber, type } = mockExternalSender;
        let addressType: string;

        if (mockExternalSender.type === 'SMS_SERVICE') {
            addressType = 'SMS';
        }

        if (mockExternalSender.type === 'WHATSAPP') {
            addressType = 'WHATSAPP';
        }

        const config = {
            method: 'get',
            url: `${endpoint}/user/${senderGrid}/contacts?addressContext=CA&type=${addressType}&address=%2B${senderExternalNumber}`,
            headers: {
                Accept: 'application/json'
            }
        };

        const response = await AxiosUtils.axiosRequest(
            config,
            `request to Core to generate a mock external ${type} contact`
        );
        return response.data;
    }

    static async sendInboundExternalMessageRequest(mockData: MockExternalMessageDataType, endpoint: string) {
        const config = {
            method: 'POST',
            url: `${endpoint}/external-conversation/send`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                charset: 'UTF-8'
            },
            data: {
                type: mockData.type,
                recipientUserId: mockData.recipientUserId,
                recipientAddress: mockData.recipientAddress,
                recipientEndpointId: mockData.recipientEndpointId,
                senderContactId: mockData.senderContactId,
                senderAddress: mockData.senderAddress,
                senderEndpointId: mockData.senderEndpointId,
                content: mockData.message,
                attachmentId: mockData.attachmentId ? mockData.attachmentId : null
            }
        };

        const response = await AxiosUtils.axiosRequest(
            config,
            `request to Core to send a inbound ${mockData.type} message`
        );
        return response;
    }
}
