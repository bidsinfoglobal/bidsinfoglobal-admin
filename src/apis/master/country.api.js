import { axios } from '../axios';

export const fetchCountries = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/masters/country-all' + parmas);
};

export const insertCountry = async (body) => {
    return await axios.post('/masters/country', body);
};

export const updateCountry = async (body) => {
    return await axios.put('/masters/country', body);
};

export const deleteCountry = async (id) => {
    return await axios.delete('/masters/country?_id=' + id);
};
