import { axios } from "./axios";


export const AssignTendersToCustomer = async (body) => {
    return await axios.post('/auth/assign-tenders', body);
}