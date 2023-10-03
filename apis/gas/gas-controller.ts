import { Log } from 'Apis/api-helpers/log-utils';
import { END_POINTS } from 'Apis/endpoints';
import axios from 'axios';

export class GasController {
    endpoint: string;
    constructor() {
        this.endpoint = END_POINTS.LOG_IN[process.env.SERVER];
    }

    async getSessionId(username: string, password: string) {
        try {
            const data = {
                msgType: 'authportal.ServerAuthnPW',
                userName: username,
                password,
                serviceName: 'grPortal',
                svcUrl: END_POINTS.SERVICE_URL[process.env.SERVER]
            };

            const config = {
                method: 'post',
                url: this.endpoint,
                headers: {
                    Accept: 'application/json',
                    X_GR_NO_REDIRECT: '1',
                    'Content-Type': 'application/json'
                },
                data
            };

            const response = await axios.request(config);
            const cookies = response.headers['set-cookie'];
            const gskCookie = cookies.filter((cookie: string) => cookie.includes('gsk='))[0];
            Log.suscess('SUSCESS: GSK cookie obtained');
            return gskCookie;
        } catch (error) {
            Log.error('FAILURE: Unable to get GSK token from GAS', error);
            throw error;
        }
    }
}
