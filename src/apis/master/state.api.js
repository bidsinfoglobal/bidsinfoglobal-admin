import { axios } from "../axios";


export const fetchStates = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/masters/states-all' + parmas);
}
export const insertState = async (body) => {
    return await axios.post('/masters/states', body);
}

export const updateState = async (body) => {
    return await axios.put('/masters/states', body);
}

export const deleteState = async (id) => {
    return await axios.delete('/masters/states?_id=' + id);
}