import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slice/user.slice';
import serviceSlice from './slice/service.slice';
import eprocurmentSlice from './slice/eprocurment.slice';
import countrySlice from './slice/country.slice';
import stateSlice from './slice/state.slice';
import regionSlice from './slice/region.slice';
import sectorSlice from './slice/sector.slice';
import cpvcodeSlice from './slice/cpvcode.slice';
import grantSlice from './slice/grant.slice';
import contractawardSlice from './slice/contractaward.slice';
import projectSlice from './slice/project.slice';
import tenderSlice from './slice/tender.slice';
import fundingSlice from './slice/funding_agency.slice';
import customerSlice from './slice/customer.slice';
import customerReport from './slice/customer-reports.slice';
import subscriptionSlice from './slice/subscription.slice';
import citySlice from './slice/city.slice';

export const store = configureStore({
    reducer: {
        user: userSlice,
        service: serviceSlice,
        eprocurment: eprocurmentSlice,
        country: countrySlice,
        state: stateSlice,
        region: regionSlice,
        sector: sectorSlice,
        city: citySlice,
        cpvcode: cpvcodeSlice,
        grant: grantSlice,
        contract: contractawardSlice,
        project: projectSlice,
        tender: tenderSlice,
        funding: fundingSlice,
        customer: customerSlice,
        subscription: subscriptionSlice,
        customer_report: customerReport,
    },
});

export default store;
