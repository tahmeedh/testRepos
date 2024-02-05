import { AxiosUtils } from 'Apis/api-helpers/axios-utils';

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

        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to request list of users from company  '${companyId}'`
        );
        const listOfUsers = response.data.users;
        return listOfUsers;
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

        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to retrieve user with email '${email}' from company '${companyId}'`
        );
        const user = response.data.users;
        return user[0];
    }

    async getUserByGrId(grId: number) {
        const config = {
            method: 'get',
            url: `${this.endpoint}/users/gr:${grId}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };
        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to retrieve user with GrId '${grId}'`
        );
        const user = response.data;
        return user;
    }
}
