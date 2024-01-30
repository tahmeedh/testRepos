import { Client } from 'cassandra-driver';

export class SmsGatewayController {
    client: Client;
    constructor(smsGatewayClient: Client) {
        this.client = smsGatewayClient;
    }

    async getAccountSid(companyId: number) {
        const result = await this.client.execute(
            `SELECT account_id FROM company_account WHERE company_id = ${companyId};`
        );
        const firstRow = result.first();
        const values = firstRow.values();
        return values[0];
    }
}
