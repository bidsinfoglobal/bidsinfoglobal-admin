import { axios } from "../axios";

export const fetchFundingAgencies = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/masters/funding-agency-all' + parmas);
}

export const insertFundingAgency = async (body) => {
    return await axios.post('/masters/funding-agency', body);
}

export const updateFundingAgency = async (body) => {
    return await axios.put('/masters/funding-agency', body);
}
export const deleteFundingAgency = async (id) => {
    return await axios.delete('/masters/funding-agency?_id=' + id);
}