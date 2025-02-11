import { axios } from './axios';

/**
 * fetch all function.
 *
 * @param {Object} params request body.
 * @return {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const fetchSubscriptions = async () => {
    return await axios.get('/plan/request');
};

/**
 * fetch all function.
 *
 * @param {Object} params request body.
 * @return {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const fetchPlans = async () => {
    return await axios.get('/plan/list');
};

/**
 *
 * @param {Object} body
 * @param {string} [body.plan_request_id]
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const StatusChangeSubscription = async (body) => {
    return await axios.post('/plan/activate-request', body);
};
