import { axios } from "./axios";


/**
 * fetch all function.
 *
 * @param {Object} params request body.
 * @return {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const fetchTenders = async (params) => {
    return await axios.get('/tenders/list', { params: params });
}

/**
 * 
 * @param {Object} body 
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const insertTender = async (body) => {
    return await axios.post('/tenders', body);
}

/**
 * 
 * @param {Object} body 
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const updateTender = async (body) => {
    return await axios.put('/tenders', body);
}

/**
 * 
 * @param {String} id 
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const deleteTender = async (id) => {
    return await axios.delete('/tenders?_id=' + id);
}