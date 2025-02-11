import { axios } from '../axios';

export const fetchCPVCode = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/masters/cpv-codes-all' + parmas);
};

export const insertCPVCode = async (body) => {
    return await axios.post('/masters/cpv-codes', body);
};

export const updateCPVCode = async (body) => {
    return await axios.put('/masters/cpv-codes', body);
};

export const deleteCPVCode = async (id) => {
    return await axios.delete('/masters/cpv-codes?_id=' + id);
};
