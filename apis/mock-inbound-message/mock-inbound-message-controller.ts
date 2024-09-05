import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { PhoneNumberUtils } from 'Apis/api-helpers/phoneNumber-utils';
import { CoreController, ExternalContactDataType, MockExternalMsgDataType } from 'Apis/core/core-controller';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { MdsController } from 'Apis/mds/mds-controller';
import { randomUUID } from 'crypto';

export interface MockMsgDataType {
    type: 'SMS' | 'WHATSAPP' | 'GROUPTEXT';
    senderPhoneNumber: string;
    content: string;
    attachmentId?: string;
    participants?: string[];
}
export class MockInboundMessageController {
    static async receiveInboundExternalMsg(grId: number, mockMsgData: MockMsgDataType) {
        const { GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL, MDS_ENDPOINT, CORE_ENDPOINT } = EnvUtils.getEndPoints();
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );

        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);
        const mdsController = new MdsController(gskToken, csrfToken, MDS_ENDPOINT);

        // get user's endpoint
        let serviceType: 'SMS_SERVICE' | 'WHATSAPP' = 'SMS_SERVICE';
        if (mockMsgData.type === 'WHATSAPP') {
            serviceType = 'WHATSAPP';
        }
        const USER_ENDPOINTS = await mdsController.getEndPointByGrId(grId, serviceType);

        // throw error if sender phone number is invalid
        if (!PhoneNumberUtils.isPhoneNumberValid(mockMsgData.senderPhoneNumber)) {
            throw new Error(
                `FAILURE: SenderPhoneNumber ${mockMsgData.senderPhoneNumber} is not a valid number. Please use E164 format e.g. +17786813456`
            );
        }

        // add external contact and get external contact endpoints
        let contactType: 'SMS' | 'WHATSAPP' = 'SMS';
        if (mockMsgData.type === 'WHATSAPP') {
            contactType = 'WHATSAPP';
        }
        const EXTERNAL_CONTACT_DATA: ExternalContactDataType = {
            senderPhoneNumber: mockMsgData.senderPhoneNumber,
            type: contactType
        };
        const EXTERNAL_CONTACT_ENDPOINT = await CoreController.addExternalContactToUser(
            grId,
            EXTERNAL_CONTACT_DATA,
            CORE_ENDPOINT
        );

        // send inbound Message

        const MSG_DATA: MockExternalMsgDataType = {
            type: serviceType,
            senderContactId: EXTERNAL_CONTACT_ENDPOINT.contactId,
            senderAddress: mockMsgData.senderPhoneNumber,
            senderEndpointId: EXTERNAL_CONTACT_ENDPOINT.endpointId,
            recipientUserId: grId,
            recipientAddress: USER_ENDPOINTS.address,
            recipientEndpointId: USER_ENDPOINTS.id,
            content: mockMsgData.content,
            attachmentId: mockMsgData.attachmentId
        };

        if (mockMsgData.type === 'GROUPTEXT') {
            // throw error if participant phone numbers are invalid
            const ALL_PARTICIPANTS_PHONENUMBER = mockMsgData.participants;
            for (const phoneNumber of ALL_PARTICIPANTS_PHONENUMBER) {
                if (!PhoneNumberUtils.isPhoneNumberValid(phoneNumber)) {
                    throw new Error(
                        `FAILURE: SenderPhoneNumber ${mockMsgData.senderPhoneNumber} is not a valid number. Please use E164 format e.g. +17786813456`
                    );
                }
            }

            MSG_DATA.groupId = randomUUID();
            MSG_DATA.participants = [USER_ENDPOINTS.address, mockMsgData.senderPhoneNumber].concat(
                mockMsgData.participants
            );
        }
        await CoreController.receiveExternalMsg(MSG_DATA, CORE_ENDPOINT);
    }
}
