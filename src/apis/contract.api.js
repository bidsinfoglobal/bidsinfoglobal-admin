import { axios } from "./axios";

export const fetchContractAwards = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/contract-award/list' + parmas);
}

export const insertContractAward = async (body) => {
    return await axios.post('/contract-award', body);
}

export const updateContractAward = async (body) => {
    return await axios.put('/contract-award', body);
}

export const deleteContractAward = async (id) => {
    return await axios.delete('/contract-award?_id=' + id);
}