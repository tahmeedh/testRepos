import { Log } from 'Apis/api-helpers/log-utils';
import { END_POINTS } from 'Apis/endpoints';
import axios from 'axios';

export class MdsController {
    env: string;
    constructor() {
        this.env = process.env.SERVER;
    }

    async getCsrfToken(gsk: string) {
        const config = {
            method: 'get',
            url: `${END_POINTS.MDS[this.env]}/csrf`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cookie: gsk
            }
        };

        try {
            Log.info('...Sending request to MDS to get CSRF cookie ');
            const response = await axios.request(config);
            Log.suscess('SUSCESS: CSRF token obtained');
            return response.data.token;
        } catch (error) {
            Log.error('FAILURE: Unable to get CSRF token from MDS', error);
            throw error;
        }
    }
}
