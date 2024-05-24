import { axios } from "./axios";

/**
 * fetch all function.
 *
 * @return {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const fetchDashboardData = async () => {
    return new Promise(async (res, rej) => {
        try {
            var response = await axios.get('/common/dashboard');
            res(response.data.result);
        } catch (error) {
            rej(error)
        }
    })
}