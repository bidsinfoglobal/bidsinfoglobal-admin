import { axios } from '../axios';

export const fetchRegion = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/masters/regions-all' + parmas);
};
export const insertRegion = async (body) => {
    return await axios.post('/masters/regions', body);
};
export const updateRegion = async (body) => {
    return await axios.put('/masters/regions', body);
};
export const deleteRegion = async (id) => {
    return await axios.delete('/masters/regions?_id=' + id);
};
