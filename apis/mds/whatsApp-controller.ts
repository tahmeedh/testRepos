import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
import { Log } from 'Apis/api-helpers/log-utils';
import axios from 'axios';

export class WhatsAppController {
    endpoint: string;
    gsk: string;
    csrf: string;

    constructor(gsk: string, csrf: string, mdsEndpoint: string) {
        this.endpoint = mdsEndpoint;
        this.gsk = gsk;
        this.csrf = csrf;
    }

    async addWhatsAppProviderToCompany(companyId: number, accountId: string) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
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
            Log.success(`SUCCESS: WhatsApp Provider '${accountId}' added to company '${companyId}'`);
            return result;
        } catch (error) {
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }

    async removeWhatsAppProviderFromCompany(companyId: number, accountId: string) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
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
            Log.success(
                `SUCCESS: WhatsApp Provider '${accountId}' has been removed from company '${companyId}'`
            );
            return result;
        } catch (error) {
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }

    async setWhatsAppAccountToActive(companyId: number, accountId: string) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
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
            Log.success(
                `SUCCESS: WhatsApp Provider '${accountId}' is now set to ACTIVE on company '${companyId}'`
            );
            return result;
        } catch (error) {
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }

    async assignWhatsAppAccountToUser(userId: number, accountId: string) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
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
            Log.success(`SUCCESS: WhatsApp Account '${accountId}' is assigned to user '${userId}'`);
            return result;
        } catch (error) {
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }

    async unassignWhatsAppAccountFromUser(userId: number, accountId: string) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
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
            Log.success(`SUCCESS: WhatsApp Account '${accountId}' is unassign to user '${userId}'`);
            return result;
        } catch (error) {
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }

    async getAllWhatsAppAccountFromCompany(companyId: number) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
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
            Log.success(`SUCCESS: A list of WhatsApp Account for '${companyId}' is obtained`);
            return result.data.accounts;
        } catch (error) {
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }
}
