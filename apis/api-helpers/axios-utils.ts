import axios from "axios";
import { Log } from "./log-utils";
export class AxiosUtils {
    static getFunctionInfo() {
        const stack = new Error().stack
        const functionNameAndLocation = stack.split('\n')[2].trim();
        const functionName = functionNameAndLocation.split(' ')[1]
        const functionLocation = functionNameAndLocation.split(' ')[2]
        const result = {
            functionName,
            functionLocation
        }
        return result
    }

    static async handleAxiosError(functionName: string, functionLocation: string, error) {
        const errorObject = {
            message: `Action ${functionName} failed`,
            location: functionName,
            path: functionLocation,
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data
        }
        Log.error(`${JSON.stringify(errorObject, null, 4)}`)
        throw error.stack
    };

    static async axiosRetry(config, maxRetries: number) {
        for (let retryCount = 1; retryCount < maxRetries; retryCount++) {
            try {
                Log.warn(`... Request attempt ${retryCount}`)
                const result = await axios.request(config);
                return result
            } catch (error) {
                Log.error(`Error: Axios request attempt ${retryCount} failed: `, error.code)
                if (retryCount === maxRetries) {
                    throw error(error)
                }
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}
