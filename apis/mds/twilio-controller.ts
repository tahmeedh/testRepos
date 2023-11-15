import { AxiosUtils } from 'Apis/api-helpers/axios-utils';

export class TwilioController {
    endpoint: string;
    gsk: string;
    csrf: string;

    constructor(gsk: string, csrf: string, mdsEndpoint: string) {
        this.endpoint = mdsEndpoint;
        this.gsk = gsk;
        this.csrf = csrf;
    }

    async requestTwilioNumberToCompany(companyId: number, countryCode: string, prefix: string) {
        const { functionName } = AxiosUtils.getFunctionInfo();
        const { functionLocation } = AxiosUtils.getFunctionInfo();
        const config = {
            method: 'post',
            url: `${this.endpoint}/company/${companyId}/numbers`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            },
            data: {
                countryCode,
                prefix
            }
        };
        const response = await AxiosUtils.axiosRequest(
            config,
            2,
            `request to MDS to request phone number for company  '${companyId}'`,
            functionName,
            functionLocation
        );
        const phoneNumber = response.data.number;
        return phoneNumber;
    }

    async releaseTwilioNumberFromCompany(companyId: number, phoneNumber: string) {
        const { functionName } = AxiosUtils.getFunctionInfo();
        const { functionLocation } = AxiosUtils.getFunctionInfo();
        const config = {
            method: 'delete',
            url: `${this.endpoint}/company/${companyId}/number/${phoneNumber}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            },
            response: false
        };
        await AxiosUtils.axiosRequest(
            config,
            2,
            `request to MDS to release phone number '${phoneNumber}' from company '${companyId}'`,
            functionName,
            functionLocation
        );
    }

    async setTwilioNumberFeatures(companyId: number, phoneNumber: number, features: object) {
        const { functionName } = AxiosUtils.getFunctionInfo();
        const { functionLocation } = AxiosUtils.getFunctionInfo();
        const config = {
            method: 'put',
            url: `${this.endpoint}/company/${companyId}/number/${phoneNumber}/configuration`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            },
            data: features
        };
        await AxiosUtils.axiosRequest(
            config,
            2,
            `request to MDS to release phone number '${phoneNumber}' from company '${companyId}'`,
            functionName,
            functionLocation
        );
    }

    async assignTwilioNumberToUser(userId: number, phoneNumber: string) {
        const { functionName } = AxiosUtils.getFunctionInfo();
        const { functionLocation } = AxiosUtils.getFunctionInfo();
        const config = {
            method: 'post',
            url: `${this.endpoint}/users/sm:${userId}/number/${phoneNumber}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };
        await AxiosUtils.axiosRequest(
            config,
            2,
            `request to MDS to assign Twilio phone number '${phoneNumber}' to user '${userId}'`,
            functionName,
            functionLocation
        );
    }

    async unassignTwilioNumberFromUser(userId: number, phoneNumber: string) {
        const { functionName } = AxiosUtils.getFunctionInfo();
        const { functionLocation } = AxiosUtils.getFunctionInfo();
        const config = {
            method: 'delete',
            url: `${this.endpoint}/users/sm:${userId}/number/${phoneNumber}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };
        await AxiosUtils.axiosRequest(
            config,
            2,
            `request to MDS to unassign Twilio phone number '${phoneNumber}' from user '${userId}'`,
            functionName,
            functionLocation
        );
    }

    async getAllTwilioNumbersFromCompany(companyId: number) {
        const { functionName } = AxiosUtils.getFunctionInfo();
        const { functionLocation } = AxiosUtils.getFunctionInfo();
        const config = {
            method: 'get',
            url: `${this.endpoint}/company/${companyId}/numbers`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };
        const response = await AxiosUtils.axiosRequest(
            config,
            2,
            `request to MDS to get all Twilio numbers belong to company '${companyId}'`,
            functionName,
            functionLocation
        );
        return response.data.numbers;
    }
}
