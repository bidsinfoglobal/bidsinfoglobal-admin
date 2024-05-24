import { axios } from "./axios";


/**
 * User login function.
 *
 * @param {Object} data request body.
 * @return {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const UserLogin = async (data) => {
    return await axios.post('/auth/user-login', {
        ...data
    });
}