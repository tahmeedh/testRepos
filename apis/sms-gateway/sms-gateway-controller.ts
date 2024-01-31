import { Log } from 'Apis/api-helpers/log-utils';
import { Client } from 'cassandra-driver';

export class SmsGatewayController {
    client: Client;
    constructor(smsGatewayClient: Client) {
        this.client = smsGatewayClient;
    }

    async getAccountSid(companyId: number) {
        Log.info(`..request to SMS gateway Cassandra database to get account id from company '${companyId}'`);
        const result = await this.client.execute(
            `SELECT account_id FROM company_account WHERE company_id = ${companyId};`
        );
        const firstRow = result.first();
        const values = firstRow.values();
        Log.success(`obtained accountSid '${values}' from companyId '${companyId}'`);
        return values[0];
    }
}
