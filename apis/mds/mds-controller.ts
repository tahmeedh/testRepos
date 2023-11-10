import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import axios from 'axios';

export class MdsController {
    endpoint: string;
    gsk: string;
    csrf: string;

    constructor(gsk: string, csrf: string, mdsEndpoint: string) {
        this.endpoint = mdsEndpoint;
        this.gsk = gsk;
        this.csrf = csrf;
    }

    async getUsersFromCompany(companyId: number) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
        const config = {
            method: 'get',
            url: `${this.endpoint}/company/${companyId}/users`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };
        try {
            Log.info(`...Sending request to MDS to request list of users from company  '${companyId}'`);
            const response = await axios.request(config);
            const listOfUsers = response.data.users;
            Log.success(`SUCCESS: List of users from compnay '${companyId}' obtained`);
            return listOfUsers;
        } catch (error) {
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }

    async getUserFromCompanyByEmail(companyId: number, email: string) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
        const config = {
            method: 'get',
            url: `${this.endpoint}/company/${companyId}/users?query=${email}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };
        try {
            Log.info(
                `...Sending request to MDS to retrieve user with email '${email}' from company  '${companyId}'`
            );
            const response = await axios.request(config);
            const user = response.data.users;
            Log.success(`SUCCESS: User with email '${email}' from compnay '${companyId}' obtained`);
            return user[0];
        } catch (error) {
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }
}
