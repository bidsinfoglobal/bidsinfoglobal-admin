import { axios } from "./axios";

/**
 * fetch all function.
 *
 * @param {Object} params request body.
 * @return {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const fetchCustomerReports = async ({ pageNo, limit, sortBy, sortField, type }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&type=${type}`;
    return await axios.get('/reports/customer-reports' + parmas);
}

/**
 * 
 * @param {Object} body
 * @param {string} [body.from_date]
 * @param {string} [body.to_date]
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const generateReport = async (body) => {
    return await axios.post('/reports/customer-reports', body);
}

// /**
//  * 
//  * @param {Object} body 
//  * @returns {Promise<import("axios").AxiosResponse>} return axios response.
//  */
// export const StatusChangeCustomerReports = async (body) => {
//     return await axios.put('/auth/customers-status', body);
// }

// /**
//  * 
//  * @param {Object} body 
//  * @returns {Promise<import("axios").AxiosResponse>} return axios response.
//  */
// export const insertCustomerReports = async (body) => {
//     return await axios.post('/auth/customer-register', body);
// }

// /**
//  * 
//  * @param {Object} body 
//  * @returns {Promise<import("axios").AxiosResponse>} return axios response.
//  */
// export const updateCustomerReports = async (body) => {
//     return await axios.post('/auth/customer-profile', body);
// }