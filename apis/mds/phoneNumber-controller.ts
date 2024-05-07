import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
/* eslint-disable no-await-in-loop */

export class PhoneNumberController {
    endpoint: string;
    gsk: string;
    csrf: string;

    constructor(gsk: string, csrf: string, mdsEndpoint: string) {
        this.endpoint = mdsEndpoint;
        this.gsk = gsk;
        this.csrf = csrf;
    }

    async purchaseNumberForCompany(companyId: number, countryCode: string, prefix: string) {
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
            `request to MDS to request phone number for company '${companyId}'`
        );

        let { phoneNumber } = response.data;

        if (response.data.provider === 'bandwidth') {
            const { orderId } = response.data;

            // retry 3 times, or until we get a valid phone number
            for (let retryCount = 0; retryCount < 3; retryCount++) {
                phoneNumber = await this.getPhoneNumberByOrderId(companyId, orderId);

                // end loop when phoneNumber is no longer null
                if (phoneNumber) {
                    break;
                }

                // wait for 3 sections before next retry
                await new Promise((resolve) => {
                    setTimeout(resolve, 3000);
                });
            }
        }
        return phoneNumber;
    }

    async releaseNumberFromCompany(companyId: number, phoneNumber: string) {
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
            `request to MDS to release phone number '${phoneNumber}' from company '${companyId}'`
        );
    }

    async setNumberFeatures(companyId: number, phoneNumber: number, features: object) {
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
            `request to MDS to release phone number '${phoneNumber}' from company '${companyId}'`
        );
    }

    async assignNumberToUser(userId: number, phoneNumber: string) {
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
            `request to MDS to assign phone number '${phoneNumber}' to user '${userId}'`
        );
    }

    async unassignNumberFromUser(userId: number, phoneNumber: string) {
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
            `request to MDS to unassign phone number '${phoneNumber}' from user '${userId}'`
        );
    }

    async getAllNumbersFromCompany(companyId: number) {
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
            `request to MDS to get all numbers belong to company '${companyId}'`
        );
        return response.data.numbers;
    }

    async getPhoneNumberByOrderId(companyId: number, orderId: string) {
        const config = {
            method: 'get',
            url: `${this.endpoint}/company/${companyId}/orders/${orderId}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };

        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to get order status of ${orderId} belong to company '${companyId}'`
        );

        const { phoneNumber } = response.data;
        return phoneNumber;
    }
}
