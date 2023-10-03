import { Log } from 'Apis/api-helpers/log-utils';
import { END_POINTS } from 'Apis/endpoints';

export class GasController {
    async getSessionId(username: string, password: string) {
        const header = new Headers();
        header.append('Accept', 'application/json');
        //stop GAS from redirecting
        header.append('X_GR_NO_REDIRECT', '1');

        const data = {
            msgType: 'authportal.ServerAuthnPW',
            userName: username,
            password,
            serviceName: 'grPortal',
            svcUrl: 'https://lb7-portal-cpqa2-nvan.dev-globalrelay.net/portal/login'
        };
        try {
            const response = await fetch(END_POINTS.LOG_IN['cpqa2-va1'], {
                method: 'POST',
                headers: header,
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            Log.error('There was an error', error);
            throw error;
        }
    }
}
