/* eslint no-restricted-syntax: 0 */

import * as thrift from 'thrift';
import * as PlatformService from './platform/thrift-generated/PlatformService';
import * as DirectoryService from './directory/thrift-generated/DirectoryService';
import * as MessageService from './message/thrift-generated/MessageService';

import { consoleColor } from './helpers/console-utils';

export class SMClient {
    host: string;
    port: number;
    constructor(host: string, port: number) {
        this.host = host;
        this.port = port;
    }

    _connect(service: string) {
        const connection = thrift.createHttpConnection(this.host, this.port, {
            transport: thrift.TBufferedTransport,
            protocol: thrift.TJSONProtocol,
            path: `/core/thrift/${service}.thrift`,
            headers: {
                Connection: 'close'
            },
            https: true
        });

        connection.on('error', (err) => {
            console.error(consoleColor.FgRed, 'FAILURE: Connection Error:', err);
            throw err;
        });
        return connection;
    }

    get platform() {
        return thrift.createHttpClient(PlatformService, this._connect('Platform'));
    }

    get directory() {
        return thrift.createHttpClient(DirectoryService, this._connect('Directory'));
    }

    get message() {
        return thrift.createHttpClient(MessageService, this._connect('Message'));
    }
}
