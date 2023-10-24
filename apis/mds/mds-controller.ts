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
            Log.error(
                `FAILURE: Unable to obtain list of users from company '${companyId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async getUserFromCompanyByEmail(companyId: number, email: string) {
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
            Log.error(
                `FAILURE: Unable to get users with email '${email}' from company '${companyId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }
}
