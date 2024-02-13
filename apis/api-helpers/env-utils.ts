import { API_ENDPOINTS } from 'Apis/api-endpoints';
import 'dotenv/config';

export interface EndpointsType {
    ENV: string;
    MDS_ENDPOINT: string;
    SM_THRIFT_HOST: string;
    SM_THRIFT_PORT: number;
    GAS_LOGIN_ENDPOINT: string;
    GAS_SERVICE_URL: string;
    CORE_ENDPOINT: string;
}

export class EnvUtils {
    static getEndPoints() {
        const result: EndpointsType = {
            ENV: process.env.SERVER,
            MDS_ENDPOINT: API_ENDPOINTS.MDS_ENDPOINT[process.env.SERVER],
            SM_THRIFT_HOST: API_ENDPOINTS.SM_THRIFT_HOST[process.env.SERVER],
            SM_THRIFT_PORT: API_ENDPOINTS.SM_THRIFT_PORT[process.env.SERVER],
            GAS_LOGIN_ENDPOINT: API_ENDPOINTS.GAS_LOGIN_ENDPOINT[process.env.SERVER],
            GAS_SERVICE_URL: API_ENDPOINTS.GAS_SERVICE_URL[process.env.SERVER],
            CORE_ENDPOINT: API_ENDPOINTS.CORE_ENDPOINT[process.env.SERVER]
        };

        switch (process.env.SERVER) {
            case 'local':
            case 'cpqa2':
            case 'cpqa2-pd1':
            case 'cpqa2-pd2':
            case 'cpqa2-va1':
            case 'cpqa2-ca1':
            case 'cpqa2-sq1':
            case 'cpqa1':
                return result;
            default:
                throw new Error(
                    `FAILURE: process.env.SERVER ${process.env.SERVER} is invalid. Please check your .env file.`
                );
        }
    }

    static getAdminUser() {
        const admin_username = process.env.ADMIN_USERNAME;
        const admin_password = process.env.ADMIN_PASSWORD;
        if (!admin_username || !admin_password) {
            throw new Error(
                `FAILURE: ADMIN_USERNAME and ADMIN_PASSWORD' cannot be empty. Please check your .env file.`
            );
        }
        return {
            ADMIN_USERNAME: admin_username,
            ADMIN_PASSWORD: admin_password
        };
    }
}
