import { Log } from 'Apis/api-helpers/log-utils';
import axios from 'axios';

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

        try {
            Log.info(
                `...Sending request to MDS to assign Bandwidth phone number '${phoneNumber}' to user '${userId}'`
            );
            await axios.request(config);
            Log.success(
                `SUCCESS: Bandwidth Phone number '${phoneNumber}' has been assigned to user '${userId}'`
            );
        } catch (error) {
            Log.error(
                `FAILURE: Unable to assign Bandwidth phone number '${phoneNumber}' to '${userId}': `,
                error.response.data
            );
            throw error.response.data;
        }
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

        try {
            Log.info(
                `...Sending request to MDS to unassign Bandwidth phone number '${phoneNumber}' from user '${userId}'`
            );
            await axios.request(config);
            Log.success(
                `SUCCESS: Bandwidth Phone number '${phoneNumber}' has been unassigned from user '${userId}'`
            );
        } catch (error) {
            Log.error(
                `FAILURE: Unable to unassign Bandwidth phone number '${phoneNumber}' from '${userId}': `,
                error.response.data
            );
            throw error.response.data;
        }
    }
}
