import { AxiosUtils } from 'Apis/api-helpers/axios-utils';

export class GskController {
    static async getGskToken(username: string, password: string, gasEndpoint: string, gasServiceUrl: string) {
        const { functionName } = AxiosUtils.getFunctionInfo();
        const { functionLocation } = AxiosUtils.getFunctionInfo();

        const config = {
            method: 'post',
            url: gasEndpoint,
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
                svcUrl: gasServiceUrl
            }
        };

        const response = await AxiosUtils.axiosRequest(
            config,
            2,
            'request to GAS to get GSK token',
            functionName,
            functionLocation
        );
        const cookies = response.headers['set-cookie'];
        const gskCookie = cookies.filter((cookie: string) => cookie.includes('gsk='))[0];
        if (gskCookie) {
            return gskCookie;
        }
        throw new Error(JSON.stringify(response.data));
    }
}
