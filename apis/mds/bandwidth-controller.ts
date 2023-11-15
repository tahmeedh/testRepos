import { AxiosUtils } from 'Apis/api-helpers/axios-utils';

export class BandwidthController {
    endpoint: string;
    gsk: string;
    csrf: string;

    constructor(gsk: string, csrf: string, mdsEndpoint: string) {
        this.endpoint = mdsEndpoint;
        this.gsk = gsk;
        this.csrf = csrf;
    }

    async assignBandwidthNumberToUser(userId: number, phoneNumber: string) {
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
            `request to MDS to assign Bandwidth phone number '${phoneNumber}' to user '${userId}'`
        );
    }

    async unassignBandwidthNumberFromUser(userId: number, phoneNumber: string) {
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
            `...request to MDS to unassign Bandwidth phone number '${phoneNumber}' from user '${userId}'`
        );
    }
}
