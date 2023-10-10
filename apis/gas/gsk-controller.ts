import { Log } from 'Apis/api-helpers/log-utils';
import { END_POINTS } from 'Apis/endpoints';
import axios from 'axios';

export class GskController {
    static async getGskToken(username: string, password: string, env: string) {
        try {
            const config = {
                method: 'post',
                url: END_POINTS.LOG_IN[env],
                headers: {
                    Accept: 'application/json',
                    X_GR_NO_REDIRECT: '1',
                    'Content-Type': 'application/json'
                },
                data: {
                    msgType: 'authportal.ServerAuthnPW',
                    userName: username,
                    password,
                    serviceName: 'grPortal',
                    svcUrl: END_POINTS.SERVICE_URL[env]
                }
            };

            Log.info('...Sending request to GAS to get GSK token');
            const response = await axios.request(config);
            const cookies = response.headers['set-cookie'];
            const gskCookie = cookies.filter((cookie: string) => cookie.includes('gsk='))[0];
            Log.suscess(`SUSCESS: GSK cookie obtained ${gskCookie}`);
            return gskCookie;
        } catch (error) {
            Log.error('FAILURE: Unable to get GSK token from GAS: ', error.response.data);
            throw error.response.data;
        }
    }
}
