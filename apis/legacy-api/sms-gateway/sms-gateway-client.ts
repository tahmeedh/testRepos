import { Log } from 'Apis/api-helpers/log-utils';

import { Client } from 'cassandra-driver';

export class SmsGatewayClient {
    client: Client;
    constructor() {
        this.client = undefined;
    }
    async _connect(contactPoints: string, keyspace: string, localDataCenter: string) {
        this.client = new Client({
            contactPoints: [contactPoints],
            keyspace,
            localDataCenter,
            sslOptions: {
                rejectUnauthorized: false
            }
        });
        this.client.connect((err) => {
            if (err) {
                Log.error('Connection Error:', err);
            }
        });
        Log.success('Connected to SMS gateway Cassandra databsse');
        return this.client;
    }

    async _disconnect() {
        await this.client.shutdown();
        Log.success('Disconnected from SMS gateway Cassandra database');
    }
}
