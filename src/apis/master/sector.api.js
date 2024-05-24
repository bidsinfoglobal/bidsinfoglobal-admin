import { axios } from "../axios";


export const fetchSector = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/masters/sectors-all' + parmas);
}

export const insertSector = async (body) => {
    return await axios.post('/masters/sectors', body);
}

export const updateSector = async (form_data) => {
    return await axios.put('/masters/sectors', form_data);
}

export const deleteSector = async (id) => {
    return await axios.delete('/masters/sectors?_id=' + id);
}