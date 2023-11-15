/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { AXIOS_DEFAULT_SETTINGS } from 'Apis/axios.config';
import { Log } from './log-utils';

export class AxiosUtils {
    static getFunctionInfo() {
        const { stack } = new Error();
        const functionNameAndLocation = stack.split('\n')[3].trim();
        const functionName = functionNameAndLocation.split(' ')[1];
        const functionLocation = functionNameAndLocation.split(' ')[2];
        const result = {
            functionName,
            functionLocation
        };
        return result;
    }

    static async axiosRequest(
        config,
        description: string,
        maxRetries: number = AXIOS_DEFAULT_SETTINGS.retryCount
    ) {
        const timeout = AXIOS_DEFAULT_SETTINGS.retryTimeOut;
        const { functionName, functionLocation } = this.getFunctionInfo();

        for (let retryCount = 1; retryCount < maxRetries + 1; retryCount++) {
            try {
                Log.info(`...${description} - attempt ${retryCount}`);
                const result = await axios.request(config);
                Log.success(`${description} was successful`);
                return result;
            } catch (error) {
                Log.warn(`...${error} - attempt ${retryCount} failed`);
                const errorObject = {
                    message: `Action ${functionName} failed`,
                    location: functionName,
                    path: functionLocation,
                    status: error.response ? error.response.status : undefined,
                    statusText: error.response ? error.response.statusText : undefined,
                    data: error.response ? error.response.data : undefined
                };
                Log.error(`An error occured`, `${JSON.stringify(errorObject, null, 4)}`);
                if (retryCount === maxRetries) {
                    throw error;
                }
            }
            Log.info(`...Waiting for ${timeout}ms before retrying`);
            await new Promise((resolve) => {
                setTimeout(resolve, timeout);
            });
        }
        return null;
    }
}
