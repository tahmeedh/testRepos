import { AxiosUtils } from 'Apis/api-helpers/axios-utils';

export class CsrfController {
    static async getCsrfToken(gsk: string, mdsEndpoint: string) {
        const config = {
            method: 'get',
            url: `${mdsEndpoint}/csrf`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cookie: gsk
            }
        };

        const response = await AxiosUtils.axiosRequest(config, 'request to MDS for CSRF cookie');
        const csrfToken = response.data.token;
        return csrfToken;
    }
}
