import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
import { Log } from 'Apis/api-helpers/log-utils';
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
        // 2024 May 08: MDS informed us all North American numbers are routed to Bandwidth.
        // All Non-North American numbers will be routed to Twilio.
        // If you need a North American number, enter 'CA' for countryCode and '604' for prefix
        // If you need a Twilio number, enter 'GB' for countryCode and '44' for prefix
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

        let phoneNumber: string;

        if (response.data.provider === 'twilio') {
            phoneNumber = response.data.number;
        }

        if (response.data.provider === 'bandwidth') {
            const { orderId } = response.data;
            // All North American numbers are provided by bandwidth.
            // For bandwidth numbers, we don't get a number immediately from MDS's response.
            // So, getPhoneNumberByOrderId request to MDS in order to check the order status and get phonenumber when status is 'COMPLETED'.
            // retry 3 times, or until we get a valid phone number
            for (let retryCount = 1; retryCount < 4; retryCount++) {
                phoneNumber = await this.getPhoneNumberByOrderId(companyId, orderId);

                // end loop when phoneNumber is no longer null
                if (phoneNumber) {
                    break;
                }
                Log.warn(`Phone number is ${phoneNumber}. Retrying in 3 seconds. Attempt ${retryCount}.`);
                // wait for 3 seconds before next retry
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

    async setNumberFeatures(companyId: number, phoneNumber: string, features: object) {
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
