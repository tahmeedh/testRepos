import { AxiosUtils } from 'Apis/api-helpers/axios-utils';

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
        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to add WhatsApp Provider to company '${companyId}'`
        );
        return response;
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
        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to remove WhatsApp Provider '${accountId}' from company '${companyId}'`
        );
        return response;
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
        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to set WhatsApp Account '${accountId}' to ACTIVE on company '${companyId}'`
        );
        return response;
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
        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to assign WhatsApp Account '${accountId}' to user '${userId}'`
        );
        return response;
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
        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to unassign WhatsApp Account '${accountId}' to user '${userId}'`
        );
        return response;
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

        const response = await AxiosUtils.axiosRequest(
            config,
            `request to MDS to get a list of WhatsApp Account from '${companyId}'`
        );
        return response.data.accounts;
    }
}
