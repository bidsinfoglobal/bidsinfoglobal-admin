import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast_popup } from '../../utils/toast';
import {
    fetchCustomers,
    insertCustomer,
    StatusChangeCustomer,
    updateCustomer,
} from '../../apis/customer.api';

const initialState = {
    records: [],
    loading: false,
    pagination: {
        pageNo: 0,
        limit: 15,
        sortBy: -1,
        sortField: '_id',
        keywords: '',
        count: 0,
    },
};

const changeCustomerParameter = createAsyncThunk(
    'customer/changeCustomerParameter',
    async (state, action) => {
        return state;
    },
);

const fetchCustomerRecords = createAsyncThunk(
    'customer/fetchCustomerRecords',
    async (state, action) => {
        try {
            const response = await fetchCustomers(state);
            const result = response.data;

            if (!result.success) {
                throw new Error(result.message || 'Something went wrong!');
            }
            return result.result;
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message);
        }
    },
);

const StatusChangeCustomerRecord = createAsyncThunk(
    'customer/statusChangeCustomerRecord',
    async (state, action) => {
        try {
            const response = await StatusChangeCustomer(state);
            const result = response.data;

            if (!result.success) {
                throw new Error(result.message || 'Something went wrong!');
            }
            return result.result;
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message);
        }
    },
);

const insertCustomerRecord = createAsyncThunk(
    'customer/insertCustomerRecord',
    async (state, action) => {
        try {
            const response = await insertCustomer(state);
            const result = response.data;

            if (!result.success) {
                throw new Error(result.message || 'Something went wrong!');
            }
            return result.result;
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message);
        }
    },
);

const updateCustomerRecord = createAsyncThunk(
    'customer/updateCustomerRecord',
    async (state, action) => {
        try {
            const response = await updateCustomer(state);
            const result = response.data;

            if (!result.success) {
                throw new Error(result.message || 'Something went wrong!');
            }
            return result.result;
        } catch (err) {
            throw new Error(err?.response?.data?.message || err.message);
        }
    },
);

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {},
    extraReducers: {
        [changeCustomerParameter.fulfilled]: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        [fetchCustomerRecords.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchCustomerRecords.fulfilled]: (state, action) => {
            state.records = action.payload.result.map((p) => ({
                ...p,
                key: p._id,
            }));
            state.loading = false;
            state.pagination = {
                ...state.pagination,
                pageNo: Number(action.payload.pageNo),
                limit: Number(action.payload.limit),
                sortBy: Number(action.payload.sortBy),
                sortField: action.payload.sortField,
                keywords: action.payload.keywords || '',
                count: Number(action.payload.count),
            };
        },
        [fetchCustomerRecords.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [StatusChangeCustomerRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [StatusChangeCustomerRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('Customer status changed successfully', 'success');
        },
        [StatusChangeCustomerRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [insertCustomerRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [insertCustomerRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('Customer created successfully', 'success');
        },
        [insertCustomerRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [updateCustomerRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [updateCustomerRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('Customer updated successfully', 'success');
        },
        [updateCustomerRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
    },
});

// Export Thunks
export {
    fetchCustomerRecords,
    changeCustomerParameter,
    StatusChangeCustomerRecord,
    insertCustomerRecord,
    updateCustomerRecord,
};

// Export Reducer
export default customerSlice.reducer;
