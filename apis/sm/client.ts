import { Log } from './helpers/log-utils';

const thrift = require('thrift');
const PlatformService = require('./platform/thrift-generated/PlatformService');
const MessageService = require('./message/thrift-generated/MessageService');
const DirectoryService = require('./directory/thrift-generated/DirectoryService');

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
            Log.error('FAILURE: Connection Error:', err);
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
