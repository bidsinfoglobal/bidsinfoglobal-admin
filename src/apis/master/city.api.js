import { axios } from "../axios";


export const fetchCities = async ({ pageNo, limit, sortBy, sortField, keywords }) => {
    var parmas = `?pageNo=${pageNo}&limit=${limit}&sortBy=${sortBy}&sortField=${sortField}&keywords=${keywords}`;
    return await axios.get('/masters/city-all' + parmas);
}
export const insertCity = async (body) => {
    return await axios.post('/masters/cities', body);
}

export const updateCity = async (body) => {
    return await axios.put('/masters/cities', body);
}

export const deleteCity = async (id) => {
    return await axios.delete('/masters/cities?_id=' + id);
}