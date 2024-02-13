import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
import { randomUUID } from 'crypto';

export interface MockExternalMessageDataType {
    type: 'WHATSAPP' | 'TWILIO' | 'BANDWIDTH';
    senderContactId: number;
    senderAddress: string;
    senderEndpointId: string;
    recipientUserId: number;
    recipientAddress: string;
    recipientEndpointId: string;
    message: string;
    attachmentId?: string;
    additionalParticipants?: string[];
}

export interface MockExternalSenderType {
    senderGrid: number;
    senderExternalNumber: string;
    type: 'WHATSAPP' | 'TWILIO' | 'BANDWIDTH';
}

export class CoreController {
    static async generateMockExternalContact(mockExternalSender: MockExternalSenderType, endpoint: string) {
        const { senderGrid, senderExternalNumber, type } = mockExternalSender;
        let addressType: string;
        if (mockExternalSender.type === 'BANDWIDTH') {
            addressType = 'SMS'; // BANDWIDTH AND TWILIO are both considered SMS
        }

        if (mockExternalSender.type === 'TWILIO') {
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
        let addressType: string;
        if (mockData.type === 'BANDWIDTH') {
            addressType = 'SMS_SERVICE';
        }

        if (mockData.type === 'TWILIO') {
            addressType = 'SMS_SERVICE';
        }

        if (mockData.type === 'WHATSAPP') {
            addressType = 'WHATSAPP';
        }
        const config = {
            method: 'POST',
            url: `${endpoint}/external-conversation/send`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                charset: 'UTF-8'
            },
            data: {
                type: addressType,
                recipientUserId: mockData.recipientUserId,
                recipientAddress: mockData.recipientAddress,
                recipientEndpointId: mockData.recipientEndpointId,
                senderContactId: mockData.senderContactId,
                senderAddress: `+${mockData.senderAddress}`,
                senderEndpointId: mockData.senderEndpointId,
                content: mockData.message,
                attachmentId: mockData.attachmentId ? mockData.attachmentId : null,
                groupId: mockData.type === 'BANDWIDTH' ? randomUUID() : null,
                participants:
                    mockData.type === 'BANDWIDTH'
                        ? [mockData.recipientAddress, `+${mockData.senderAddress}`].concat(
                              mockData.additionalParticipants
                          )
                        : null
            }
        };
        const response = await AxiosUtils.axiosRequest(
            config,
            `request to Core to send a inbound ${mockData.type} message`
        );

        return response;
    }
}
