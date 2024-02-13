import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { CoreController, MockExternalMessageDataType } from 'Apis/core/core-controller';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { MdsController } from 'Apis/mds/mds-controller';

export interface MockInboundMessageType {
    senderPhoneNumber: string;
    receipientGrId: number;
    message: string;
    type: 'WHATSAPP' | 'TWILIO';
    attachmentId?: string;
}
export interface MockInboundMessageBandWidthType {
    senderPhoneNumber: string;
    receipientGrId: number;
    message: string;
    type: 'BANDWIDTH';
    attachmentId?: string;
    additionalParticipants: string[];
}
export class MockInboundMessageController {
    static async sendInboundMessage(input: MockInboundMessageType | MockInboundMessageBandWidthType) {
        const { senderPhoneNumber, receipientGrId, message, type, attachmentId } = input;
        const additionalParticipants = input.type === 'BANDWIDTH' ? input.additionalParticipants : null;
        const { ADMIN_USERNAME, ADMIN_PASSWORD } = EnvUtils.getAdminUser();
        const { MDS_ENDPOINT, GAS_LOGIN_ENDPOINT, GAS_SERVICE_URL, CORE_ENDPOINT } = EnvUtils.getEndPoints();

        const gskToken = await GskController.getGskToken(
            ADMIN_USERNAME,
            ADMIN_PASSWORD,
            GAS_LOGIN_ENDPOINT,
            GAS_SERVICE_URL
        );
        const csrfToken = await CsrfController.getCsrfToken(gskToken, MDS_ENDPOINT);
        const mdsController = new MdsController(gskToken, csrfToken, MDS_ENDPOINT);

        const mockExternalSender = {
            senderGrid: receipientGrId, // it doesn't matter what GRID we use as long as it is a valid one. So using receipient GrId as Sender GrId.
            senderExternalNumber: senderPhoneNumber,
            type
        };

        const sender = await CoreController.generateMockExternalContact(mockExternalSender, CORE_ENDPOINT);

        const receipient = await mdsController.getUserByGrId(receipientGrId);
        const receipientEndPoints = receipient.endpoints;
        // console.log('receipientEndPoints = ', receipientEndPoints)

        let addressType = '';
        if (type === 'BANDWIDTH') {
            addressType = 'SMS_SERVICE';
        }

        if (type === 'TWILIO') {
            addressType = 'SMS_SERVICE';
        }

        if (type === 'WHATSAPP') {
            addressType = 'WHATSAPP';
        }

        const receipientExternalEndpoint = receipientEndPoints.find(
            (endpoint) => endpoint.type === addressType
        );
        if (!receipientExternalEndpoint.address) {
            const error = new Error();
            Log.error(`Mock inbound message controller: Unable to find user's ${type} address`, error);
            throw error;
        }
        const recipientAddress = receipientExternalEndpoint.address;
        const recipientEndpointId = receipientExternalEndpoint.id;
        const mockData: MockExternalMessageDataType = {
            senderContactId: sender.contactId,
            senderAddress: senderPhoneNumber,
            senderEndpointId: sender.endpointId,
            recipientUserId: receipient.grid,
            recipientAddress,
            recipientEndpointId,
            message,
            type,
            attachmentId,
            additionalParticipants
        };

        await CoreController.sendInboundExternalMessageRequest(mockData, CORE_ENDPOINT);
    }
}
