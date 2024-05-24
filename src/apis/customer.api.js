import { axios } from "./axios";

/**
 * fetch all function.
 *
 * @param {Object} params request body.
 * @return {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const fetchCustomers = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords || ''}`;
    return await axios.get('/auth/customers' + parmas);
}

/**
 * 
 * @param {Object} body 
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const StatusChangeCustomer = async (body) => {
    return await axios.put('/auth/customers-status', body);
}

/**
 * 
 * @param {Object} body 
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const insertCustomer = async (body) => {
    return await axios.post('/auth/customer-register', body);
}

/**
 * 
 * @param {Object} body 
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const updateCustomer = async (body) => {
    return await axios.post('/auth/customer-profile', body);
}