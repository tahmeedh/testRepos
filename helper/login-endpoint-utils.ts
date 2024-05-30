export class LoginEndpointUtils {
    static isLoginEndPointValid(endpoint: string) {
        switch (endpoint) {
            case 'local':
            case 'cpqa2':
            case 'cpqa2-pd1':
            case 'cpqa2-pd2':
            case 'cpqa2-va1':
            case 'cpqa2-ca1':
            case 'cpqa2-sq1':
            case 'cpqa1':
            case 'integ1':
            case 'prod':
            case 'stg1':
                return true;
            default:
                return false;
        }
    }
}
