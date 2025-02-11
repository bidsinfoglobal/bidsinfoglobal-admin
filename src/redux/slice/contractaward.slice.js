import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast_popup } from '../../utils/toast';
import {
    fetchContractAwards,
    insertContractAward,
    updateContractAward,
    deleteContractAward,
} from '../../apis/contract.api';

const initialState = {
    records: [],
    loading: false,
    pageNo: 0,
    count: 0,
    keywords: '',
    limit: 5,
    sortBy: -1,
    sortField: '_id',
};

const changeContractAwardParameter = createAsyncThunk(
    'contractaward/changeContractAwardParameter',
    async (state, action) => {
        return state;
    },
);

const fetchContractAwardRecords = createAsyncThunk(
    'contractaward/fetchContractAwardRecords',
    async (state, action) => {
        try {
            // { pageNo, limit, sortBy, sortField, keywords }
            var response = await fetchContractAwards(state);
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

const insertContractAwardRecord = createAsyncThunk(
    'contractaward/insertContractAwardRecord',
    async (state, action) => {
        try {
            var response = await insertContractAward(state);
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

const updateContractAwardRecord = createAsyncThunk(
    'contractaward/updateContractAwardRecord',
    async (state, action) => {
        try {
            var response = await updateContractAward(state);
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

const deleteContractAwardRecord = createAsyncThunk(
    'contractaward/deleteContractAwardRecord',
    async (state, action) => {
        try {
            var response = await deleteContractAward(state.id);
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

export const contractawardSlice = createSlice({
    name: 'contractaward',
    initialState,
    reducers: {},
    extraReducers: {
        [changeContractAwardParameter.pending]: (state, action) => {
            // state.loading = true;
        },
        [changeContractAwardParameter.fulfilled]: (state, action) => {
            const { pageNo, limit, sortBy, sortField, keywords, count } = action.payload;
            if (pageNo || pageNo === 0) state.pageNo = pageNo;

            if (limit || limit === 0) state.limit = limit;

            if (sortBy) state.sortBy = sortBy;

            if (sortField) state.sortField = sortField;

            if (keywords) state.keywords = keywords;

            if (count || count === 0) state.count = count;
        },
        [changeContractAwardParameter.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [fetchContractAwardRecords.pending]: (state, action) => {
            state.loading = true;
        },
        [fetchContractAwardRecords.fulfilled]: (state, action) => {
            state.records = action.payload.result.map((p) => ({
                ...p,
                _id: p._id,
                key: p._id,
            }));
            state.loading = false;

            state.pageNo = Number(action.payload.pageNo);
            state.limit = Number(action.payload.limit);
            state.sortBy = Number(action.payload.sortBy);
            state.sortField = action.payload.sortField;
            state.keywords = action.payload.keywords || '';
            state.count = Number(action.payload.count);
            state.query = JSON.stringify(action.payload.query);
        },
        [fetchContractAwardRecords.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [insertContractAwardRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [insertContractAwardRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('contract award created successfully', 'success');
        },
        [insertContractAwardRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [updateContractAwardRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [updateContractAwardRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('contract award updated successfully', 'success');
        },
        [updateContractAwardRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
        [deleteContractAwardRecord.pending]: (state, action) => {
            state.loading = true;
        },
        [deleteContractAwardRecord.fulfilled]: (state, action) => {
            state.loading = false;
            toast_popup('contract award deleted successfully', 'success');
        },
        [deleteContractAwardRecord.rejected]: (state, action) => {
            toast_popup(action.error.message, 'error');
            state.loading = false;
        },
    },
});

// Action creators are generated for each case reducer function
export {
    fetchContractAwardRecords,
    updateContractAwardRecord,
    insertContractAwardRecord,
    deleteContractAwardRecord,
    changeContractAwardParameter,
};

export default contractawardSlice.reducer;
