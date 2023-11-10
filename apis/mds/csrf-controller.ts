import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import axios from 'axios';

export class CsrfController {
    static async getCsrfToken(gsk: string, mdsEndpoint: string) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
        const config = {
            method: 'get',
            url: `${mdsEndpoint}/csrf`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cookie: gsk
            }
        };

        try {
            Log.info('...Sending request to MDS to get CSRF cookie ');
            const response = await axios.request(config);
            const csrfToken = response.data.token;
            Log.success(`SUCCESS: CSRF token obtained: '${csrfToken}`);
            return csrfToken;
        } catch (error) {
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }
}
