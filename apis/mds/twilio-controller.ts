import { Log } from 'Apis/api-helpers/log-utils';
import axios from 'axios';

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
        try {
            Log.info(`...Sending request to MDS to request phone number for company  '${companyId}'`);
            const response = await axios.request(config);
            const phoneNumber = response.data.number;
            Log.success(`SUCCESS: New phone number '${phoneNumber}' requested for company '${companyId}'`);
            return phoneNumber;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to request new phone number for company '${companyId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async releaseTwilioNumberFromCompany(companyId: number, phoneNumber: string) {
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

        try {
            Log.info(
                `...Sending request to MDS to release phone number '${phoneNumber}' from company '${companyId}'`
            );
            await axios.request(config);
            Log.success(
                `SUCCESS: Phone number '${phoneNumber}' has been released from company '${companyId}'`
            );
        } catch (error) {
            Log.error(
                `FAILURE: Unable to release Phone number '${phoneNumber}' from company '${companyId}: '`,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async setTwilioNumberFeatures(companyId: number, phoneNumber: number, features: object) {
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

        try {
            Log.info(
                `...Sending request to MDS to set Twilio phone number '${phoneNumber}' features for company '${companyId}'`
            );
            await axios.request(config);
            Log.success(
                `SUCCESS: Twilio Phone number '${phoneNumber}' features has been set for company '${companyId}'`
            );
        } catch (error) {
            Log.error(
                `FAILURE: Unable to release set Twilio phone number '${phoneNumber}' feature for company '${companyId}: '`,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async assignTwilioNumberToUser(userId: number, phoneNumber: string) {
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

        try {
            Log.info(
                `...Sending request to MDS to assign Twilio phone number '${phoneNumber}' to user '${userId}'`
            );
            await axios.request(config);
            Log.success(
                `SUCCESS: Twilio Phone number '${phoneNumber}' has been assigned to user '${userId}'`
            );
        } catch (error) {
            Log.error(
                `FAILURE: Unable to assign Twilio phone number '${phoneNumber}' to '${userId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async unassignTwilioNumberFromUser(userId: number, phoneNumber: string) {
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

        try {
            Log.info(
                `...Sending request to MDS to unassign Twilio phone number '${phoneNumber}' from user '${userId}'`
            );
            await axios.request(config);
            Log.success(
                `SUCCESS: Twilio Phone number '${phoneNumber}' has been unassigned from user '${userId}'`
            );
        } catch (error) {
            Log.error(
                `FAILURE: Unable to unassign Twilio phone number '${phoneNumber}' from '${userId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async getAllTwilioNumbersFromCompany(companyId: number) {
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

        try {
            Log.info(`...Sending request to MDS to get all Twilio numbers belong to company '${companyId}'`);
            const result = await axios.request(config);
            Log.success(`SUCCESS: Twilio numbers belong to company '${companyId}' obtained `);
            return result.data.numbers;
        } catch (error) {
            Log.error(
                `FAILURE: Unable get Twilio numbers belong to company '${companyId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }
}
