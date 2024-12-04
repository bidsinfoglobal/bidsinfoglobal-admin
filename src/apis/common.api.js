import { axios } from "./axios";


export const AssignTendersToCustomer = async (body) => {
    return await axios.post('/auth/assign-data', body);
}
export const getCustomerDetail = async (id) => {
    return await axios.get(`/auth/customers-by-id?customer_id=${id}`);
}