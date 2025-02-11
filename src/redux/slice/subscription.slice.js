import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast_popup } from '../../utils/toast';
import {
    StatusChangeSubscription,
    fetchPlans,
    fetchSubscriptions,
} from '../../apis/subscription.api';

const initialState = {
    records: [],
    plan_records: [],
    loading: false,
    pageNo: 0,
    count: 0,
    keywords: '',
    limit: 5,
    sortBy: -1,
    sortField: '_id',
};

const fetchSubscriptionRecords = createAsyncThunk(
    'subscription/fetchSubscriptionRecords',
    async (state, action) => {
        try {
            var response = await fetchSubscriptions();
            var result = response.data;

            if (!result.success) {
                throw new Error(result.message || 'Something went wrong!');
            }
            return result;
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message);
        }
    },
);

const fetchPlanRecords = createAsyncThunk(
    'plan/fetchPlanRecords',
    async (state, action) => {
        try {
            var response = await fetchPlans();
            var result = response.data;

            if (!result.success) {
                throw new Error(result.message || 'Something went wrong!');
            }
            return result;
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message);
        }
    },
);

const ActivatePlanRequest = createAsyncThunk(
    'subscription/activate-request',
    async (state, action) => {
        try {
            var response = await StatusChangeSubscription(state);
            var result = response.data;

            if (!result.success) {
                throw new Error(result.message || 'Something went wrong!');
            }
            return result.result;
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message);
        }
    },
);

export const regionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchSubscriptionRecords.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchSubscriptionRecords.fulfilled]: (state, action) => {
            state.records = action.payload.result.map((p) => ({
                ...p,
                _id: p._id,
                key: p._id,
            }));
            state.loading = false;
        },
        [fetchSubscriptionRecords.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [fetchPlanRecords.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchPlanRecords.fulfilled]: (state, action) => {
            state.plan_records = action.payload.result;
            state.loading = false;
        },
        [fetchPlanRecords.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [ActivatePlanRequest.pending]: (state, action) => {
            state.loading = true;
        },
        [ActivatePlanRequest.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('subscription status changed successfully', 'success');
        },
        [ActivatePlanRequest.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export { fetchSubscriptionRecords, ActivatePlanRequest, fetchPlanRecords };

export default regionSlice.reducer;
