// import axios from "axios";
// import { Log } from "./log-utils";
// export class AxiosUtils {
//     static async axiosRetry(config, maxRetries: number) {
//         for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
//             if (retryCount > 0) {
//                 Log.warn(`...Retrying request: attempt ${retryCount}`)
//             }
//             try {
//                 const result = await axios.request(config);
//                 return result
//             } catch (error) {
//                 Log.error(`Error: Axios request attempt ${retryCount} failed: `, error.code)
//                 if (retryCount === maxRetries) {
//                     throw error(error)
//                 }
//             }
//         }
//     }
// }
