import { axios } from './axios';

export const FetchCMSByType = async (type) => {
    return await axios.get(`/cms/get-cms-data?type=${type}`);
};

export const UpdateServiceRecordData = async (body) => {
    return await axios.post('/cms/service-record-update', body);
};
export const UpdateAboutUs = async (form_data) => {
    return await axios.post('/cms/about-us-update', form_data);
};
export const UpdateAuthCMS = async (body) => {
    return await axios.post('/cms/auth-record-update', body);
};
export const UpdateContactUsCMS = async (body) => {
    return await axios.post('/cms/contact-us-update', body);
};

export const UpdateEprocurmentInfoCMS = async (body) => {
    return await axios.post('/cms/eprocurment-info-update', body);
};

export const UpdateEprocurmentRecordCMS = async (body) => {
    return await axios.post('/cms/eprocurment-record-update', body);
};
export const UpdateHomePageCMS = async (body) => {
    return await axios.post('/cms/home-page-update', body);
};
export const UpdateServiceInfoCMS = async (body) => {
    return await axios.post('/cms/service-info-update', body);
};

export const UpdateSocialLinksCMS = async (body) => {
    return await axios.post('/cms/social-link-update', body);
};

export const UpdateGrantsInfoCMS = async (body) => {
    return await axios.post('/cms/grants-info-update', body);
};

export const UpdateTenderInfoCMS = async (body) => {
    return await axios.post('/cms/tenders-info-update', body);
};

export const UpdateProjectInfoCMS = async (body) => {
    return await axios.post('/cms/project-info-update', body);
};
export const UpdateContractAwardInfoCMS = async (body) => {
    return await axios.post('/cms/contract-award-info-update', body);
};
