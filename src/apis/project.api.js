import { axios } from './axios';

/**
 * fetch all function.
 *
 * @param {Object} params request body.
 * @return {Promise<import("axios").AxiosResponse>} return axios response.
 */
// export const fetchProjects = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
//     var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
//     return await axios.get('/projects/list' + parmas);
// }
export const fetchProjects = async (params) => {
    // var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/projects/list', { params: params });
};

/**
 *
 * @param {Object} body
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const insertProject = async (body) => {
    return await axios.post('/projects', body);
};

/**
 *
 * @param {Object} body
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const updateProject = async (body) => {
    return await axios.put('/projects', body);
};

/**
 *
 * @param {String} id
 * @returns {Promise<import("axios").AxiosResponse>} return axios response.
 */
export const deleteProject = async (id) => {
    return await axios.delete('/projects?_id=' + id);
};
