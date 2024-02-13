import { EnvUtils } from 'Apis/api-helpers/env-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import { CoreController } from 'Apis/core/core-controller';
import { GskController } from 'Apis/gas/gsk-controller';
import { CsrfController } from 'Apis/mds/csrf-controller';
import { MdsController } from 'Apis/mds/mds-controller';

export interface MockWhatsAppMessageType {
    senderPhoneNumber: string;
    receipientGrId: number;
    message: string;
}

export class MockWhatsAppController {
    static async sendInboundWhatsApp(input: MockWhatsAppMessageType) {
        const { senderPhoneNumber, receipientGrId, message } = input;
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

        const mockWhatsAppSender = {
            senderGrid: receipientGrId, // it doesn't matter what GRID we use as long as it is a valid one. So using receipient GrId as Sender GrId.
            senderWhatsAppNumber: senderPhoneNumber
        };
        const sender = await CoreController.generateMockWhatsAppUser(mockWhatsAppSender, CORE_ENDPOINT);

        const receipient = await mdsController.getUserByGrId(receipientGrId);
        const receipientEndPoints = receipient.endpoints;
        const receipientWhatsAppEndpoint = receipientEndPoints.find(
            (endpoint) => endpoint.type === 'WHATSAPP'
        );
        if (!receipientWhatsAppEndpoint.address) {
            const error = new Error();
            Log.error(`Whatsapp Mock Controller: Unable to find user's WhatsApp address`, error);
            throw error;
        }
        const recipientAddress = receipientWhatsAppEndpoint.address;
        const recipientEndpointId = receipientWhatsAppEndpoint.id;

        const mockWhatsAppMessageData = {
            senderContactId: sender.contactId,
            senderAddress: senderPhoneNumber,
            senderEndpointId: sender.endpointId,
            recipientUserId: receipient.grid,
            recipientAddress,
            recipientEndpointId,
            message
        };

        await CoreController.sendInboundWhatsAppRequest(mockWhatsAppMessageData, CORE_ENDPOINT);
    }
}
