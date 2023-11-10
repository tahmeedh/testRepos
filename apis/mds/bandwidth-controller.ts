import { AxiosUtils } from 'Apis/api-helpers/axios-utils';
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
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation
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
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }

    async unassignBandwidthNumberFromUser(userId: number, phoneNumber: string) {
        const functionName = AxiosUtils.getFunctionInfo().functionName
        const functionLocation = AxiosUtils.getFunctionInfo().functionLocation

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
            await AxiosUtils.handleAxiosError(
                functionName,
                functionLocation,
                error
            )
        }
    }
}
