import { API_ENDPOINTS } from 'Apis/api-endpoints';
import { Log } from 'Apis/api-helpers/log-utils';
import axios from 'axios';

export class WhatsAppController {
    env: string;
    endpoint: string;
    gsk: string;
    csrf: string;

    constructor(gsk: string, csrf: string, env: string) {
        this.env = env;
        this.endpoint = API_ENDPOINTS.MDS[this.env];
        this.gsk = gsk;
        this.csrf = csrf;
    }

    async addWhatsAppProviderToCompany(companyId: number, accountId: string) {
        const config = {
            method: 'post',
            url: `${this.endpoint}/company/${companyId}/providers/WHATSAPP/accounts`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            },
            data: {
                accountId,
                provider: 'WHATSAPP',
                type: 'FEDERATED'
            }
        };

        try {
            Log.info(`...Sending request to MDS to add WhatsApp Provider to company '${companyId}'`);
            const result = await axios.request(config);
            Log.suscess(`SUSCESS: WhatsApp Provider '${accountId}' added to company '${companyId}'`);
            return result;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to add WhatsApp Provider '${accountId}' to company '${companyId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async removeWhatsAppProviderFromCompany(companyId: number, accountId: string) {
        const config = {
            method: 'DELETE',
            url: `${this.endpoint}/company/${companyId}/providers/WHATSAPP/accounts/${accountId}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };

        try {
            Log.info(
                `...Sending request to MDS to remove WhatsApp Provider '${accountId}' from company '${companyId}'`
            );
            const result = await axios.request(config);
            Log.suscess(
                `SUSCESS: WhatsApp Provider '${accountId}' has been removed from company '${companyId}'`
            );
            return result;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to remove WhatsApp Provider '${accountId}' from company '${companyId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async setWhatsAppAccountToActive(companyId: number, accountId: string) {
        const config = {
            method: 'patch',
            url: `${this.endpoint}/company/${companyId}/providers/WHATSAPP/accounts/${accountId}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            },
            data: {
                status: 'ACTIVE'
            }
        };

        try {
            Log.info(
                `...Sending request to MDS to set WhatsApp Account '${accountId}' to ACTIVE on company '${companyId}'`
            );
            const result = await axios.request(config);
            Log.suscess(
                `SUSCESS: WhatsApp Provider '${accountId}' is now set to ACTIVE on company '${companyId}'`
            );
            return result;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to set WhatsApp Account '${accountId}' to ACTIVE on company '${companyId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async assignWhatsAppAccountToUser(userId: number, accountId: string) {
        const config = {
            method: 'post',
            url: `${this.endpoint}/users/sm:${userId}/providers/WHATSAPP/accounts/${accountId}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };

        try {
            Log.info(
                `...Sending request to MDS to assign WhatsApp Account '${accountId}' to user '${userId}'`
            );
            const result = await axios.request(config);
            Log.suscess(`SUSCESS: WhatsApp Account '${accountId}' is assigned to user '${userId}'`);
            return result;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to assign WhatsApp Account '${accountId}' from user '${userId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async unassignWhatsAppAccountFromUser(userId: number, accountId: string) {
        const config = {
            method: 'delete',
            url: `${this.endpoint}/users/sm:${userId}/providers/WHATSAPP/accounts/${accountId}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };

        try {
            Log.info(
                `...Sending request to MDS to unassign WhatsApp Account '${accountId}' to user '${userId}'`
            );
            const result = await axios.request(config);
            Log.suscess(`SUSCESS: WhatsApp Account '${accountId}' is unassign to user '${userId}'`);
            return result;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to unassign WhatsApp Account '${accountId}' from user '${userId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }

    async getAllWhatsAppAccountFromCompany(companyId: number) {
        const config = {
            method: 'get',
            url: `${this.endpoint}/company/${companyId}/providers/WHATSAPP/accounts`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'gr-csrf': this.csrf,
                Cookie: this.gsk
            }
        };

        try {
            Log.info(`...Sending request to MDS to get a list of WhatsApp Account from '${companyId}'`);
            const result = await axios.request(config);
            Log.suscess(`SUSCESS: A list of WhatsApp Account for '${companyId}' is obtained`);
            return result.data.accounts;
        } catch (error) {
            Log.error(
                `FAILURE: Unable to obtain list of WhatsApp Account from company '${companyId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }
}
