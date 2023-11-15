/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { Log } from './log-utils';

export class AxiosUtils {
    static getFunctionInfo() {
        const { stack } = new Error();
        const functionNameAndLocation = stack.split('\n')[2].trim();
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
        maxRetries: number,
        description: string,
        functionName: string,
        functionLocation: string
    ) {
        const timeout = 3000;
        let result;
        for (let retryCount = 1; retryCount < maxRetries + 1; retryCount++) {
            try {
                Log.info(`...${description} - attempt ${retryCount}`);
                result = await axios.request(config);
                Log.success(`${description} was successful`);
            } catch (error) {
                Log.warn(`...${error} - attempt ${retryCount} failed`);
                if (retryCount === maxRetries) {
                    const errorObject = {
                        message: `Action ${functionName} failed`,
                        location: functionName,
                        path: functionLocation,
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data
                    };
                    Log.error(`An error occured`, `${JSON.stringify(errorObject, null, 4)}`);
                    throw error;
                }
            }
            Log.info(`...Waiting for ${timeout}ms before retrying`);
            await new Promise((resolve) => {
                setTimeout(resolve, timeout);
            });
        }
        return result;
    }
}
