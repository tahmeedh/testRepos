import { AxiosUtils } from 'Apis/api-helpers/axios-utils';

// {
//     type: addressType,
//     recipientUserId: mockData.recipientUserId,
//     recipientAddress: mockData.recipientAddress,
//     recipientEndpointId: mockData.recipientEndpointId,
//     senderContactId: mockData.senderContactId,
//     senderAddress: `+${mockData.senderAddress}`,
//     senderEndpointId: mockData.senderEndpointId,
//     content: mockData.message,
//     attachmentId: mockData.attachmentId ? mockData.attachmentId : null,
//     groupId: mockData.type === 'BANDWIDTH' ? randomUUID() : null,
//     participants:
//         mockData.type === 'BANDWIDTH'
//             ? [mockData.recipientAddress, `+${mockData.senderAddress}`].concat(
//                   mockData.additionalParticipants
//               )
//             : null
// }
export interface ExternalContactDataType {
    senderPhoneNumber: string;
    type: 'WHATSAPP' | 'SMS';
}
export interface MockExternalMsgDataType {
    type: 'WHATSAPP' | 'SMS_SERVICE';
    senderContactId: number;
    senderAddress: string;
    senderEndpointId: string;
    recipientUserId: number;
    recipientAddress: string;
    recipientEndpointId: string;
    content: string;
    attachmentId?: string;
    groupId?: string;
    participants?: string[];
}
export class CoreController {
    static async addExternalContactToUser(
        grId: number,
        externalContactData: ExternalContactDataType,
        endpoint: string
    ) {
        const { senderPhoneNumber, type } = externalContactData;
        const config = {
            method: 'get',
            url: `${endpoint}/user/${grId}/contacts?addressContext=CA&type=${type}&address=%2B${senderPhoneNumber}`,
            headers: {
                Accept: 'application/json'
            }
        };

        const response = await AxiosUtils.axiosRequest(
            config,
            `request to Core to add an external contact with phone number ${senderPhoneNumber}`
        );
        return response.data;
    }

    static async receiveExternalMsg(mockData: MockExternalMsgDataType, endpoint: string) {
        const config = {
            method: 'POST',
            url: `${endpoint}/external-conversation/send`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                charset: 'UTF-8'
            },
            data: mockData
        };
        const response = await AxiosUtils.axiosRequest(
            config,
            `request to Core to send a inbound ${mockData.type} message`
        );

        return response;
    }
}
