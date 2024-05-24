import { axios } from "./axios";


/**
 * fetch all function.
 *
 * @param {Object} params request body.
 * @return {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const fetchGrants = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/grants/list' + parmas);
}

/**
 * 
 * @param {Object} body 
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const insertGrant = async (body) => {
    return await axios.post('/grants', body);
}

/**
 * 
 * @param {Object} body 
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const updateGrant = async (body) => {
    return await axios.put('/grants', body);
}

/**
 * 
 * @param {String} id 
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const deleteGrant = async (id) => {
    return await axios.delete('/grants?_id=' + id);
}